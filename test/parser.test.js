const parser = require('../src/parser')

describe('parser tests', () => {
    it('test the a 3, 2, 1 headline sequence', () => {
        const text =  [{ 
            type: 'headline',
            level: 3,
            State: 'TODO',
            priority: 'A',
            content:
            { 
                text: 'this is a *this is a test* test',
                emphasis: { 
                    text: 'this is a *this is a test* test',
                    emphasis: [ { startIndex: 9, endIndex: 24, type: 'bold' } ] 
                }
            },
            children:[],
            tags: undefined 
        }, { 
            type: 'headline',
            level: 2,
            State: 'TODO',
            priority: 'A',
            content:
            { 
                text: 'this is a *this is a test* test',
                emphasis: { 
                    text: 'this is a *this is a test* test',
                    emphasis: [ { startIndex: 9, endIndex: 24, type: 'bold' } ] 
                }
            },
            children:[],
            tags: undefined 
        }, { 
            type: 'headline',
            level: 1,
            State: 'TODO',
            priority: 'A',
            content:
            { 
                text: 'this is a *this is a test* test',
                emphasis: { 
                    text: 'this is a *this is a test* test',
                    emphasis: [ { startIndex: 9, endIndex: 24, type: 'bold' } ] 
                }
            },
            children:[],
            tags: undefined 
        }, ]
        const response = parser(text) 
        expect(response[0].level).toEqual(3)
        expect(response[1].level).toEqual(2)
        expect(response[2].level).toEqual(1)
    })

    it('it parses a 1, 2, 3 headline sequence', () => {
        const text =  [{ 
            type: 'headline',
            level: 1,
            State: 'TODO',
            priority: 'A',
            content:
            { 
                text: 'this is a *this is a test* test',
                emphasis: { 
                    text: 'this is a *this is a test* test',
                    emphasis: [ { startIndex: 9, endIndex: 24, type: 'bold' } ] 
                }
            },
            children:[],
            tags: undefined 
        }, { 
            type: 'headline',
            level: 2,
            State: 'TODO',
            priority: 'A',
            content:
            { 
                text: 'this is a *this is a test* test',
                emphasis: { 
                    text: 'this is a *this is a test* test',
                    emphasis: [ { startIndex: 9, endIndex: 24, type: 'bold' } ] 
                }
            },
            children:[],
            tags: undefined 
        }, { 
            type: 'headline',
            level: 3,
            State: 'TODO',
            priority: 'A',
            content:
            { 
                text: 'this is a *this is a test* test',
                emphasis: { 
                    text: 'this is a *this is a test* test',
                    emphasis: [ { startIndex: 9, endIndex: 24, type: 'bold' } ] 
                }
            },
            children:[],
            tags: undefined 
        }, ]

        const response = parser(text) 

        expect(response[0].level).toEqual(1)
        expect(response[0].children[0].level).toEqual(2)
        expect(response[0].children[0].children[0].level).toEqual(3)
    })


    it('it parses a 1, 2, 2, 1, 3 headline sequence', () => {
        const text =  [{ 
            type: 'headline',
            level: 1,
            State: 'TODO',
            priority: 'A',
            content:
            { 
                text: 'this is a *this is a test* test',
                emphasis: { 
                    text: 'this is a *this is a test* test',
                    emphasis: [ { startIndex: 9, endIndex: 24, type: 'bold' } ] 
                }
            },
            children:[],
            tags: undefined 
        }, { 
            type: 'headline',
            level: 2,
            State: 'TODO',
            priority: 'A',
            content:
            { 
                text: 'this is a *this is a test* test',
                emphasis: { 
                    text: 'this is a *this is a test* test',
                    emphasis: [ { startIndex: 9, endIndex: 24, type: 'bold' } ] 
                }
            },
            children:[],
            tags: undefined 
        }, { 
            type: 'headline',
            level: 2,
            State: 'TODO',
            priority: 'A',
            content:
            { 
                text: 'this is a *this is a test* test',
                emphasis: { 
                    text: 'this is a *this is a test* test',
                    emphasis: [ { startIndex: 9, endIndex: 24, type: 'bold' } ] 
                }
            },
            children:[],
            tags: undefined 
        }, { 
            type: 'headline',
            level: 1,
            state: 'todo',
            priority: 'a',
            content:
            { 
                text: 'this is a *this is a test* test',
                emphasis: { 
                    text: 'this is a *this is a test* test',
                    emphasis: [ { startindex: 9, endindex: 24, type: 'bold' } ] 
                }
            },
            children:[],
            tags: undefined 
        },  { 
            type: 'headline',
            level: 3,
            state: 'todo',
            priority: 'a',
            content:
            { 
                text: 'this is a *this is a test* test',
                emphasis: { 
                    text: 'this is a *this is a test* test',
                    emphasis: [ { startindex: 9, endindex: 24, type: 'bold' } ] 
                }
            },
            children:[],
            tags: undefined 
        }, ]

        const response = parser(text) 

        expect(response[0].level).toEqual(1)
        expect(response[0].children[0].level).toEqual(2)
        expect(response[0].children[1].level).toEqual(2)
        expect(response[1].level).toEqual(1)
        expect(response[1].children[0].level).toEqual(3)
    })
})
