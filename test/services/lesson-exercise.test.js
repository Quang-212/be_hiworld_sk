const app = require('../../src/app');

describe('\'lesson-exercise\' service', () => {
  it('registered the service', () => {
    const service = app.service('lesson-exercise');
    expect(service).toBeTruthy();
  });
});
