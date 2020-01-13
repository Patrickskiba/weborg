import { saveChanges } from './file-helpers'

const traverseUp = (idx, parent) => {
  const hasProgress = parent.children[idx].content.find(child => child.type === 'progress')
  if (hasProgress) {
    return parent.children[idx].content
  }

  if (!hasProgress && idx > 0) {
    return traverseUp(idx - 1, parent)
  }

  return false
}

const findProgressIndicator = (lineNumber, parentNode) => {
  let idx = parentNode.children.findIndex(child => child.index === lineNumber)

  if (idx > 0) {
    return traverseUp(idx - 1, parentNode)
  }
}

const traverseDown = ({ idx, whitespace, parent, numerator, denominator }) => {
  if (idx < parent.children.length) {
    if (whitespace >= parent.children[idx].content[0].whitespace) return { numerator, denominator }

    const hasCheckbox = parent.children[idx].content.find(child => child.type === 'checkbox')
    if (hasCheckbox) {
      if (hasCheckbox.text === '[ ]') {
        return traverseDown({
          idx: idx + 1,
          whitespace,
          parent,
          numerator,
          denominator: denominator + 1
        })
      }
      if (hasCheckbox.text === '[X]') {
        return traverseDown({
          idx: idx + 1,
          whitespace,
          parent,
          numerator: numerator + 1,
          denominator: denominator + 1
        })
      }
    }
    return traverseDown({ idx: idx + 1, whitespace, parent, numerator, denominator })
  }
  return { numerator, denominator }
}

const incrementProgressIndicator = (progIndicator, parentNode) => {
  let currentIdx = parentNode.children.findIndex(child => child.index === progIndicator[0].index)
  let progressRatio = traverseDown({
    idx: currentIdx + 1,
    whitespace: progIndicator[0].whitespace,
    parent: parentNode,
    numerator: 0,
    denominator: 0
  })

  return {
    idx: progIndicator[0].index,
    ...progressRatio
  }
}

const calculateProgressIndicator = ({ lineNumber, checkbox, parentNode }) => {
  const hasProgressIndicator = findProgressIndicator(lineNumber, parentNode)
  if (hasProgressIndicator) {
    const progIndicator = incrementProgressIndicator(hasProgressIndicator, parentNode)

    if (checkbox === '[ ]') {
      progIndicator.numerator += 1
    }
    if (checkbox === '[X]') {
      progIndicator.numerator -= 1
    }

    const indicatorText = hasProgressIndicator.find(child => child.type === 'progress').text

    if (indicatorText.includes('%')) {
      return {
        oldText: indicatorText,
        newText: `[${(progIndicator.numerator * 100) / progIndicator.denominator}%]`,
        index: hasProgressIndicator[0].index
      }
    }

    if (indicatorText.includes('/')) {
      return {
        oldText: indicatorText,
        newText: `[${progIndicator.numerator}/${progIndicator.denominator}]`,
        index: hasProgressIndicator[0].index
      }
    }
  }
}

const findCheckboxes = parentNode => []

const toggleCheckbox = ({ checkbox, lineNumber, fileText, parentNode, selectedRow, dispatch }) => {
  const progressIndicator = calculateProgressIndicator({ lineNumber, checkbox, parentNode })

  const splitText = fileText.split('\n')
  const toggled =
    checkbox === '[ ]'
      ? splitText[lineNumber].replace('[ ]', '[X]')
      : splitText[lineNumber].replace('[X]', '[ ]')

  if (progressIndicator) {
    splitText[progressIndicator.index] = splitText[progressIndicator.index].replace(
      progressIndicator.oldText,
      progressIndicator.newText
    )
  }

  splitText[lineNumber] = toggled

  const newText = splitText.join('\n')

  dispatch({
    type: 'setText',
    payload: newText
  })

  saveChanges({ selectedRow, newText })
}

export { toggleCheckbox, findCheckboxes }
