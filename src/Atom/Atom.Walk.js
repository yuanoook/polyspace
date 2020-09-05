module.exports = {
  gotoLeftMost () {
    let left = this
    while (left.left) left = left.left
    return left
  },

  gotoRightMost () {
    let right = this
    while (right.right) right = right.right
    return right
  },

  walkLeftUntil (call, includeSelf = false) {
    let left = includeSelf ? this : this.left
    while (left) {
      const result = call(left)
      if (result) return result
      left = left.left
    }
  },

  walkToLeftMost (call, includeSelf = false) {
    let results = []
    this.walkLeftUntil(left => {
      results.push(call(left))
    }, includeSelf)
    return results
  },

  walkRightUntil (call, includeSelf = false) {
    let right = includeSelf ? this : this.right
    while (right) {
      const result = call(right)
      if (result) return result
      right = right.right
    }
  },

  walkToRightMost (call, includeSelf = false) {
    let results = []
    this.walkRightUntil(right => {
      results.push(call(right))
    }, includeSelf)
    return results
  },

  walkAllFromLeft (call) {
    return this.gotoLeftMost().walkToRightMost(call, true)
  },

  walkAllFromRight (call) {
    return this.gotoRightMost().walkToLeftMost(call, true)
  }
}
