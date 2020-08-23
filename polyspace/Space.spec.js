const Point = require('./Point')
const Space = require('./Space')
const { polyNumbersTranslation } = require('./utils')

it('[PolySpace] [Space] [Basics]', () => {
  const space = new Space(polyNumbersTranslation)
  expect(space.translation).toBe(polyNumbersTranslation)

  const inputs = [1, 2, 3]
  const expectations = [1, 2, 3]
  space.take(inputs, expectations)

  const theBestPoint = space.findThePoint()
  space.print()
  expect(theBestPoint.isCloseTo(new Point([0, 1]), 3)).toBe(true)
})