const app = require('../../src/app');

describe('\'course-comment\' service', () => {
  it('registered the service', () => {
    const service = app.service('course-comment');
    expect(service).toBeTruthy();
  });
});
