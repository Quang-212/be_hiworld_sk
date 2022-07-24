const app = require('../../src/app');

describe('\'friendship \' service', () => {
  it('registered the service', () => {
    const service = app.service('friendship');
    expect(service).toBeTruthy();
  });
});
