const Point = require('../packages/Point')

it('[PolySpace] [Point] [findBiNeighbors]', () => {
  const point = new Point([
    {value: 10, baseUnit: 1, leftLimit: 1, rightLimit: 1000, name: 'smoothRadius'},
    {value: 10, baseUnit: 2, leftLimit: 2, rightLimit: 2000, name: 'predictBaseStep'},
    {value: 10, baseUnit: 3, leftLimit: 3, rightLimit: 3000, name: 'predictTimes'}
  ])

  while (point.findBiNeighbors().length) {
    const neighbors = point.getBiNeighbors()
    for (let neighbor of neighbors) {
      expect(neighbor.getAtom(0).baseUnit).toBe(1)
      expect(neighbor.getAtom(0).leftLimit).toBe(1)
      expect(neighbor.getAtom(0).rightLimit).toBe(1000)

      expect(neighbor.getAtom(1).baseUnit).toBe(2)
      expect(neighbor.getAtom(1).leftLimit).toBe(2)
      expect(neighbor.getAtom(1).rightLimit).toBe(2000)

      expect(neighbor.getAtom(2).baseUnit).toBe(3)
      expect(neighbor.getAtom(2).leftLimit).toBe(3)
      expect(neighbor.getAtom(2).rightLimit).toBe(3000)
    }
  }

})
