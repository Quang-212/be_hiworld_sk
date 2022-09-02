const app = require('../../src/app');

describe('\'calling\' service', () => {
  it('registered the service', () => {
    const service = app.service('calling');
    expect(service).toBeTruthy();
  });
});
