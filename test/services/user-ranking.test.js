const app = require('../../src/app');

describe('\'user-ranking\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-ranking');
    expect(service).toBeTruthy();
  });
});
