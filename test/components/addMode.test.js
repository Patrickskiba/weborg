import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
  waitForElementToBeRemoved
} from 'react-testing-library'
import userEvent from 'user-event'
import 'jest-dom/extend-expect'
import jsdom from 'jsdom'

jest.mock('idb-keyval', () => ({
  keys: () => Promise.resolve([]),
  set: () => {}
}))

jest.mock('dropbox')

jest.mock('../../src/utils/dropbox-files')

describe('add mode tests', () => {
  afterEach(cleanup)

  it('adds a new note when filling out all the fields and clicking the save button', async () => {
    window.scrollTo = jest.fn()

    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { getByLabelText, getByTitle, getByText, getAllByText, getByRole } = render(
      <Provider>
        <App />
      </Provider>
    )

    const addBtn = getByTitle('Add')

    fireEvent.click(addBtn, { button: 1 })

    await waitForElement(() => getByRole('level'))

    const level = getByRole('level')

    const headline = getByLabelText('Headline')
    const content = getByLabelText('Content')

    expect(level.textContent).toEqual('1')

    expect(headline.value).toEqual('')

    expect(content.value).toEqual('')

    fireEvent.click(getAllByText('add')[0])

    const headlinetype = getByLabelText('Headline')
    userEvent.type(headlinetype, 'this is an add for test')

    const contenttype = getByLabelText('Content')
    userEvent.type(contenttype, 'here is some test content for the new note')

    const save = getByTitle('save')

    fireEvent.click(save, { button: 1 })

    expect(getByText('this is an add for test')).toBeDefined()

    expect(getByText('here is some test content for the new note')).toBeDefined()
  })

  it('should all a deadline to be added when making a note', async () => {
    window.scrollTo = jest.fn()

    const text = [
      '* this is a test',
      'some context',
      '** level two headline',
      'DEADLINE: <2019-07-14 11:25:AM>',
      'context beneth'
    ].join('\n')

    const { StoreProvider: Provider } = require('../../src/components/Store')

    const App = require('../../src/components/App').default
    const { getByText, getByLabelText, getByTitle, getByRole, queryByText } = render(
      <Provider text={text}>
        <App />
      </Provider>
    )

    const addBtn = getByTitle('Add')

    fireEvent.click(addBtn, { button: 1 })

    await waitForElement(() => getByRole('level'))

    const headlinetype = getByLabelText('Headline')
    userEvent.type(headlinetype, 'this is an add for test')

    const schedule = getByLabelText('SCHEDULED')

    expect(schedule.value).toEqual('')

    userEvent.click(schedule)

    await waitForElement(() => getByText('CLEAR'))

    fireEvent.change(getByRole('date-picker'), {
      target: { value: '2019-09-02' }
    })

    userEvent.click(getByText('Submit'))

    await waitForElementToBeRemoved(() => queryByText('Submit'))

    userEvent.click(schedule)

    await waitForElement(() => getByText('CLEAR'))

    fireEvent.change(getByRole('time-picker'), {
      target: { value: '23:00' }
    })

    userEvent.click(getByText('Submit'))

    await waitForElementToBeRemoved(() => queryByText('Submit'))

    expect(schedule.value).toEqual('2019-09-02 Mon 11:00:PM')

    const save = getByTitle('save')

    fireEvent.click(save, { button: 1 })

    await waitForElement(() => getByText('this is a test'))

    expect(getByText('DEADLINE:')).toBeDefined()
    expect(getByText('<2019-09-02 Mon 11:00:PM>')).toBeDefined()
  })
})
