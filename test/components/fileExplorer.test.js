import React from 'react'
import { render, cleanup, fireEvent, waitForElement } from 'react-testing-library'
import 'jest-dom/extend-expect'
import userEvent from 'user-event'
import indexedDB from 'idb-keyval'
import fileHelper from '../../src/utils/file-helpers'

jest.mock('../../src/utils/dropbox-files')

jest.mock('dropbox')

jest.mock('idb-keyval', () => ({
  get: jest.fn(() => new Promise(res => res('here is some text'))),
  keys: jest.fn(() => Promise.resolve([])),
  set: jest.fn(() => new Promise(res => res())),
  del: jest.fn(() => new Promise(res => res()))
}))

jest.mock('../../src/utils/file-helpers', () => ({
  saveChanges: jest.fn(() => Promise.resolve()),
  deleteFile: jest.fn(() => Promise.resolve())
}))

describe('fileExplorer tests', () => {
  afterEach(cleanup)
  it('renders all the file names stored in indededDB, clicking on a file changes it background and returns calls setText', async () => {
    const customHooks = require('../../src/utils/custom-hooks')
    customHooks.useLongPress = ({ short }) => ({
      onClick: () => short()
    })
    indexedDB.keys.mockImplementationOnce(() =>
      Promise.resolve(['Welcome to Weborg.org', 'test1.org', 'test2.org', 'test3.org'])
    )
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { getByTitle, getByText, getAllByText, container } = render(
      <Provider>
        <App />
      </Provider>
    )

    await waitForElement(() => getByText('Welcome to Weborg.or...'))

    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('test1.org'))

    expect(container).toMatchSnapshot()

    fireEvent.click(getByText('test1.org'), { button: 1 })

    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('Welcome to Weborg.org'))

    expect(getByText('Welcome to Weborg.org')).toHaveClass(
      'MuiTypography-root MuiListItemText-primary makeStyles-normalText-3 MuiTypography-body1'
    )

    expect(getAllByText('test1.org')[1]).toHaveClass(
      'MuiTypography-root MuiListItemText-primary makeStyles-highlighedText-2 MuiTypography-body1'
    )
  })

  it('displays the default filename in the title area', async () => {
    const customHooks = require('../../src/utils/custom-hooks')
    customHooks.useLongPress = ({ short }) => ({
      onClick: () => short()
    })
    indexedDB.keys.mockImplementation(() => Promise.resolve([]))
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { getAllByTestId, getByText } = render(
      <Provider>
        <App />
      </Provider>
    )

    await waitForElement(() => getByText('Welcome to Weborg.or...'))

    expect(getAllByTestId('filename-titlebar')[0]).toHaveTextContent('Welcome to Weborg.or...')
  })

  it('renders the current filename after selecting a new file', async () => {
    const customHooks = require('../../src/utils/custom-hooks')
    customHooks.useLongPress = ({ short }) => ({
      onClick: () => short()
    })
    indexedDB.keys.mockImplementationOnce(() =>
      Promise.resolve(['test1.org', 'test2.org', 'test3.org'])
    )
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { getByTitle, getByText, getAllByText, getAllByTestId, container } = render(
      <Provider>
        <App />
      </Provider>
    )

    await waitForElement(() => getByText('Welcome to Weborg.or...'))

    userEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('test2.org'))

    userEvent.click(getByText('test2.org'))

    await waitForElement(() => getAllByText('test2.org')[1])

    expect(getAllByTestId('filename-titlebar')[0]).toHaveTextContent('test2')

    expect(container).toMatchSnapshot()
  })

  it('renders an add file icon and allows a new file to be added', async () => {
    const customHooks = require('../../src/utils/custom-hooks')
    customHooks.useLongPress = ({ short }) => ({
      onClick: () => short()
    })
    const mockIdxDB = ['test1.org', 'test2.org', 'test3.org']
    fileHelper.saveChanges.mockImplementation(newText => mockIdxDB.push(newText.selectedRow))
    indexedDB.keys.mockImplementationOnce(() => Promise.resolve(mockIdxDB))
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { getByTitle, getByText, getByLabelText, container } = render(
      <Provider>
        <App />
      </Provider>
    )

    await waitForElement(() => getByText('Welcome to Weborg.or...'))

    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    const addFileBtn = getByTitle('add-file')

    userEvent.click(addFileBtn, { button: 1 })

    await waitForElement(() => getByText('Create a new file?'))

    fireEvent.change(getByLabelText('New Filename'), {
      target: { value: 'this-is-a-file' }
    })

    const createBtn = getByText('Create')

    userEvent.click(createBtn, { button: 1 })

    expect(mockIdxDB).toEqual(['test1.org', 'test2.org', 'test3.org', 'this-is-a-file.org'])

    expect(getByText('this-is-a-file.org')).toBeDefined()

    expect(container).toMatchSnapshot()
  })

  it('renders a delete file icon and allows a file to be deleted', async () => {
    const customHooks = require('../../src/utils/custom-hooks')
    customHooks.useLongPress = ({ short }) => ({
      onClick: () => short()
    })
    let mockIdxDB = ['test1.org', 'test2.org', 'test3.org']
    indexedDB.keys.mockImplementationOnce(() => Promise.resolve(mockIdxDB))
    fileHelper.deleteFile.mockImplementationOnce(
      file =>
        new Promise(res => {
          res((mockIdxDB = mockIdxDB.filter(entry => entry !== file.selectedRow)))
        })
    )
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { baseElement, getByTitle, getByText, container } = render(
      <Provider>
        <App />
      </Provider>
    )
    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('test2.org'))

    fireEvent.click(getByText('test2.org'), { button: 1 })

    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    const deleteFileBtn = getByTitle('delete-file')

    fireEvent.click(deleteFileBtn, { button: 1 })

    await waitForElement(() => getByText('Are you sure you intend to delete the file:'))

    const deleteBtn = getByText('Delete')

    fireEvent.click(deleteBtn, { button: 1 })

    expect(baseElement).not.toHaveTextContent('test2.org')

    expect(mockIdxDB).toEqual(['test1.org', 'test3.org'])

    expect(container).toMatchSnapshot()
  })

  it('renders an edit filename icon and allows a filename to be edited', async () => {
    const customHooks = require('../../src/utils/custom-hooks')
    customHooks.useLongPress = ({ short }) => ({
      onClick: () => {
        short()
      }
    })
    fileHelper.saveChanges.mockImplementation(newText => mockIdxDB.push(newText.selectedRow))
    let mockIdxDB = ['test1.org', 'test2.org', 'test3.org']
    indexedDB.keys.mockImplementationOnce(() => Promise.resolve(mockIdxDB))
    fileHelper.deleteFile.mockImplementationOnce(
      file =>
        new Promise(res => {
          res((mockIdxDB = mockIdxDB.filter(entry => entry !== file.selectedRow)))
        })
    )
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { baseElement, getByTitle, getByLabelText, getByText, container } = render(
      <Provider>
        <App />
      </Provider>
    )
    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    await waitForElement(() => getByText('test2.org'))

    fireEvent.click(getByText('test2.org'), { button: 1 })

    fireEvent.click(getByTitle('toggle-file-explorer'), { button: 1 })

    const editFileBtn = getByTitle('edit-file')

    fireEvent.click(editFileBtn, { button: 1 })

    await waitForElement(() => getByText('Are you sure you want to edit the filename?'))

    fireEvent.change(getByLabelText('New Filename'), {
      target: { value: 'this-is-a-file' }
    })

    const saveBtn = getByText('Save')

    fireEvent.click(saveBtn, { button: 1 })

    await waitForElement(() => getByText('test3.org'))

    expect(baseElement).not.toHaveTextContent('test2.org')

    expect(baseElement).toHaveTextContent('this-is-a-file.org')

    expect(mockIdxDB).toEqual(['test1.org', 'test3.org', 'this-is-a-file.org'])

    expect(container).toMatchSnapshot()
  })
})
