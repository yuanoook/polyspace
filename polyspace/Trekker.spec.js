const Space = require('./Space')

const trekkingLog = require('./data.-2+3x')

it('successor.spec.js', async () => {
  expect(1).toBe(1)
  expect(typeof trekkingLog).toBe('string')

  const log = parseTrekkingLog()
  expect(typeof log).toBe('object')
  expect(Array.isArray(log)).toBe(true)
  expect(Array.isArray(log[0])).toBe(true)

  // Trekker function

  // F(n+m) = F(n) + [F(n) - F(n-m)]
  //        = 2 * F(n) - F(n-m)

  // F(n+tm) = F(n) + t[F(n) - F(n-m)]
  //           (t+1) * F(n) - t * F(n-m)

  // F(n) = Sum(F(n-r)...F(n+r)) / (2r+1)6

  // What are the best numbers for - m, t, r ?
})

function parseTrekkingLog(log = trekkingLog) {
  return log.split('\n').map(record => record.split('\t').map())
}
