const formatPriority = priority => (priority ? `[#${priority}]` : '')

export const createOrgEntry = ({
  level,
  todoState,
  priority,
  headlineText,
  sectionText,
}) => {
  const headlineProps = [
    '*'.repeat(level),
    todoState,
    formatPriority(priority),
    headlineText,
  ]
  const headline = headlineProps.filter(prop => !!prop === true).join(' ')
  if (sectionText) {
    return [headline, ...sectionText.split('\n')]
  }
  return [headline]
}
