const parser = require('../../src/parser/parser')

const generateHeadline = level => ({
  level,
  state: 'TODO',
  priority: undefined,
  content: [{ text: 'this is a test', type: 'text' }],
  children: [],
  tags: undefined,
  type: 'headline'
})

const generateSection = () => ({ content: [ { text: 'this is a ', type: 'text' }, { text: '*bold text*', type: 'bold' }, { text: ' test', type: 'text' }], type: 'section' })

describe('parser tests', () => {
  it('test the a 3, 2, 1 headline sequence', () => {
    const text = [generateHeadline(3), generateHeadline(2), generateHeadline(1)]
    const response = parser(text)
    expect(response[0].level).toEqual(3)
    expect(response[1].level).toEqual(2)
    expect(response[2].level).toEqual(1)
  })

  it('parses a 1, 2, 3 headline sequence', () => {
    const text = [generateHeadline(1), generateHeadline(2), generateHeadline(3)]
    const response = parser(text)
    expect(response[0].level).toEqual(1)
    expect(response[0].children[0].level).toEqual(2)
    expect(response[0].children[0].children[0].level).toEqual(3)
  })

  it('parses a 1, 2, 2, 1, 3 headline sequence', () => {
    const text = [generateHeadline(1), generateHeadline(2), generateHeadline(2), generateHeadline(1), generateHeadline(3)]
    const response = parser(text)
    expect(response[0].level).toEqual(1)
    expect(response[0].children[0].level).toEqual(2)
    expect(response[0].children[1].level).toEqual(2)
    expect(response[1].level).toEqual(1)
    expect(response[1].children[0].level).toEqual(3)
  })

  it('parses a 1, 2, 2 headline seq with sections inbetween', () => {
    const text = [
      generateHeadline(1),
      generateSection(),
      generateHeadline(2),
      generateSection(),
      generateHeadline(2),
      generateSection()
    ]

    const response = parser(text)
    expect(response[0].level).toEqual(1)

    expect(response[0].children[0].content).toEqual([
      { text: 'this is a ', type: 'text' },
      { text: '*bold text*', type: 'bold' },
      { text: ' test', type: 'text' }
    ]
    )
    expect(response[0].children[1].level).toEqual(2)

    expect(response[0].children[1].content).toEqual([{ 'text': 'this is a test', 'type': 'text' }])

    expect(response[0].children[1].children[0]).toEqual({ content: [
      { text: 'this is a ', type: 'text' },
      { text: '*bold text*', type: 'bold' },
      { text: ' test', type: 'text' } ],
    type: 'section' })

    expect(response[0].children[2].level).toEqual(2)

    expect(response[0].children[2].content).toEqual([{ 'text': 'this is a test', 'type': 'text' }])

    expect(response[0].children[2].children[0]).toEqual({ content: [
      { text: 'this is a ', type: 'text' },
      { text: '*bold text*', type: 'bold' },
      { text: ' test', type: 'text' } ],
    type: 'section' })
  })
})
