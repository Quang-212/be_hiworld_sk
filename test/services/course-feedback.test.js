const app = require('../../src/app');

describe('\'course-feedback\' service', () => {
  it('registered the service', () => {
    const service = app.service('course-feedback');
    expect(service).toBeTruthy();
  });
});
