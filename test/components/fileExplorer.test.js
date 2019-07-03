import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
  waitForElementToBeRemoved,
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import userEvent from 'user-event'
import indexedDB from 'idb-keyval'

jest.mock('../../src/utils/dropbox-files')

jest.mock('dropbox')

jest.mock('idb-keyval', () => ({
  get: jest.fn(() => new Promise(res => res('here is some text'))),
  keys: jest.fn(() => Promise.resolve([])),
  set: jest.fn(() => new Promise(res => res())),
  del: jest.fn(() => new Promise(res => res())),
}))

describe('fileExplorer tests', () => {
  afterEach(cleanup)
  it('renders all the file names stored in indededDB, clicking on a file changes it background and returns calls setText', async () => {
    indexedDB.keys.mockImplementationOnce(() =>
      Promise.resolve(['test1.org', 'test2.org', 'test3.org'])
    )
    const App = require('../../src/components/App').default
    const { getByTitle, getByText, getAllByText, container } = render(<App />)
    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('test1.org'))

    expect(container).toMatchSnapshot()

    expect(getAllByText('Welcome to Weborg')[1]).toHaveClass(
      'makeStyles-highlighedText-99'
    )
    expect(getByText('test1.org')).toHaveClass('makeStyles-normalText-100')

    fireEvent.click(getByText('test1.org'), { button: 1 })

    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('Welcome to Weborg'))

    expect(getByText('Welcome to Weborg')).toHaveClass(
      'makeStyles-normalText-100'
    )

    expect(getAllByText('test1.org')[1]).toHaveClass(
      'makeStyles-highlighedText-99'
    )
  })

  it('displays the default filename in the title area', () => {
    indexedDB.keys.mockImplementation(() => Promise.resolve([]))
    const App = require('../../src/components/App').default
    const { getAllByTestId } = render(<App />)

    expect(getAllByTestId('filename-titlebar')[0]).toHaveTextContent(
      'Welcome to Weborg'
    )
  })

  it('renders the current filename after selecting a new file', async () => {
    indexedDB.keys.mockImplementationOnce(() =>
      Promise.resolve(['test1.org', 'test2.org', 'test3.org'])
    )
    const App = require('../../src/components/App').default
    const { getByTitle, getByText, getAllByTestId, container } = render(<App />)
    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('test2.org'))

    fireEvent.click(getByText('test2.org'), { button: 1 })

    expect(getAllByTestId('filename-titlebar')[0]).toHaveTextContent('test2')

    expect(container).toMatchSnapshot()
  })

  it('renders an add file icon and allows a new file to be added', async () => {
    const mockIdxDB = ['test1.org', 'test2.org', 'test3.org']
    indexedDB.keys.mockImplementationOnce(() => Promise.resolve(mockIdxDB))
    indexedDB.set.mockImplementation(name => mockIdxDB.push(name))
    const App = require('../../src/components/App').default
    const { getByTitle, getByText, getByLabelText, container } = render(<App />)
    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    const addFileBtn = getByTitle('add-file')

    fireEvent.click(addFileBtn, { button: 1 })

    await waitForElement(() => getByText('Create a new file?'))

    fireEvent.change(getByLabelText('New Filename'), {
      target: { value: 'this-is-a-file' },
    })

    const createBtn = getByText('Create')

    fireEvent.click(createBtn, { button: 1 })

    expect(mockIdxDB).toEqual([
      'test1.org',
      'test2.org',
      'test3.org',
      'this-is-a-file.org',
    ])
    expect(getByText('this-is-a-file.org')).toBeDefined()

    expect(container).toMatchSnapshot()
  })

  it('renders a delete file icon and allows a file to be deleted', async () => {
    let mockIdxDB = ['test1.org', 'test2.org', 'test3.org']
    indexedDB.keys.mockImplementationOnce(() => Promise.resolve(mockIdxDB))
    indexedDB.del.mockImplementationOnce(
      file =>
        new Promise(res => {
          res((mockIdxDB = mockIdxDB.filter(entry => entry !== file)))
        })
    )
    const App = require('../../src/components/App').default
    const { baseElement, getByTitle, getByText, container } = render(<App />)
    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('test2.org'))

    fireEvent.click(getByText('test2.org'), { button: 1 })

    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    const deleteFileBtn = getByTitle('delete-file')

    fireEvent.click(deleteFileBtn, { button: 1 })

    await waitForElement(() =>
      getByText('Are you sure you intend to delete the file:')
    )

    const deleteBtn = getByText('Delete')

    fireEvent.click(deleteBtn, { button: 1 })

    expect(baseElement).not.toHaveTextContent('test2.org')

    expect(mockIdxDB).toEqual(['test1.org', 'test3.org'])

    expect(container).toMatchSnapshot()
  })

  it('renders an edit filename icon and allows a filename to be edited', async () => {
    let mockIdxDB = ['test1.org', 'test2.org', 'test3.org']
    indexedDB.keys.mockImplementationOnce(() => Promise.resolve(mockIdxDB))
    indexedDB.set.mockImplementation((name, val) => mockIdxDB.push(name))
    indexedDB.del.mockImplementationOnce(
      file =>
        new Promise(res => {
          res((mockIdxDB = mockIdxDB.filter(entry => entry !== file)))
        })
    )
    const App = require('../../src/components/App').default
    const {
      baseElement,
      getByTitle,
      getByLabelText,
      getByText,
      container,
    } = render(<App />)
    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('test2.org'))

    fireEvent.click(getByText('test2.org'), { button: 1 })

    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    const editFileBtn = getByTitle('edit-file')

    fireEvent.click(editFileBtn, { button: 1 })

    await waitForElement(() =>
      getByText('Are you sure you want to edit the filename?')
    )

    fireEvent.change(getByLabelText('New Filename'), {
      target: { value: 'this-is-a-file' },
    })

    const saveBtn = getByText('Save')

    fireEvent.click(saveBtn, { button: 1 })

    await waitForElement(() => getByText('test3.org'))

    expect(baseElement).not.toHaveTextContent('test2.org')

    expect(baseElement).toHaveTextContent('this-is-a-file.org')

    expect(mockIdxDB).toEqual(['test1.org', 'test3.org', 'this-is-a-file.org'])

    expect(container).toMatchSnapshot()
  })

  it('displays view mode with no file explorer after selecting a file', async () => {
    let mockIdxDB = ['test1.org', 'test2.org', 'test3.org']
    indexedDB.keys.mockImplementationOnce(() => Promise.resolve(mockIdxDB))
    const App = require('../../src/components/App').default
    const { getByTitle, queryByText, getByText, container } = render(<App />)
    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('test2.org'))

    expect(getByText('test1.org')).toBeDefined()
    expect(getByText('test3.org')).toBeDefined()

    fireEvent.click(getByText('test2.org'), { button: 1 })

    await waitForElementToBeRemoved(() => getByText('test1.org'))

    expect(queryByText('test1.org')).toEqual(null)
    expect(queryByText('test3.org')).toEqual(null)

    expect(container).toMatchSnapshot()
  })
})
