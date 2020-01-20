const tokenizeContent = require('./emphasis')

const tokenMap = [
  {
    /*
            ^(\*+)\s+           Checks that at the start of the line, contains atleast 1 or more * with 1 or more whitespaces
            (?:(TODO|DONE)\s+)  Checks for the presence of State words like TODO and DONE followed by 1 or more whitespaces
            ?(?:\[#(A|B|C)\]\s+) Checks for the presence of priority levels A B or C followed by 1 or more whitespaces
            ?(.*?)\s*           Checks for any series of characters followed by 0 or more whitespaces
            (:(?:\w+:)+)?$/     Checks for the presense of words with the tag syntax i.e. :hello:   this should be the end of the line
        */
    type: 'headline',
    regex: /^(\*+)\s+(?:(TODO|DONE)\s+)?(?:\[#(A|B|C)\]\s+)?(.*?)\s*(:(?:\w+:)+)?$/,
    schema: (result, idx) => ({
      type: 'headline',
      index: idx,
      level: result[1].length,
      State: result[2],
      priority: result[3],
      content: tokenizeContent(result[4]),
      children: [],
      tags: result[5]
    })
  },
  {
    type: 'task',
    regex: /((SCHEDULED|DEADLINE):\s*<\d\d\d\d-\d\d-\d\d\s*(\w\w\w\s*)?(\d\d:\d\d(:(AM|PM|am|pm))?\s*)?((\+|\+\+|\.\+)\d+(y|w|m|d|h))?>)/g,
    schema: (result, idx) => ({
      type: 'task',
      index: idx,
      content: result.map(task => {
        const seperatorIndex = task.indexOf(' ')
        const taskTokens = [
          task.slice(0, seperatorIndex),
          task.slice(seperatorIndex + 1, task.length)
        ]
        return { type: taskTokens[0], timestamp: taskTokens[1] }
      })
    })
  },
  {
    type: 'section',
    regex: /^(\s*)(\-|\+|\d\.\)|\d\.){1}(?:\s*)(\[\s\]|\[X\]|\[\-\])?(?:\s*)(.*)$/,
    schema: (result, idx) => {
      let content = []
      if (result[2]) {
        content.push({
          type: 'list',
          text: result[1] + result[2],
          whitespace: result[1].length,
          index: idx
        })
      }

      if (result[3]) {
        content.push({
          type: 'checkbox',
          text: result[3],
          index: idx
        })
      }

      content.push(...tokenizeContent(result[4]))

      return {
        type: 'section',
        content: content,
        index: idx
      }
    }
  },
  {
    type: 'section',
    regex: /.*/,
    schema: (result, idx) => ({
      type: 'section',
      index: idx,
      content: tokenizeContent(result[0])
    })
  }
]

const lexer = (text, idx) => {
  for (const rule of tokenMap) {
    const match = text.match(rule.regex)
    if (match) return rule.schema(match, idx)
  }
}

module.exports = lexer
