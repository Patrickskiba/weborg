import { saveChanges } from './file-helpers'

const getAllCheckboxes = parentNode => {
  let tokenArray = []

  const headlineProgressIndicator = parentNode.content.find(child => child.type === 'progress')
  if (headlineProgressIndicator) {
    tokenArray.push({ ...headlineProgressIndicator, index: parentNode.index, whitespace: -1 })
  }

  parentNode.children.forEach(val => {
    const token = val.content.find(child => child.type === 'progress' || child.type === 'checkbox')
    if (token) {
      tokenArray.push({ ...token, index: val.index, whitespace: val.content[0].whitespace })
    }
  })

  return tokenArray
}

const calculateProgress = entry => {
  const completedTasks = entry.children.filter(task => {
    if (task.text === '[X]') {
      return true
    }
    if (task.type === 'progress' && task.text === '100%') {
      return true
    }
    if (task.type === 'progress' && eval(task.text.substring(1, task.text.length - 1)) === 1) {
      return true
    }
    return false
  })

  if (entry.text.includes('%')) {
    return {
      oldText: entry.text,
      newText: `[${(completedTasks.length / entry.children.length) * 100}%]`,
      index: entry.index
    }
  } else if (entry.text.includes('/')) {
    return {
      oldText: entry.text,
      newText: `[${completedTasks.length}/${entry.children.length}]`,
      index: entry.index
    }
  }
}

const updateCheckBoxes = entry => {
  const diffs = []

  if (entry.type === 'checkbox' && entry.text === '[ ]') {
    entry.text = '[X]'
    diffs.push({ oldText: '[ ]', newText: '[X]', index: entry.index })
  } else if (entry.type === 'checkbox' && entry.text === '[X]') {
    entry.text = '[ ]'
    diffs.push({ oldText: '[X]', newText: '[ ]', index: entry.index })
  }

  const updateProgress = currentEntry => {
    if (currentEntry.type === 'progress') {
      const diff = calculateProgress(currentEntry)
      currentEntry.text = diff.newText
      diffs.push(diff)
    }
    if (currentEntry.parent) {
      updateProgress(currentEntry.parent())
    }
  }

  updateProgress(entry)

  return diffs
}

const sortEntries = (sortedBoxes, entry) => {
  if (sortedBoxes.length === 0) {
    return sortedBoxes.push(entry)
  }

  if (sortedBoxes[sortedBoxes.length - 1].whitespace >= entry.whitespace) {
    return sortedBoxes.push(entry)
  }

  if (
    sortedBoxes[sortedBoxes.length - 1].whitespace < entry.whitespace &&
    sortedBoxes[sortedBoxes.length - 1].children === undefined
  ) {
    sortedBoxes[sortedBoxes.length - 1].children = []
    entry.parent = () => sortedBoxes[sortedBoxes.length - 1]
    return sortedBoxes[sortedBoxes.length - 1].children.push(entry)
  }

  if (
    sortedBoxes[sortedBoxes.length - 1].whitespace < entry.whitespace &&
    sortedBoxes[sortedBoxes.length - 1].children !== undefined
  ) {
    entry.parent = () => sortedBoxes[sortedBoxes.length - 1]
    sortEntries(sortedBoxes[sortedBoxes.length - 1].children, entry)
  }
}

const nestCheckboxesByWhitespace = (checkboxes, toggledCheckboxIndex) => {
  const sortedBoxes = []
  let toggledCheckbox = undefined

  checkboxes.forEach(entry => {
    if (entry.index === toggledCheckboxIndex) {
      toggledCheckbox = entry
    }
    sortEntries(sortedBoxes, entry)
  })

  return { nestedCheckboxes: sortedBoxes, toggledCheckbox }
}

const findCheckboxes = (parentNode, toggledCheckboxIndex) => {
  const checkboxes = getAllCheckboxes(parentNode)

  const { toggledCheckbox } = nestCheckboxesByWhitespace(checkboxes, toggledCheckboxIndex)

  const updateDiffs = updateCheckBoxes(toggledCheckbox)

  return updateDiffs
}

const toggleCheckbox = ({ lineNumber, fileText, parentNode, selectedRow, dispatch }) => {
  const splitText = fileText.split('\n')

  const diffs = findCheckboxes(parentNode, lineNumber)

  diffs.forEach(change => {
    splitText[change.index] = splitText[change.index].replace(change.oldText, change.newText)
  })

  const newText = splitText.join('\n')

  dispatch({
    type: 'setText',
    payload: newText
  })

  saveChanges({ selectedRow, newText })
}

export { toggleCheckbox, findCheckboxes }
