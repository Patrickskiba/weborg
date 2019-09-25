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
      'DEADLINE: <2019-10-11 10:45:PM ++25w>',
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

    expect(response[0].file).toEqual('test1')
    expect(response[0].text[0].headline).toEqual('** headline above')
    expect(response[0].text[0].task).toEqual('DEADLINE: <2019-10-11 10:45:PM ++25w>')
    expect(response[0].dt.dateTime).toEqual('2019-10-11 Fri 10:45:PM ++25w')
    expect(response[0].dt.date).toEqual('2019-10-11')
    expect(response[0].dt.frequency).toEqual('++25w')
    expect(response[0].dt.time).toEqual('22:45')
  })
})
