const { default: agenda, getAgenda, getCurrentWeek } = require('../../src/parser/agenda')

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

    expect(response[0].date.toString()).toEqual(
      'Fri Oct 11 2019 10:45:00 GMT-0400 (Eastern Daylight Time)'
    )
    expect(response[0].headline).toEqual('** headline above')
    expect(response[0].task).toEqual('DEADLINE: <2019-10-11 10:45:AM>')
    expect(response[0].dt.date).toEqual('2019-10-11')
    expect(response[0].dt.dateTime).toEqual('2019-10-11 Fri 10:45:AM')
    expect(response[0].dt.time).toEqual('10:45')
  })

  it('scraps all the files in index db for agendas', async () => {
    const response = await agenda()

    expect(response[0].file).toEqual('test1')
    expect(response[0].headline).toEqual('** headline above')
    expect(response[0].task).toEqual('DEADLINE: <2019-10-11 10:45:PM ++25w>')
    expect(response[0].dt.dateTime).toEqual('2019-10-11 Fri 10:45:PM ++25w')
    expect(response[0].dt.date).toEqual('2019-10-11')
    expect(response[0].dt.frequency).toEqual('++25w')
    expect(response[0].dt.time).toEqual('22:45')
    expect(response[0].date.toLocaleString()).toEqual('10/11/2019, 10:45:00 PM')

    expect(response[1].file).toEqual('test2')
    expect(response[1].headline).toEqual('** headline above')
    expect(response[1].task).toEqual('DEADLINE: <2019-10-11 10:45:PM ++25w>')
    expect(response[1].dt.dateTime).toEqual('2019-10-11 Fri 10:45:PM ++25w')
    expect(response[1].dt.date).toEqual('2019-10-11')
    expect(response[1].dt.frequency).toEqual('++25w')
    expect(response[1].dt.time).toEqual('22:45')
    expect(response[1].date.toLocaleString()).toEqual('10/11/2019, 10:45:00 PM')
  })
})

describe('agenda calendar functions', () => {
  it.skip('should get the days of the current week', () => {
    const week = getCurrentWeek()
    expect(week).toEqual()
  })
})
