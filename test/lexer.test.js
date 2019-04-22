const { lexer } = require('../src/lexer')

describe('headline tests', () => {
    it.only('takes some text and finds the bold', () => {
        const sampleText = 'this is a *test* from *bolding* somew*ords* '

        console.log(sampleText.match(/(\s\*\S|\S\*\s)/))
        console.log(sampleText.substring(10).match(/(\s\*\S|\S\*\s)/))
        console.log(sampleText.substring(16).match(/(\s\*\S|\S\*\s)/))
        console.log(sampleText.substring(22).match(/(\s\*\S|\S\*\s)/))
        console.log(sampleText.substring(30).match(/(\s\*\S|\S\*\s)/))

        const findMatches = () => {
            const start = /(\s\*\S)/
            const end = /(\S\*\s)/

            
        }
    })

    it('takes in a headline of level 2 with a TODO and identifies two tokens', () => {
        const sampleText = "** TODO [#A] this is a ** this is a test** test"
        const res = lexer(sampleText)

        expect(res).toEqual({State: "TODO", content: "this is a test", level: 2, priority: 'A', tags: undefined})

    })

    it('takes in a headline of level 2 with a DONE and identifies two tokens', () => {
        const sampleText = "** DONE this is a test"
        const res = lexer(sampleText)

        expect(res).toEqual({State: "DONE", content: "this is a test", level: 2, priority: undefined, tags: undefined})

    })

    it('takes in a headline of level 3 with a DONE and identifies two tokens', () => {
        const sampleText = "*** DONE TODO this is a test"
        const res = lexer(sampleText)

        expect(res).toEqual({State: "DONE", content: "TODO this is a test", level: 3, priority: undefined, tags: undefined})

    })

    it('bad todo', () => {
        const sampleText = "** TODOthis is a test"
        const res = lexer(sampleText)

        expect(res).toEqual({ State: undefined, content: "TODOthis is a test", level: 2, priority: undefined, tags: undefined})

    })

    it('bad headline', () => {
        const sampleText = "**TODO this is a test"
        const res = lexer(sampleText)

        expect(res).toEqual(undefined)
    })

    it('bad todo and headline', () => {
        const sampleText = "**TODOthis is a test"
        const res = lexer(sampleText)

        expect(res).toEqual(undefined)

    })
})
