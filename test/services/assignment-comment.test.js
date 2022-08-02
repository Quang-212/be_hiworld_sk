const app = require('../../src/app');

describe('\'assignment-comment\' service', () => {
  it('registered the service', () => {
    const service = app.service('assignment-comment');
    expect(service).toBeTruthy();
  });
});
