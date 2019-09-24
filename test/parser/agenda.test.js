const { default: agenda, getAgenda } = require('../../src/parser/agenda')

const file = [
  '* this is a headline',
  '** headline above',
  'DEADLINE: <2019-10-11 10:45:AM>',
  'section text',
  'more section',
  '** another headline'
].join('\n')

jest.mock('idb-keyval', () => ({
  keys: () => ['test1', 'test2', 'test3'],
  get: () =>
    [
      '* this is a headline',
      '** headline above',
      'DEADLINE: <2019-10-11 10:45:AM>',
      'section text',
      'more section',
      '** another headline'
    ].join('\n')
}))

describe('agenda tests', () => {
  it('finds some tasks', () => {
    const response = getAgenda(file)

    expect(response).toEqual([
      {
        headline: '** headline above',
        task: 'DEADLINE: <2019-10-11 10:45:AM>'
      }
    ])
  })

  it('scraps all the files in index db for agendas', async () => {
    const response = await agenda()
    expect(response).toEqual([
      {
        file: 'test1',
        text: [
          {
            headline: '** headline above',
            task: 'DEADLINE: <2019-10-11 10:45:AM>'
          }
        ]
      },
      {
        file: 'test2',
        text: [
          {
            headline: '** headline above',
            task: 'DEADLINE: <2019-10-11 10:45:AM>'
          }
        ]
      },
      {
        file: 'test3',
        text: [
          {
            headline: '** headline above',
            task: 'DEADLINE: <2019-10-11 10:45:AM>'
          }
        ]
      }
    ])
  })
})
