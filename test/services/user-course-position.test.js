const app = require('../../src/app');

describe('\'user-course-position\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-course-position');
    expect(service).toBeTruthy();
  });
});
