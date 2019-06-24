import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import userEvent from 'user-event'
import indexedDB from 'idb-keyval'

jest.mock('../../src/utils/dropbox-files')

jest.mock('dropbox')

jest.mock('idb-keyval', () => ({
  get: jest.fn(() => new Promise(res => res('here is some text'))),
  keys: jest.fn(() => new Promise(res => res())),
  set: jest.fn(() => new Promise(res => res())),
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

  it('renders the current filename after selecting a new file', async () => {
    indexedDB.keys.mockImplementationOnce(
      () => new Promise(res => res(['test1', 'test2', 'test3']))
    )
    const App = require('../../src/components/App').default
    const { getByTitle, getByText, getAllByTestId, container } = render(<App />)
    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('test2'))

    fireEvent.click(getByText('test2'), { button: 1 })

    expect(getAllByTestId('filename-titlebar')[0]).toHaveTextContent('test2')

    expect(container).toMatchSnapshot()
  })

  it('renders an add file icon and allows a new file to be added', async () => {
    const mockIdxDB = ['test1', 'test2', 'test3']
    indexedDB.keys.mockImplementationOnce(
      () => new Promise(res => res(mockIdxDB))
    )
    indexedDB.set.mockImplementation((name, val) => mockIdxDB.push(name))
    const App = require('../../src/components/App').default
    const {
      getByTitle,
      getByText,
      getByTestId,
      getByLabelText,
      debug,
      container,
    } = render(<App />)
    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    const addFileBtn = getByTitle('add-file')

    fireEvent.click(addFileBtn, { button: 1 })

    await waitForElement(() => getByText('Create a new file?'))

    fireEvent.change(getByLabelText('New Filename'), {
      target: { value: 'this-is-a-file' },
    })

    const createBtn = getByText('Create')

    fireEvent.click(createBtn, { button: 1 })

    expect(getByText('this-is-a-file.org')).toBeDefined()

    expect(container).toMatchSnapshot()
  })
})
