const lexer = require('../../src/parser/lexer')

describe('headline tests', () => {
    it('takes in a headline of level 2 with a TODO and identifies two tokens', () => {
        const sampleText = "** TODO [#A] this is a **this is a test** test"
        const res = lexer(sampleText)

        expect(res).toEqual({State: "TODO", content: [
            { text: "this is a", type: 'text' },
            { text: "**this is a test**", type: 'bold' },
            { text: "test", type: 'text' },
        ], level: 2, priority: 'A', children: [], tags: undefined, type: 'headline'})

    })

    it('takes in a headline of level 2 with a DONE and identifies two tokens', () => {
        const sampleText = "** DONE this is a test"
        const res = lexer(sampleText)

        expect(res).toEqual({State: "DONE", content: [
            { text: "this is a test", type: 'text' }
        ], level: 2, children: [], priority: undefined, tags: undefined, type: 'headline'})

    })

    it('takes in a headline of level 2 with a DONE and identifies bold, italic and strikethrough', () => {
        const sampleText = "** DONE this *bold* this is /test is/ test _test_ "
        const res = lexer(sampleText)

        expect(res).toEqual({State: "DONE", content: [
            { text: "this", type: 'text' },
            { text: "*bold*", type: 'bold' },
            { text: "this is", type: 'text' },
            { text: "/test is/", type: 'italic' },
            { text: "test", type: 'text' },
            { text: "_test_", type: 'underline' },
            { text: "", type: 'text' },
        ], level: 2, children: [], priority: undefined, tags: undefined, type: 'headline'})

    })

    it('takes in a headline of level 3 with a DONE and identifies two tokens', () => {
        const sampleText = "*** DONE TODO this is a test"
        const res = lexer(sampleText)

        expect(res).toEqual({State: "DONE", content: [
            { text: "TODO this is a test", type: 'text' }
        ], level: 3, children: [], priority: undefined, tags: undefined, type: 'headline'})

    })

    it('bad todo', () => {
        const sampleText = "** TODOthis is a test"
        const res = lexer(sampleText)

        expect(res).toEqual({ State: undefined, content: [
            { text: "TODOthis is a test", type: 'text' }
        ], level: 2, children: [], priority: undefined, tags: undefined, type: 'headline'})

    })

    it('bad headline', () => {
        const sampleText = "**TODO this is a test *this is a test* this"
        const res = lexer(sampleText)

        expect(res).toEqual({content: [
            {text: "", type: "text"},
            {text: "**TODO this is a test", type: "bold"},
            {text: "*this is a test*", type: "bold"},
            {text: "this", type: "text"}
        ], type: 'section'})
    })

    it('bad todo and headline', () => {
        const sampleText = "**TODOthis is a test"
        const res = lexer(sampleText)

        expect(res).toEqual({content: [{text: "**TODOthis is a test", type: "text"}], type: 'section'})

    })
})
