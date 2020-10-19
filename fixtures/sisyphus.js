const wait = (seconds = 1) => new Promise(
  resolve => setTimeout(resolve, seconds * 1000)
)

const sisyphus = async function (func, timeLimit = 0) {
  let timeout = false
  if (timeLimit) wait(timeLimit).then(() => (timeout = true))

  while (true) {
      await wait()
      try {
          const result = await func()
          return result
      } catch (error) {
          console.error(error)
      }
      if (timeout) throw new Error(`Sisyphus out of time - ${timeLimit}`)
  }
}

const sisyphusSelect = (selector, timeLimit = 0) => sisyphus(() => {
  console.log(`Searching ${selector} ...`)
  const result = document.querySelector(selector)
  if (!result) throw new Error(`Didn't get ${selector}`)
  return result
}, timeLimit)

const sisyphusSelectAll = ({selector, container = document, timeLimit = 0}) => sisyphus(() => {
  console.log(`Searching ${selector} ...`)
  const result = container.querySelectorAll(selector)
  if (!result || !result.length) throw new Error(`Didn't get ${selector}`)
  return result
}, timeLimit)

const sisyphusClick = async (selector, timeLimit = 0) =>
  (await sisyphusSelect(selector, timeLimit)).click();

module.exports = {
  wait,
  sisyphus,
  sisyphusSelect,
  sisyphusSelectAll,
  sisyphusClick
}