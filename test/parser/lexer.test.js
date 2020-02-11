const lexer = require('../../src/parser/lexer')

describe('headline tests', () => {
  it('takes in a headline of level 2 with a TODO and identifies two tokens', () => {
    const sampleText = '** TODO [#A] this is a **this is a test** test'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'TODO',
      content: [
        { text: 'this is a', type: 'text' },
        { text: '**this is a test**', type: 'bold' },
        { text: 'test', type: 'text' }
      ],
      level: 2,
      priority: 'A',
      children: [],
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a headline of level 2 with a DONE and identifies two tokens', () => {
    const sampleText = '** DONE this is a test'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      content: [{ text: 'this is a test', type: 'text' }],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a timestamp', () => {
    const sampleText = '** <2019-08-09>'
    const res = lexer(sampleText)

    expect(res).toEqual({
      index: undefined,
      State: undefined,
      content: [{ text: '<2019-08-09>', type: 'timestamp' }],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a headline of level 2 with a DONE, datestamp and url', () => {
    const sampleText = '** DONE this is <1995-01-01> a test http://google.com test'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      content: [
        { text: 'this is', type: 'text' },
        { text: '<1995-01-01>', type: 'timestamp' },
        { text: 'a test', type: 'text' },
        { text: 'http://google.com', type: 'url' },
        { text: 'test', type: 'text' }
      ],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a deadline datestamp', () => {
    const sampleText = 'DEADLINE: <1995-01-01>'
    const res = lexer(sampleText)

    expect(res).toEqual({
      index: undefined,
      content: [{ type: 'DEADLINE:', timestamp: '<1995-01-01>' }],
      type: 'task'
    })
  })

  it('takes in a deadline datestamp with time and a repeater', () => {
    const sampleText = 'DEADLINE: <1995-01-01 12:01:AM ++1m>'
    const res = lexer(sampleText)

    expect(res).toEqual({
      index: undefined,
      content: [{ type: 'DEADLINE:', timestamp: '<1995-01-01 12:01:AM ++1m>' }],
      type: 'task'
    })
  })

  it('takes in a deadline datestamp with time and a repeater', () => {
    const sampleText = 'DEADLINE: <1995-01-01 13:01 ++1m>'
    const res = lexer(sampleText)

    expect(res).toEqual({
      index: undefined,
      content: [{ type: 'DEADLINE:', timestamp: '<1995-01-01 13:01 ++1m>' }],
      type: 'task'
    })
  })

  it('takes in a deadline and scheduled datestamp', () => {
    const sampleText = 'DEADLINE: <1995-01-01> SCHEDULED: <1994-02-02 Mon 01:03:PM>'
    const res = lexer(sampleText)

    expect(res).toEqual({
      index: undefined,
      content: [
        { type: 'DEADLINE:', timestamp: '<1995-01-01>' },
        { type: 'SCHEDULED:', timestamp: '<1994-02-02 Mon 01:03:PM>' }
      ],
      type: 'task'
    })
  })

  it('takes in a headline of level 2 with a TODO, datetimestamp', () => {
    const sampleText = '** DONE this is <1995-01-01 Wed 11:30:AM> a test http://google.com test'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      content: [
        { text: 'this is', type: 'text' },
        { text: '<1995-01-01 Wed 11:30:AM>', type: 'timestamp' },
        { text: 'a test', type: 'text' },
        { text: 'http://google.com', type: 'url' },
        { text: 'test', type: 'text' }
      ],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a headline of level 2 with a DONE and url; identifies three content objects', () => {
    const sampleText = '** DONE this is a test http://google.com test'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      content: [
        { text: 'this is a test', type: 'text' },
        { text: 'http://google.com', type: 'url' },
        { text: 'test', type: 'text' }
      ],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a headline of level 2 with a DONE and url that is bold; identifies five content objects', () => {
    const sampleText = '** DONE this is a *test http://google.com test*'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      content: [
        { text: 'this is a', type: 'text' },
        { text: '*test', type: 'bold' },
        { text: 'http://google.com', type: 'url' },
        { text: 'test*', type: 'bold' }
      ],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a headline of level 2 with a TODO and with a descriptive bracketed URL', () => {
    const sampleText = '** DONE this is a test [[http://google.com][descriptive]] test'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      index: undefined,
      content: [
        { text: 'this is a test', type: 'text' },
        {
          text: '[[http://google.com][descriptive]]',
          displayText: 'descriptive',
          href: 'http://google.com',
          type: 'url'
        },
        { text: 'test', type: 'text' }
      ],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a headline of level 2 with a TODO and with a descriptive bracketed URL with whitespace', () => {
    const sampleText = '** DONE this is a test [[http://google.com][descriptive text]] test'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      index: undefined,
      content: [
        { text: 'this is a test', type: 'text' },
        {
          text: '[[http://google.com][descriptive text]]',
          displayText: 'descriptive text',
          href: 'http://google.com',
          type: 'url'
        },
        { text: 'test', type: 'text' }
      ],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a headline of level 2 with a TODO and with a bracketed URL', () => {
    const sampleText = '** DONE this is a test [[http://google.com]] test'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      index: undefined,
      content: [
        { text: 'this is a test', type: 'text' },
        {
          text: '[[http://google.com]]',
          href: 'http://google.com',
          displayText: 'http://google.com',
          type: 'url'
        },
        { text: 'test', type: 'text' }
      ],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a property and identifies the key value pair', () => {
    const sampleText = '   :Composer: J.S. Bach'
    const res = lexer(sampleText)

    expect(res).toEqual({
      index: undefined,
      content: [{ text: ':Composer:', type: 'propkey' }, { text: 'J.S. Bach', type: 'propval' }],
      priority: undefined,
      type: 'property-entry'
    })
  })

  it('takes in a property start', () => {
    const sampleText = '  :PROPERTIES:'
    const res = lexer(sampleText)

    expect(res).toEqual({
      index: undefined,
      content: [{ text: ':PROPERTIES:', type: 'propstart' }],
      priority: undefined,
      type: 'property-start'
    })
  })

  it('takes in a property end', () => {
    const sampleText = ':END:'
    const res = lexer(sampleText)

    expect(res).toEqual({
      index: undefined,
      content: [{ text: ':END:', type: 'propend' }],
      priority: undefined,
      type: 'property-end'
    })
  })

  it('takes in a headline of level 2 a list blank (percent) progress indicator', () => {
    const sampleText = '** DONE this is a test [%]'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      index: undefined,
      content: [{ text: 'this is a test', type: 'text' }, { text: '[%]', type: 'progress' }],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a headline of level 2 a list blank (ratio) progress indicator', () => {
    const sampleText = '** DONE this is a test [/]'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      index: undefined,
      content: [{ text: 'this is a test', type: 'text' }, { text: '[/]', type: 'progress' }],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a headline of level 2 a list populated (percent) progress indicator', () => {
    const sampleText = '** DONE this is a test [50%]'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      index: undefined,
      content: [{ text: 'this is a test', type: 'text' }, { text: '[50%]', type: 'progress' }],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a headline of level 2 a list populated (ratio) progress indicator', () => {
    const sampleText = '** DONE this is a test [2/4]'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      index: undefined,
      content: [{ text: 'this is a test', type: 'text' }, { text: '[2/4]', type: 'progress' }],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a headline of level 2 with a DONE and identifies bold, italic and strikethrough', () => {
    const sampleText = '** DONE this *bold* this is /test is/ test _test_ '
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      content: [
        { text: 'this', type: 'text' },
        { text: '*bold*', type: 'bold' },
        { text: 'this is', type: 'text' },
        { text: '/test is/', type: 'italic' },
        { text: 'test', type: 'text' },
        { text: '_test_', type: 'underline' }
      ],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('takes in a headline of level 3 with a DONE and identifies two tokens', () => {
    const sampleText = '*** DONE TODO this is a test'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: 'DONE',
      content: [{ text: 'TODO this is a test', type: 'text' }],
      level: 3,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('plain list - test', () => {
    const sampleText = ' - list item'
    const res = lexer(sampleText)

    expect(res).toEqual({
      content: [{ text: ' -', type: 'list', whitespace: 1 }, { text: 'list item', type: 'text' }],
      index: undefined,
      type: 'section'
    })
  })

  it('plain list + test', () => {
    const sampleText = '+ list item'
    const res = lexer(sampleText)

    expect(res).toEqual({
      content: [{ text: '+', type: 'list', whitespace: 0 }, { text: 'list item', type: 'text' }],
      index: undefined,
      type: 'section'
    })
  })

  it('plain list n. test', () => {
    const sampleText = '1. list item'
    const res = lexer(sampleText)

    expect(res).toEqual({
      content: [{ text: '1.', type: 'list', whitespace: 0 }, { text: 'list item', type: 'text' }],
      index: undefined,
      type: 'section'
    })
  })

  it('plain list n.) test', () => {
    const sampleText = '1.) list item'
    const res = lexer(sampleText)

    expect(res).toEqual({
      content: [{ text: '1.)', type: 'list', whitespace: 0 }, { text: 'list item', type: 'text' }],
      index: undefined,
      type: 'section'
    })
  })

  it('plain list - test with checkbox (empty)', () => {
    const sampleText = '- [ ] list item'
    const res = lexer(sampleText)

    expect(res).toEqual({
      content: [
        { text: '-', type: 'list', whitespace: 0 },
        { text: '[ ]', type: 'checkbox' },
        { text: 'list item', type: 'text' }
      ],
      index: undefined,
      type: 'section'
    })
  })

  it('plain list - test with checkbox (checked)', () => {
    const sampleText = '- [X] list item'
    const res = lexer(sampleText)

    expect(res).toEqual({
      content: [
        { text: '-', type: 'list', whitespace: 0 },
        { text: '[X]', type: 'checkbox' },
        { text: 'list item', type: 'text' }
      ],
      index: undefined,
      type: 'section'
    })
  })

  it('plain list - test with checkbox (dash)', () => {
    const sampleText = '- [-] list item'
    const res = lexer(sampleText)

    expect(res).toEqual({
      content: [
        { text: '-', type: 'list', whitespace: 0 },
        { text: '[-]', type: 'checkbox' },
        { text: 'list item', type: 'text' }
      ],
      index: undefined,
      type: 'section'
    })
  })

  it('bad todo', () => {
    const sampleText = '** TODOthis is a test'
    const res = lexer(sampleText)

    expect(res).toEqual({
      State: undefined,
      content: [{ text: 'TODOthis is a test', type: 'text' }],
      level: 2,
      children: [],
      priority: undefined,
      tags: undefined,
      type: 'headline'
    })
  })

  it('bad headline', () => {
    const sampleText = '**TODO this is a test *this is a test* this'
    const res = lexer(sampleText)

    expect(res).toEqual({
      content: [
        { text: '**TODO this is a test', type: 'bold' },
        { text: '*this is a test*', type: 'bold' },
        { text: 'this', type: 'text' }
      ],
      type: 'section'
    })
  })

  it('bad todo and headline', () => {
    const sampleText = '**TODOthis is a test'
    const res = lexer(sampleText)

    expect(res).toEqual({
      content: [{ text: '**TODOthis is a test', type: 'text' }],
      type: 'section'
    })
  })
})
