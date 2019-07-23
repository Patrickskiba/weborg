import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import jsdom from 'jsdom'

jest.mock('idb-keyval', () => ({
  keys: () => Promise.resolve([]),
  get: () =>
    Promise.resolve(`
* Great Unix Tools
** rsync
Copy a file with a progress bar
sudo rsync --info=progress2 source dest
** du - disk usage
du -sh file_path
-s : summarized
-h : human readable
** pacman
search pacman
- sudo pacman -Ss package_name
`),
  set: () => {},
}))

jest.mock('dropbox')

jest.mock('../../src/utils/dropbox-files')

jest.mock('../../src/utils/file-helpers', () => ({
  saveChanges: jest.fn(),
}))

jest.mock('../../src/components/FileExplorer', () => ({ setText }) => {
  const { useEffect } = require('react')
  useEffect(() => {
    const testText = `
* Great Unix Tools
** rsync
Copy a file with a progress bar
sudo rsync --info=progress2 source dest
** du - disk usage
du -sh file_path
-s : summarized
-h : human readable
** pacman
search pacman
- sudo pacman -Ss package_name
`
    setText(testText)
  }, [])

  return <div></div>
})

describe('app tests', () => {
  afterEach(cleanup)
  it('renders the component with the correct headlines and collapses the topmost headline', async () => {
    const mockedDropbox = require('dropbox')
    const mockedDropboxFiles = require('../../src/utils/dropbox-files')

    window.location.hash = '#access_token=test'

    const App = require('../../src/components/App').default
    const { getAllByText, getAllByTestId, getAllByTitle, container } = render(
      <App />
    )

    const headlines = getAllByTestId('headline')

    expect(headlines[0]).toHaveTextContent('Great Unix Tools')
    expect(headlines[1]).toHaveTextContent(
      'rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest'
    )
    expect(headlines[2]).toHaveTextContent(
      'du - disk usage du -sh file_path -s : summarized -h : human readable'
    )
    expect(headlines[3]).toHaveTextContent(
      'pacman search pacman - sudo pacman -Ss package_name'
    )

    fireEvent.click(getAllByTitle('dash-collapse')[3], { button: 1 })

    const condensedHeadlines = getAllByTestId('headline')

    expect(condensedHeadlines[0]).toHaveTextContent('Great Unix Tools')
    expect(condensedHeadlines[1]).toEqual(undefined)
    expect(condensedHeadlines[2]).toEqual(undefined)
    expect(condensedHeadlines[3]).toEqual(undefined)

    expect(container).toMatchSnapshot()

    fireEvent.click(getAllByTitle('plus-expand')[0], { button: 1 })

    const uncondensedHeadlines = getAllByTestId('headline')

    expect(uncondensedHeadlines[0]).toHaveTextContent('Great Unix Tools')
    expect(uncondensedHeadlines[1]).toHaveTextContent(
      'rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest'
    )
    expect(uncondensedHeadlines[2]).toHaveTextContent(
      'du - disk usage du -sh file_path -s : summarized -h : human readable'
    )
    expect(uncondensedHeadlines[3]).toHaveTextContent(
      'pacman search pacman - sudo pacman -Ss package_name'
    )
  })

  it('enables move mode when clicking on the move item option', async () => {
    const App = require('../../src/components/App').default

    const { getByText, getByTitle, container, baseElement } = render(<App />)

    fireEvent.click(getByTitle('options-menu'), { button: 1 })

    fireEvent.click(getByText('Move Items'), { button: 1 })

    expect(getByTitle('move-note-up')).toBeDefined()

    expect(getByTitle('move-note-down')).toBeDefined()

    fireEvent.click(getByText('du - disk usage'), { button: 1 })

    expect(container).toMatchSnapshot()

    expect(baseElement).toHaveTextContent(
      'Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized -h : human readable pacman search pacman - sudo pacman -Ss package_name'
    )

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    expect(baseElement).toHaveTextContent(
      'Welcome to Weborg.org du - disk usage du -sh file_path -s : summarized -h : human readable Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest pacman search pacman - sudo pacman -Ss package_name Link To Dropbox'
    )

    fireEvent.click(getByTitle('move-note-down'), { button: 1 })

    fireEvent.click(getByTitle('move-note-down'), { button: 1 })

    expect(baseElement).toHaveTextContent(
      'Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized -h : human readable pacman search pacman - sudo pacman -Ss package_name'
    )
  })

  it('clicking on the check icon in move mode saves the changes', async () => {
    const mockFileHelpers = require('../../src/utils/file-helpers')
    const App = require('../../src/components/App').default

    const { getByText, getByTitle, container, baseElement } = render(<App />)

    fireEvent.click(getByTitle('options-menu'), { button: 1 })

    fireEvent.click(getByText('Move Items'), { button: 1 })

    expect(getByTitle('move-note-up')).toBeDefined()

    expect(getByTitle('move-note-down')).toBeDefined()

    fireEvent.click(getByText('du - disk usage'), { button: 1 })

    expect(container).toMatchSnapshot()

    expect(baseElement).toHaveTextContent(
      'Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized -h : human readable pacman search pacman - sudo pacman -Ss package_name'
    )

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-mode-save'), { button: 1 })

    expect(mockFileHelpers.saveChanges).toHaveBeenCalledWith({
      newText:
        '\n** du - disk usage\ndu -sh file_path\n-s : summarized\n-h : human readable\n* Great Unix Tools\n** rsync\nCopy a file with a progress bar\nsudo rsync --info=progress2 source dest\n** pacman\nsearch pacman\n- sudo pacman -Ss package_name\n',
      selectedRow: 'Welcome to Weborg.org',
    })

    expect(baseElement).toHaveTextContent(
      'Welcome to Weborg.org du - disk usage du -sh file_path -s : summarized -h : human readable Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest pacman search pacman - sudo pacman -Ss package_name Link To Dropbox'
    )
  })

  it('clicking on the x icon in move mode restores the text to the previous state', async () => {
    const mockFileHelpers = require('../../src/utils/file-helpers')
    const App = require('../../src/components/App').default

    const { getByText, getByTitle, container, baseElement } = render(<App />)

    fireEvent.click(getByTitle('options-menu'), { button: 1 })

    fireEvent.click(getByText('Move Items'), { button: 1 })

    expect(getByTitle('move-note-up')).toBeDefined()

    expect(getByTitle('move-note-down')).toBeDefined()

    fireEvent.click(getByText('du - disk usage'), { button: 1 })

    expect(container).toMatchSnapshot()

    expect(baseElement).toHaveTextContent(
      'Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized -h : human readable pacman search pacman - sudo pacman -Ss package_name'
    )

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-mode-cancel'), { button: 1 })

    await waitForElement(() => getByTitle('Add'))

    expect(baseElement).toHaveTextContent(
      'Welcome to Weborg.org Great Unix Tools rsync Copy a file with a progress bar sudo rsync --info=progress2 source dest du - disk usage du -sh file_path -s : summarized -h : human readable pacman search pacman - sudo pacman -Ss package_name Link To DropboxMove Items'
    )
  })
})
