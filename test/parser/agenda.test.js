import indexedDB from 'idb-keyval'
import mockdate from 'mockdate'
import agenda, {
  getAgenda,
  getAgendaDayView,
  getAgendaWeekView,
  getAgendaMonthView
} from '../../src/parser/agenda'

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
  get: jest.fn(() =>
    [
      '* this is a headline',
      '** TODO headline above',
      'DEADLINE: <2019-10-11 10:45:PM ++25w>',
      'section text',
      'more section',
      '** another headline'
    ].join('\n')
  )
}))

describe('agenda tests', () => {
  it('should always be UTC', () => {
    expect(new Date().getTimezoneOffset()).toBe(0)
  })
  it('finds some tasks', () => {
    const response = getAgenda(file)

    expect(response[0].date.toString()).toEqual(
      'Fri Oct 11 2019 10:45:00 GMT+0000 (Coordinated Universal Time)'
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
    expect(response[0].headline).toEqual('** TODO headline above')
    expect(response[0].task).toEqual('DEADLINE: <2019-10-11 10:45:PM ++25w>')
    expect(response[0].dt.dateTime).toEqual('2019-10-11 Fri 10:45:PM ++25w')
    expect(response[0].dt.date).toEqual('2019-10-11')
    expect(response[0].dt.frequency).toEqual('++25w')
    expect(response[0].dt.time).toEqual('22:45')
    expect(response[0].date.toLocaleString()).toEqual('10/11/2019, 10:45:00 PM')

    expect(response[1].file).toEqual('test2')
    expect(response[1].headline).toEqual('** TODO headline above')
    expect(response[1].task).toEqual('DEADLINE: <2019-10-11 10:45:PM ++25w>')
    expect(response[1].dt.dateTime).toEqual('2019-10-11 Fri 10:45:PM ++25w')
    expect(response[1].dt.date).toEqual('2019-10-11')
    expect(response[1].dt.frequency).toEqual('++25w')
    expect(response[1].dt.time).toEqual('22:45')
    expect(response[1].date.toLocaleString()).toEqual('10/11/2019, 10:45:00 PM')
  })

  it('agenda view for the day', async () => {
    mockdate.set(new Date('2019-10-12T11:00'))
    const list = await getAgendaDayView(new Date('2019-10-12'))
    expect(list.length).toEqual(1)
    expect(list[0].day.toString()).toEqual(
      'Sat Oct 12 2019 00:00:00 GMT+0000 (Coordinated Universal Time)'
    )
    expect(list[0].tasks.length).toEqual(3)
  })

  it('agenda view for the week', async () => {
    mockdate.set(
      new Date('2019-10-12T11:00').toLocaleString('en-US', { timeZone: 'America/New_York' })
    )
    const list = await getAgendaWeekView(new Date('2019-10-12'))
    expect(list.length).toEqual(7)
    expect(list[0].day.toLocaleString()).toEqual('10/6/2019, 12:00:00 AM')
    expect(list[0].tasks).toEqual([])
    expect(list[5].day.toLocaleString()).toEqual('10/11/2019, 12:00:00 AM')
    expect(list[5].tasks.length).toEqual(3)
    expect(list[5].tasks[0].overDueDays).toEqual(undefined)
    expect(list[6].day.toLocaleString()).toEqual('10/12/2019, 12:00:00 AM')
    expect(list[6].tasks.length).toEqual(3)
    expect(list[6].tasks[0].overDueDays).toEqual(-1)
  })

  it('agenda view for the month', async () => {
    mockdate.set(
      new Date('2019-10-12T11:00').toLocaleString('en-US', { timeZone: 'America/New_York' })
    )
    const list = await getAgendaMonthView(new Date('2019-10-12'))
    expect(list.length).toEqual(31)
    expect(list[0].day.toLocaleString()).toEqual('10/1/2019, 12:00:00 AM')
    expect(list[0].tasks).toEqual([])
    expect(list[10].day.toLocaleString()).toEqual('10/11/2019, 12:00:00 AM')
    expect(list[10].tasks.length).toEqual(3)
  })

  it('should display old and not completed tasks in the agenda for today', async () => {
    mockdate.set(
      new Date('2019-09-29T11:00').toLocaleString('en-US', { timeZone: 'America/New_York' })
    )
    indexedDB.get.mockImplementation(() =>
      Promise.resolve(
        [
          '* this is a headline',
          '** TODO headline above',
          'DEADLINE: <2019-09-11 10:45:PM ++25w>',
          'section text',
          'more section',
          '** DONE another headline',
          'DEADLINE: <2019-09-15 10:45:PM ++25w>'
        ].join('\n')
      )
    )
    const list = await getAgendaWeekView()
    expect(list[0].tasks.length).toEqual(3)
    expect(list[0].tasks[0].overDueDays).toEqual(-18)
    expect(list[0].tasks[1].overDueDays).toEqual(-18)
  })
})
