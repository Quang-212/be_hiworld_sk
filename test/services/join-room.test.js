const app = require('../../src/app');

describe('\'join-room\' service', () => {
  it('registered the service', () => {
    const service = app.service('join-room');
    expect(service).toBeTruthy();
  });
});
