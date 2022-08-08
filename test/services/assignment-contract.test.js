const app = require('../../src/app');

describe('\'assignment-contract\' service', () => {
  it('registered the service', () => {
    const service = app.service('assignment-contract');
    expect(service).toBeTruthy();
  });
});
