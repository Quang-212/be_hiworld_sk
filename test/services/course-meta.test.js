const app = require('../../src/app');

describe('\'course-meta\' service', () => {
  it('registered the service', () => {
    const service = app.service('course-meta');
    expect(service).toBeTruthy();
  });
});
