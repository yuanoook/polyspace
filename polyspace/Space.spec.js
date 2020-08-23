const Point = require('./Point')
const Space = require('./Space')
const { polyNumbersTranslation } = require('./utils')

it('[PolySpace] [Space] [Basics]', () => {
  const space = new Space(polyNumbersTranslation)
  expect(space.translation).toBe(polyNumbersTranslation)

  const inputs = [1, 2, 5]
  const expectations = [1, 2, 5]
  space.take(inputs, expectations)

  const theBestPoint = space.findThePoint()
  space.print()
  expect(theBestPoint.isCloseTo(new Point([0, 1]), 3)).toBe(true)
})

it('[PolySpace] [Space] [Basics]', () => {
  const space = new Space(polyNumbersTranslation)
  expect(space.translation).toBe(polyNumbersTranslation)

  const inputs = [1, 0, 0.5]
  const expectations = [0, 1, 0.5]
  space.take(inputs, expectations)

  const theBestPoint = space.findThePoint()
  space.print()
  expect(theBestPoint.isCloseTo(new Point([1, -1]), 3)).toBe(true)
})