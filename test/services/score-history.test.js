const app = require('../../src/app');

describe('\'score-history\' service', () => {
  it('registered the service', () => {
    const service = app.service('score-history');
    expect(service).toBeTruthy();
  });
});
