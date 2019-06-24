import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import indexedDB from 'idb-keyval'

jest.mock('../../src/utils/dropbox-files')

jest.mock('dropbox')

jest.mock('idb-keyval', () => ({
  get: jest.fn(() => new Promise(res => res('here is some text'))),
  keys: jest.fn(() => new Promise(res => res())),
}))

describe('fileExplorer tests', () => {
  afterEach(cleanup)
  it('renders all the file names stored in indededDB, clicking on a file changes it background and returns calls setText', async () => {
    indexedDB.keys.mockImplementationOnce(
      () => new Promise(res => res(['test1', 'test2', 'test3']))
    )
    const App = require('../../src/components/App').default
    const { getByTitle, getByText, getAllByText, container } = render(<App />)
    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('test1'))

    expect(container).toMatchSnapshot()

    expect(getAllByText('Welcome to Web-org')[1]).toHaveClass(
      'makeStyles-highlighedText-99'
    )
    expect(getByText('test1')).toHaveClass('makeStyles-normalText-100')

    fireEvent.click(getByText('test1'), { button: 1 })

    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('Welcome to Web-org'))

    expect(getByText('Welcome to Web-org')).toHaveClass(
      'makeStyles-normalText-100'
    )

    expect(getAllByText('test1')[1]).toHaveClass('makeStyles-highlighedText-99')
  })

  it('displays the default filename in the title area', () => {
    indexedDB.keys.mockImplementation(() => new Promise(res => res([])))
    const App = require('../../src/components/App').default
    const { getAllByTestId } = render(<App />)

    expect(getAllByTestId('filename-titlebar')[0]).toHaveTextContent(
      'Welcome to Web-org'
    )
  })
})
