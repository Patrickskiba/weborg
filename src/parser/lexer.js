const tokenizeContent = require('./emphasis')

const tokenizeTimestamp = text => text

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
      scheduled: undefined,
      deadline: undefined,
      content: tokenizeContent(result[4]),
      children: [],
      tags: result[5],
    }),
  },
  {
    type: 'section',
    regex: /.*/,
    schema: (result, idx) => ({
      type: 'section',
      index: idx,
      content: tokenizeContent(result[0]),
    }),
  },
]

const lexer = (text, idx) => {
  for (const rule of tokenMap) {
    const match = text.match(rule.regex)
    if (match) return rule.schema(match, idx)
  }
}

module.exports = lexer
