const parse = require('../../src/parser')

const text = 
`* This is a test
I think this is pretty cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
* TODO level 1
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
* yea this is super cool
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
* level 1 headline
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool
** yea this is super cool
super super super cool`

describe('e2e parser tests', () => {
    it('reads a series of lines and creates an ast', () => {
        const ast = parse(text)
        expect(ast.length).toEqual(4)
        expect(ast[0].children.length).toEqual(8)
        expect(ast).toMatchSnapshot()
    }) 
})
