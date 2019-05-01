const lexer = require('../../src/parser/lexer')

describe('headline tests', () => {
    it('takes in a headline of level 2 with a TODO and identifies two tokens', () => {
        const sampleText = "** TODO [#A] this is a **this is a test** test"
        const res = lexer(sampleText)

        expect(res).toEqual({State: "TODO", content: [
            { text: "this is a ", type: 'text' },
            { text: "**this is a test**", type: 'bold' },
            { text: " test", type: 'text' },
        ], level: 2, priority: 'A', children: [], tags: undefined, type: 'headline'})

    })

    it('takes in a headline of level 2 with a DONE and identifies two tokens', () => {
        const sampleText = "** DONE this is a test"
        const res = lexer(sampleText)

        expect(res).toEqual({State: "DONE", content: [{ text: "this is a test", type: 'text' }], level: 2, children: [], priority: undefined, tags: undefined, type: 'headline'})

    })

    it('takes in a headline of level 2 with a DONE and identifies bold, italic and strikethrough', () => {
        const sampleText = "** DONE this *bold* this is _test_ "
        const res = lexer(sampleText)

        expect(res).toEqual({State: "DONE", content: [{ text: "this is a test", type: 'text' }], level: 2, children: [], priority: undefined, tags: undefined, type: 'headline'})

    })

    it.only('takes in a headline of level 2 with a DONE and identifies bold, italic and strikethrough', () => {
        const sampleText = "this *bold is* this is _test test_ some more /test/ cases"

        const identifyEmphasis = char => {
            switch(char) {
                case '*':
                    return 'bold'
                case '_':
                    return 'underline'
                case '+':
                    return 'strikethrough'
                case '/':
                    return 'italic'
                default:
                    return 'text'
            }
        }

        const textarr = sampleText

        const reducer = (acc, val, idx, arr) => { 
            const startmatch = val.match(/^(\*|\/|\_|\+)\S/)
            if(startmatch && RegExp(`\\${startmatch[1]}\\s`).test(arr.slice(idx).join(' '))) { 
                acc.push({type: identifyEmphasis(startmatch[1]), text: ''})
            }

            acc[acc.length - 1].text += val + ' '

            const endmatch = val.match(/\S(\*|\/|\_|\+)$/)
            if(endmatch) {
                acc.push({type: 'text', text: ''})
            }
            return acc
        }

        console.log(textarr.split(' ').reduce(reducer, [{ type: 'text', text: '' }]))

    })

    it('takes in a headline of level 3 with a DONE and identifies two tokens', () => {
        const sampleText = "*** DONE TODO this is a test"
        const res = lexer(sampleText)

        expect(res).toEqual({State: "DONE", content: [{ text: "TODO this is a test", type: 'text' }], level: 3, children: [], priority: undefined, tags: undefined, type: 'headline'})

    })

    it('bad todo', () => {
        const sampleText = "** TODOthis is a test"
        const res = lexer(sampleText)

        expect(res).toEqual({ State: undefined, content: [{ text: "TODOthis is a test", type: 'text' }], level: 2, children: [], priority: undefined, tags: undefined, type: 'headline'})

    })

    it('bad headline', () => {
        const sampleText = "**TODO this is a test *this is a test* this"
        const res = lexer(sampleText)

        expect(res).toEqual({content: [{text: "**TODO this is a test ", type: "text"}, {text: "*this is a test*", type: "bold"}, {text: " this", type: "text"}], type: 'section'})
    })

    it('bad todo and headline', () => {
        const sampleText = "**TODOthis is a test"
        const res = lexer(sampleText)

        expect(res).toEqual({content: [{text: "**TODOthis is a test", type: "text"}], type: 'section'})

    })
})
