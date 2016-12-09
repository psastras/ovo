const selenium = require('selenium-standalone');
import * as ava from 'ava';
import * as child_process from 'child_process';

selenium.start((err, child) => {
  if (err) {
    console.error(err);
  }
  const test = child_process.exec('npm run integrationtest:test');
  test.stdout.on('data', (data) => {
    console.log(data);
  });

  test.stderr.on('data', (data) => {
    console.error(data);
  });

  test.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    child.kill();
    process.exit(code);
  });
});