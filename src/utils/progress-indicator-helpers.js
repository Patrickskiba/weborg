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

const filterCompletedTasks = task => {
  if (task.text === '[X]') {
    return true
  }
  return false
}

const filterAllCheckboxes = task => {
  if (task.type === 'checkbox') {
    return true
  }
  return false
}

const calculateProgress = entry => {
  const completedTasks = entry.children.filter(filterCompletedTasks)
  const allTasks = entry.children.filter(filterAllCheckboxes)

  if (entry.text.includes('%')) {
    return {
      oldText: entry.text,
      newText: `[${parseInt((completedTasks.length / allTasks.length) * 100)}%]`,
      index: entry.index
    }
  } else if (entry.text.includes('/')) {
    return {
      oldText: entry.text,
      newText: `[${completedTasks.length}/${allTasks.length}]`,
      index: entry.index
    }
  }
}

const calculateCheckbox = entry => {
  const completedTasks = entry.children.filter(filterCompletedTasks)

  if (completedTasks.length === 0) {
    return {
      oldText: entry.text,
      newText: '[ ]',
      index: entry.index
    }
  } else if (entry.children.length !== completedTasks.length) {
    return {
      oldText: entry.text,
      newText: '[-]',
      index: entry.index
    }
  } else {
    return {
      oldText: entry.text,
      newText: '[X]',
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

  const updateParent = currentEntry => {
    if (currentEntry.type === 'progress') {
      const diff = calculateProgress(currentEntry)
      currentEntry.text = diff.newText
      diffs.push(diff)
    }

    if (currentEntry.type === 'checkbox' && currentEntry.children) {
      const diff = calculateCheckbox(currentEntry)
      currentEntry.text = diff.newText
      diffs.push(diff)
    }

    if (currentEntry.parent) {
      updateParent(currentEntry.parent())
    }
  }

  updateParent(entry)

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
    const index = sortedBoxes.length - 1
    entry.parent = () => sortedBoxes[index]
    return sortedBoxes[sortedBoxes.length - 1].children.push(entry)
  }

  if (
    sortedBoxes[sortedBoxes.length - 1].whitespace < entry.whitespace &&
    sortedBoxes[sortedBoxes.length - 1].children !== undefined
  ) {
    const index = sortedBoxes.length - 1
    entry.parent = () => sortedBoxes[index]
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
