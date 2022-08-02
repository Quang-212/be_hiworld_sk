const app = require('../../src/app');

describe('\'user-room\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-room');
    expect(service).toBeTruthy();
  });
});
