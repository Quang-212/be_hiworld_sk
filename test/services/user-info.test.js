const app = require('../../src/app');

describe('\'user-info\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-info');
    expect(service).toBeTruthy();
  });
});
