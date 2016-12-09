import test from 'ava';
import * as webdriverio from 'webdriverio';

// holds the absolute path of the project, defined by webpack
declare var __dirname__: string;

let client = webdriverio.remote({
    desiredCapabilities: { browserName: 'chrome' }
});

test.before(async t => {
    await client.init()
        .url('file://' + __dirname__ + '/dist/index.html')
        .waitForVisible('body');
});

test.after.always(async t => {
    await client.end();
});

test('has a body element', async t => {
    const body = await client.getText('body');
});