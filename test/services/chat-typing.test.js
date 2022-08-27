const app = require('../../src/app');

describe('\'chat-typing\' service', () => {
  it('registered the service', () => {
    const service = app.service('chat-typing');
    expect(service).toBeTruthy();
  });
});
