const Point = require('./Point')
const Space = require('./Space')
const { polyNumbersTranslation } = require('./utils')

it('[PolySpace] [Space] [Basics]', () => {
  const space = new Space(polyNumbersTranslation)
  expect(space.translation).toBe(polyNumbersTranslation)

  const inputs = [-2, 2]
  const expectations = [0, 4]
  space.take(inputs, expectations)

  const theBestPoint = space.findThePoint()

  space.print()
  expect(theBestPoint.isCloseTo(new Point([2, 1]), 3)).toBe(true)
})
