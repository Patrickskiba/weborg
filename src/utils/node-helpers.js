export const isSelected = ({ mode, node }) =>
  mode &&
  mode.range &&
  mode.range.start <= node.index &&
  mode.range.end >= node.index

export const highLight = ({ mode, node, normalColor = 'black' }) => {
  if (isSelected({ mode, node })) {
    return 'brown'
  }
  return normalColor
}

export const filterNonSections = node =>
  node.children.filter(section => section.type === 'section')

export const getRange = node => {
  const sectionChildren = filterNonSections(node)
  return {
    start: node.index,
    end: sectionChildren.length ? sectionChildren.pop().index : node.index,
  }
}
