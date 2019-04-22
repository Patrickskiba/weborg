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
            endIndex: leftTrim + match.index,
            type: emphasis.type,
        }

        foundEmphasis.push(info)

        return iterate({ leftTrim: leftTrim + res.index + 1, emphasis })
    }

    emphasisMap.map(emphasis => {
        iterate({ emphasis })
    })

    return foundEmphasis
}

module.exports = findEmphasis
