const boldStart = '\\*'
const italicStart = '\\/'
const underlineStart = '\\_'
const strickthroughStart = '\\+'
const http = 'http:\\/\\/'
const https = 'https:\\/\\/'
const timestampStart = '\\<'
const timestamp = '\\<\\d\\d\\d\\d\\-\\d\\d\\-\\d\\d'
const eligibile = new RegExp(
  `^.*(${boldStart}|${italicStart}|${underlineStart}|${strickthroughStart}|${http}|${https}|${timestampStart}).*`
)
const startingPairs = new RegExp(
  `^(((${boldStart}|${italicStart}|${underlineStart}|${strickthroughStart})\\S)|${timestamp})`
)

const linkRegExp = new RegExp(`^(\\[\\[)?((${https}|${http})\\S+)`)

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
    case '<':
      return { type: 'timestamp', endMatch: /\>(\s|$)/ }
    default:
      return false
  }
}

const identifyLink = protocol => {
  switch (protocol) {
    case 'http://':
      return { type: 'url' }
    case 'https://':
      return { type: 'url' }
    default:
      return false
  }
}

const reducer = (acc, val, idx, arr) => {
  const isLink = val.match(linkRegExp)

  if (isLink) {
    const link = identifyLink(isLink[3])
    if (link) {
      const previousType = acc[acc.length - 1].type
      acc.push({ type: link.type, text: [val] })
      acc.push({ type: previousType, text: [] })
      return acc
    }
  }

  const startmatch = val.match(startingPairs)

  if (startmatch) {
    const emphasis = identifyEmphasis(startmatch[1].charAt(0))
    if (emphasis && emphasis.endMatch.test(arr.slice(idx).join(' '))) {
      acc.push({ type: emphasis.type, text: [] })
    }
  }

  acc[acc.length - 1].text.push(val)

  const endmatch = val.match(/\S(\*|\/|\_|\+|\>)$/)
  if (endmatch) {
    acc.push({ type: 'text', text: [] })
  }
  return acc
}

const parseUrl = line => {
  if (line.text.length === 1) {
    const isEnclosed = line.text[0].match(/(\[\[)(\S+)(\]\])/)
    if (isEnclosed) {
      const isDescriptive = isEnclosed[2].match(/(\S+)(\]\[)(\S+)/)
      if (isDescriptive) {
        return {
          type: line.type,
          text: line.text.join(' '),
          displayText: isDescriptive[3],
          href: isDescriptive[1]
        }
      } else {
        return {
          type: line.type,
          text: line.text.join(' '),
          displayText: isEnclosed[2],
          href: isEnclosed[2]
        }
      }
    }
  }
  return { type: line.type, text: line.text.join(' ') }
}

const tokenizeContent = text => {
  if (!eligibile.test(text)) {
    return [{ type: 'text', text: text }]
  }
  return text
    .split(' ')
    .reduce(reducer, [{ type: 'text', text: [] }])
    .map(line => {
      if (line.type === 'url') return parseUrl(line)
      return { type: line.type, text: line.text.join(' ') }
    })
    .filter(token => token.text.length)
}

module.exports = tokenizeContent
