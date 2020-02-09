const parser = text => {
  const ast = []

  const getLastEntry = arr => arr[arr.length - 1]

  const findHeadlinePlacement = (line, node) => {
    if (line.level === 1) return node.push(line)

    const lastEntry = getLastEntry(node)

    if (lastEntry.type !== 'headline') return node.push(line)

    if (lastEntry.level === line.level) return node.push(line)

    if (lastEntry.level > line.level) return node.push(line)

    if (lastEntry.children.length === 0) return lastEntry.children.push(line)

    if (lastEntry.level < line.level) {
      return findHeadlinePlacement(line, lastEntry.children)
    }
  }

  const findTaskPlacement = (line, node) => {
    const lastEntry = getLastEntry(node)

    if (lastEntry.type === 'headline' && lastEntry.children && lastEntry.children.length === 0) {
      return lastEntry.children.push(line)
    }

    if (lastEntry.children && lastEntry.children.length !== 0) {
      return findTaskPlacement(line, lastEntry.children)
    }

    return node.push({ ...line, type: 'section' })
  }

  const findSectionPlacement = (line, node) => {
    const lastEntry = getLastEntry(node)

    if (lastEntry.type !== 'headline') return node.push(line)

    if (lastEntry.children.length === 0) return lastEntry.children.push(line)

    if (lastEntry.children.length !== 0) {
      return findSectionPlacement(line, lastEntry.children)
    }
  }

  const findPropertyPlacement = (line, node) => {
    const lastEntry = getLastEntry(node)

    if (lastEntry.type !== 'headline') return node.push(line)

    if (lastEntry.children.length === 0) return lastEntry.children.push(line)

    if (lastEntry.children.length !== 0) {
      return findSectionPlacement(line, lastEntry.children)
    }
  }

  text.forEach(line => {
    if (ast.length === 0) return ast.push(line)

    if (line.type === 'headline') return findHeadlinePlacement(line, ast)

    if (line.type === 'task') return findTaskPlacement(line, ast)

    if (line.type === 'section') return findSectionPlacement(line, ast)

    if (
      line.type === 'property-start' ||
      line.type === 'property-entry' ||
      line.type === 'property-end'
    )
      return findPropertyPlacement(line, ast)
  })

  return ast
}

module.exports = parser
