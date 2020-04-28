const t = require('../routes/images').testfunc

test('adds 1 + 2 to equal 3', () => {
  expect(t(1, 2)).toBe(3);
});