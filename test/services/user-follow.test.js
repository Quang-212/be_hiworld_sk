const app = require('../../src/app');

describe('\'user-follow\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-follow');
    expect(service).toBeTruthy();
  });
});
