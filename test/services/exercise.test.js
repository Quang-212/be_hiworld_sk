const app = require('../../src/app');

describe('\'exercise\' service', () => {
  it('registered the service', () => {
    const service = app.service('exercise');
    expect(service).toBeTruthy();
  });
});
