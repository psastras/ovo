import * as express from 'express';
import * as path from 'path';
import * as process from 'process';
import * as CLSContext from 'zipkin-context-cls';
import { Tracer, ExplicitContext, BatchRecorder } from 'zipkin';
import { HttpLogger } from 'zipkin-transport-http';
import { expressMiddleware as zipkinMiddleware } from 'zipkin-instrumentation-express';
import * as request from 'request';

process.on('uncaughtException', (err) => {
  console.log('Caught exception: ' + err);
});

const zipkinBaseUrl = 'http://zipkin:9411';
const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: `${zipkinBaseUrl}/api/v1/spans`,
  }),
});

const ctxImpl = new CLSContext('zipkin');
const tracer = new Tracer({ctxImpl, recorder});

const app = express();
const unless = (path, middleware) => {
  return (req, res, next) => {
    if (req.path.match(path)) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

app.use(unless('\/api.*', zipkinMiddleware({
  tracer,
  serviceName: 'ovo-server',
})));

// proxies api requests to zipkin
app.use('/api/', (req, res) => {
  const url = `http://zipkin:9411${req.url}`;
  req.pipe(request[req.method.toLowerCase()]({ url, json: req.body })).pipe(res);
});

app.use(express.static('dist'));

app.listen(8080);