import React from 'react'
import { render, cleanup, fireEvent, waitForElement } from 'react-testing-library'
import 'jest-dom/extend-expect'
import jsdom from 'jsdom'
import userEvent from 'user-event'

jest.mock('idb-keyval', () => ({
  keys: () => Promise.resolve(['test1']),
  get: () =>
    Promise.resolve(`
* Great Unix Tools
** rsync
Copy a file with a progress bar
sudo rsync --info=progress2 source dest
** du - disk usage
du -sh file_path
-s : summarized
-h : human readable https://test.com
** pacman
search pacman
- sudo pacman -Ss package_name
`),
  set: () => {}
}))

jest.mock('dropbox')

jest.mock('../../src/utils/dropbox-files')

jest.mock('../../src/utils/file-helpers', () => ({
  saveChanges: jest.fn()
}))

const initState = {
  text: `
* Great Unix Tools
** rsync
Copy a file with a progress bar
sudo rsync --info=progress2 source dest
** du - disk usage
du -sh file_path
-s : summarized
-h : human readable https://test.com
** pacman
search pacman
- sudo pacman -Ss package_name
`,
  mode: { type: 'View', payload: undefined },
  selectedRow: 'test1'
}

jest.mock('../../src/components/LongPress', () => ({ short, children }) => (
  <div onClick={() => short()}>{children}</div>
))

describe('app tests', () => {
  afterEach(cleanup)
  it('renders the component with the correct headlines and collapses the topmost headline', async () => {
    const mockedDropbox = require('dropbox')
    const mockedDropboxFiles = require('../../src/utils/dropbox-files')

    window.location.hash = '#access_token=test'

    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { getAllByText, getAllByTestId, getAllByTitle, container } = render(
      <Provider initState={initState}>
        <App />
      </Provider>
    )

    const headlines = getAllByTestId('headline')

    expect(headlines[0]).toHaveTextContent(
      'Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized -h : human readable https://test.com pacman search pacman - sudo pacman -Ss package_name'
    )
    expect(headlines[1]).toHaveTextContent(
      'rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest'
    )
    expect(headlines[2]).toHaveTextContent(
      'du - disk usage du -sh file_path -s : summarized -h : human readable https://test.com'
    )
    expect(headlines[3]).toHaveTextContent('pacman search pacman - sudo pacman -Ss package_name')

    fireEvent.click(getAllByTitle('dash-collapse')[0], { button: 1 })
    fireEvent.click(getAllByTitle('dash-collapse')[1], { button: 1 })

    const condensedHeadlines = getAllByTestId('headline')

    expect(condensedHeadlines[0]).toHaveTextContent('Great Unix Tools')
    expect(condensedHeadlines[1]).toHaveTextContent('rsync')
    expect(condensedHeadlines[2]).toHaveTextContent('du - disk usage')
    expect(condensedHeadlines[3]).toHaveTextContent('pacman')

    expect(container).toMatchSnapshot()

    fireEvent.click(getAllByTitle('plus-expand')[0], { button: 1 })
    fireEvent.click(getAllByTitle('plus-expand')[0], { button: 1 })

    const uncondensedHeadlines = getAllByTestId('headline')

    expect(headlines[0]).toHaveTextContent(
      'Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized -h : human readable https://test.com pacman search pacman - sudo pacman -Ss package_name'
    )
    expect(headlines[1]).toHaveTextContent(
      'rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest'
    )
    expect(headlines[2]).toHaveTextContent(
      'du - disk usage du -sh file_path -s : summarized -h : human readable https://test.com'
    )
    expect(headlines[3]).toHaveTextContent('pacman search pacman - sudo pacman -Ss package_name')
  })

  it('enables move mode when clicking on the move item option', async () => {
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default

    const { getByText, getByTitle, container, baseElement } = render(
      <Provider initState={initState}>
        <App />
      </Provider>
    )

    fireEvent.click(getByTitle('options-menu'), { button: 1 })

    fireEvent.click(getByText('Move Items'), { button: 1 })

    expect(getByTitle('move-note-up')).toBeDefined()

    expect(getByTitle('move-note-down')).toBeDefined()

    fireEvent.click(getByText('pacman'), { button: 1 })

    expect(container).toMatchSnapshot()

    expect(baseElement).toHaveTextContent(
      'Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized -h : human readable https://test.com pacman search pacman - sudo pacman -Ss package_name'
    )

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    expect(baseElement).toHaveTextContent(
      'pacman search pacman - sudo pacman -Ss package_name Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized -h : human readable https://test.com'
    )

    fireEvent.click(getByTitle('move-note-down'), { button: 1 })

    fireEvent.click(getByTitle('move-note-down'), { button: 1 })

    fireEvent.click(getByTitle('move-note-down'), { button: 1 })

    expect(baseElement).toHaveTextContent(
      'Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized pacman search pacman - sudo pacman -Ss package_name -h : human readable https://test.com'
    )
  })

  it('enables move mode when double clicking on an item and selecting the move option', async () => {
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default

    const { getByText, getByTitle, container, baseElement } = render(
      <Provider initState={initState}>
        <App />
      </Provider>
    )

    userEvent.dblClick(getByText('Copy a file with a progress bar'), {
      button: 1
    })

    fireEvent.click(getByText('Move'), { button: 1 })

    expect(getByTitle('move-note-up')).toBeDefined()

    expect(getByTitle('move-note-down')).toBeDefined()
  })

  it('cycles over todo options when double clicking on an item and selecting the cycle TODO option', async () => {
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default

    const { getByText, queryByText, container, baseElement } = render(
      <Provider initState={initState}>
        <App />
      </Provider>
    )

    userEvent.dblClick(getByText('rsync'), {
      button: 1
    })

    fireEvent.click(getByText('Cycle TODO'), { button: 1 })

    expect(getByText('TODO')).toBeDefined()

    userEvent.dblClick(getByText('rsync'), {
      button: 1
    })

    fireEvent.click(getByText('Cycle TODO'), { button: 1 })

    expect(getByText('DONE')).toBeDefined()

    userEvent.dblClick(getByText('rsync'), {
      button: 1
    })

    fireEvent.click(getByText('Cycle TODO'), { button: 1 })

    expect(queryByText('TODO')).toEqual(null)
    expect(queryByText('DONE')).toEqual(null)
  })

  it('clicking on the check icon in move mode saves the changes', async () => {
    const mockFileHelpers = require('../../src/utils/file-helpers')
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default

    const { getByText, getByTitle, container, baseElement } = render(
      <Provider initState={initState}>
        <App />
      </Provider>
    )

    fireEvent.click(getByTitle('options-menu'), { button: 1 })

    fireEvent.click(getByText('Move Items'), { button: 1 })

    expect(getByTitle('move-note-up')).toBeDefined()

    expect(getByTitle('move-note-down')).toBeDefined()

    fireEvent.click(getByText('pacman'), { button: 1 })

    expect(container).toMatchSnapshot()

    expect(baseElement).toHaveTextContent(
      'Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized -h : human readable https://test.com pacman search pacman - sudo pacman -Ss package_name'
    )

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-mode-save'), { button: 1 })

    expect(mockFileHelpers.saveChanges).toHaveBeenCalledWith({
      newText:
        '\n** pacman\nsearch pacman\n- sudo pacman -Ss package_name\n\n* Great Unix Tools\n** rsync\nCopy a file with a progress bar\nsudo rsync --info=progress2 source dest\n** du - disk usage\ndu -sh file_path\n-s : summarized\n-h : human readable https://test.com',
      selectedRow: 'test1'
    })

    expect(baseElement).toHaveTextContent(
      'pacman search pacman - sudo pacman -Ss package_name Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized -h : human readable https://test.com'
    )
  })

  it('clicking on the x icon in move mode restores the text to the previous state', async () => {
    const mockFileHelpers = require('../../src/utils/file-helpers')
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default

    const { getByText, getByTitle, container, baseElement } = render(
      <Provider initState={initState}>
        <App />
      </Provider>
    )

    fireEvent.click(getByTitle('options-menu'), { button: 1 })

    fireEvent.click(getByText('Move Items'), { button: 1 })

    expect(getByTitle('move-note-up')).toBeDefined()

    expect(getByTitle('move-note-down')).toBeDefined()

    fireEvent.click(getByText('rsync'), { button: 1 })

    expect(baseElement).toHaveTextContent(
      'Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized -h : human readable https://test.com pacman search pacman - sudo pacman -Ss package_name'
    )

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-mode-cancel'), { button: 1 })

    await waitForElement(() => getByTitle('Add'))

    expect(container).toMatchSnapshot()

    expect(baseElement).toHaveTextContent(
      'Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized -h : human readable https://test.com pacman search pacman - sudo pacman -Ss package_name'
    )
  })
})
