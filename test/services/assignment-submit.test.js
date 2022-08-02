const app = require('../../src/app');

describe('\'assignment-submit\' service', () => {
  it('registered the service', () => {
    const service = app.service('assignment-submit');
    expect(service).toBeTruthy();
  });
});
