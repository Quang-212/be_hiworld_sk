const app = require('../../src/app');

describe('\'assignment-chat\' service', () => {
  it('registered the service', () => {
    const service = app.service('assignment-chat');
    expect(service).toBeTruthy();
  });
});
