const app = require('../../src/app');

describe('\'user-course\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-course');
    expect(service).toBeTruthy();
  });
});
