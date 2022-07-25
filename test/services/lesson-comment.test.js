const app = require('../../src/app');

describe('\'lesson-comment\' service', () => {
  it('registered the service', () => {
    const service = app.service('lesson-comment');
    expect(service).toBeTruthy();
  });
});
