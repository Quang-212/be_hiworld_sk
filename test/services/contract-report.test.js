const app = require('../../src/app');

describe('\'contract-report\' service', () => {
  it('registered the service', () => {
    const service = app.service('contract-report');
    expect(service).toBeTruthy();
  });
});
