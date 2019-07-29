import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
  act,
} from 'react-testing-library'
import userEvent from 'user-event'
import 'jest-dom/extend-expect'
import jsdom from 'jsdom'

jest.mock('idb-keyval', () => ({
  keys: () => Promise.resolve([]),
  set: () => {},
}))

jest.mock('dropbox')

jest.mock('../../src/utils/dropbox-files')

describe('add mode tests', () => {
  afterEach(cleanup)

  it('adds a new note when filling out all the fields and clicking the save button', async () => {
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { getByLabelText, getByTitle, getByText, debug, container } = render(
      <Provider>
        <App />
      </Provider>
    )

    const addBtn = getByTitle('Add')

    fireEvent.click(addBtn, { button: 1 })

    await waitForElement(() => getByLabelText('Level'))

    const level = getByLabelText('Level')
    const headline = getByLabelText('Headline')
    const content = getByLabelText('Content')

    expect(level.value).toEqual('1')

    expect(headline.value).toEqual('')

    expect(content.value).toEqual('')

    const leveltype = getByLabelText('Level')
    userEvent.type(leveltype, '2')

    const headlinetype = getByLabelText('Headline')
    userEvent.type(headlinetype, 'this is an add for test')

    const contenttype = getByLabelText('Content')
    userEvent.type(contenttype, 'here is some test content for the new note')

    const save = getByTitle('save')

    fireEvent.click(save, { button: 1 })

    await waitForElement(() =>
      getByText('here is some test content for the new note')
    )

    expect(getByText('this is an add for test')).toBeDefined()

    expect(
      getByText('here is some test content for the new note')
    ).toBeDefined()

    expect(container).toMatchSnapshot()
  })
})
