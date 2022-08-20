const app = require('../../src/app');

describe('\'exercise-suggestion\' service', () => {
  it('registered the service', () => {
    const service = app.service('exercise-suggestion');
    expect(service).toBeTruthy();
  });
});
