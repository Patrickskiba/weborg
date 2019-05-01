const emphasisMap = [
    { type: 'bold', start: /\s\*\S/, end: /\S\*\s/ },
    { type: 'underline', start: /\s\_\S/, end: /\S\_\s/ },
    { type: 'italic', start: /\s\/\S/, end: /\S\/\s/ },
    { type: 'strike-through', start: /\s\+\S/, end: /\S\+\s/ },
    //{ type: 'verbatim', start: /\s\/\S/, end: /\S\/\s/ },
    //{ type: 'code', start: /\s\/\S/, end: /\S\/\s/ },
]

const findEmphasis = text => {
    const foundEmphasis = []

    const iterate = ({ leftTrim = 0, emphasis }) => {
        const res = text.substring(leftTrim).match(emphasis.start)

        if (res == undefined) return 

        const match = res.input.match(emphasis.end)

        if (match == undefined) return 

        const info = {
            startIndex: leftTrim + res.index,
            endIndex: leftTrim + match.index + 1 ,
            type: emphasis.type,
        }

        foundEmphasis.push(info)

        return iterate({ leftTrim: leftTrim + res.index + 1, emphasis })
    }

    emphasisMap.forEach(emphasis => iterate({ emphasis }))

    return foundEmphasis
}

const tokenizeContent = text => {
    const emphasisTokens = findEmphasis(text)

    if(emphasisTokens.length === 0) return [ { type: 'text', text } ]

    const tokens = []

    const iterate = ({ text, tokenInd = 0 }) => {
        const token = emphasisTokens[tokenInd] 

        if(token == undefined) return tokens.push({ type: 'text', text: text })

        tokens.push({ type: 'text', text: text.substring(0, token.startIndex + 1) })
        tokens.push({ type: token.type, text: text.substring(token.startIndex + 1, token.endIndex + 1) })

        iterate({ text: text.substring(token.endIndex + 1), tokenInd: tokenInd + 1 }) 
    }

    iterate({ text })

    return tokens
}

module.exports = tokenizeContent
