const identifyEmphasis = char => {
  switch (char) {
    case '*':
      return { type: 'bold', endMatch: /\*(\s|$)/ }
    case '_':
      return { type: 'underline', endMatch: /\_(\s|$)/ }
    case '+':
      return { type: 'strikethrough', endMatch: /\+(\s|$)/ }
    case '/':
      return { type: 'italic', endMatch: /\/(\s|$)/ }
    default:
      return false
  }
}

const reducer = (acc, val, idx, arr) => {
  const startmatch = val.match(/^(\*|\/|\_|\+)\S/)

  if (startmatch) {
    const emphasis = identifyEmphasis(startmatch[1])
    if (emphasis && emphasis.endMatch.test(arr.slice(idx).join(' '))) {
      acc.push({ type: emphasis.type, text: [] })
    }
  }

  acc[acc.length - 1].text.push(val)

  const endmatch = val.match(/\S(\*|\/|\_|\+)$/)
  if (endmatch) {
    acc.push({ type: 'text', text: [] })
  }
  return acc
}

const tokenizeContent = text => {
  if (!/^.*(\*|\/|\_|\+|https:\/\/|http:\/\/).*/.test(text)) {
    return [{ type: 'text', text: text }]
  }
  return text
    .split(' ')
    .reduce(reducer, [{ type: 'text', text: [] }])
    .map(line => ({ type: line.type, text: line.text.join(' ') }))
}

module.exports = tokenizeContent
