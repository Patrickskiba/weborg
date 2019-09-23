const agenda = require('../../src/parser/agenda')

const file = [
  '* this is a headline',
  '** headline above',
  'DEADLINE: <2019-10-11 10:45:AM>',
  'section text',
  'more section',
  '** another headline'
].join('\n')

describe('agenda tests', () => {
  it('finds some tasks', () => {
    const response = agenda(file)

    expect(response).toEqual([
      {
        headline: '** headline above',
        task: 'DEADLINE: <2019-10-11 10:45:AM>'
      }
    ])
  })
})
