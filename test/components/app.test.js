import React from 'react'
import { render, cleanup, fireEvent, waitForElement, getByText } from 'react-testing-library'
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

    const { getByText, getAllByTestId } = render(
      <Provider initState={initState}>
        <App />
      </Provider>
    )

    const headlines = getAllByTestId('headline')

    expect(headlines[0]).toHaveTextContent(
      'chevron_right Great Unix Toolschevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vertchevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vertchevron_right pacman search pacman- sudo pacman -Ss package_name more_vertmore_vert'
    )
    expect(headlines[1]).toHaveTextContent(
      'chevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vert'
    )
    expect(headlines[2]).toHaveTextContent(
      'chevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vert'
    )
    expect(headlines[3]).toHaveTextContent(
      'chevron_right pacman search pacman- sudo pacman -Ss package_name more_vert'
    )

    fireEvent.click(getByText('Great Unix Tools'), { button: 1 })

    const condensedHeadlines = getAllByTestId('headline')

    expect(condensedHeadlines[0].textContent).toEqual('expand_more Great Unix Tools...more_vert')

    fireEvent.click(getByText('Great Unix Tools'), { button: 1 })

    const uncondensedHeadlines = getAllByTestId('headline')

    expect(uncondensedHeadlines[0]).toHaveTextContent(
      'chevron_right Great Unix Toolschevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vertchevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vertchevron_right pacman search pacman- sudo pacman -Ss package_name more_vertmore_vert'
    )
    expect(uncondensedHeadlines[1]).toHaveTextContent(
      'chevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vert'
    )
    expect(uncondensedHeadlines[2]).toHaveTextContent(
      'chevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vert'
    )
    expect(uncondensedHeadlines[3]).toHaveTextContent(
      'chevron_right pacman search pacman- sudo pacman -Ss package_name more_vert'
    )
  })

  it('enables move mode when clicking on the move item option', async () => {
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default

    const { getByText, getAllByText, getByTitle, getAllByTestId, baseElement } = render(
      <Provider initState={initState}>
        <App />
      </Provider>
    )

    const Headlines = getAllByTestId('headline')

    expect(Headlines[0].textContent).toEqual(
      'chevron_right Great Unix Toolschevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vertchevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vertchevron_right pacman search pacman- sudo pacman -Ss package_name more_vertmore_vert'
    )
    expect(Headlines[1].textContent).toEqual(
      'chevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vert'
    )
    expect(Headlines[2].textContent).toEqual(
      'chevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vert'
    )
    expect(Headlines[3].textContent).toEqual(
      'chevron_right pacman search pacman- sudo pacman -Ss package_name more_vert'
    )

    fireEvent.click(getAllByText('more_vert')[2], { button: 1 })

    fireEvent.click(getByText('Move'), { button: 1 })

    expect(getByTitle('move-note-up')).toBeDefined()

    expect(getByTitle('move-note-down')).toBeDefined()

    const UnMovedHeadlines = getAllByTestId('headline')

    expect(UnMovedHeadlines[0].textContent).toEqual(
      'chevron_right Great Unix Toolschevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vertchevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vertchevron_right pacman search pacman- sudo pacman -Ss package_name more_vertmore_vert'
    )
    expect(UnMovedHeadlines[1].textContent).toEqual(
      'chevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vert'
    )
    expect(UnMovedHeadlines[2].textContent).toEqual(
      'chevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vert'
    )
    expect(UnMovedHeadlines[3].textContent).toEqual(
      'chevron_right pacman search pacman- sudo pacman -Ss package_name more_vert'
    )

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    const MovedHeadlines = getAllByTestId('headline')

    expect(MovedHeadlines[0].textContent).toEqual(
      'chevron_right Great Unix Toolschevron_right pacman search pacman- sudo pacman -Ss package_name more_vertchevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vertchevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vertmore_vert'
    )

    expect(MovedHeadlines[1].textContent).toEqual(
      'chevron_right pacman search pacman- sudo pacman -Ss package_name more_vert'
    )

    fireEvent.click(getByTitle('move-note-down'), { button: 1 })

    fireEvent.click(getByTitle('move-note-down'), { button: 1 })

    fireEvent.click(getByTitle('move-note-down'), { button: 1 })

    const HeadlinesBackToNormal = getAllByTestId('headline')

    expect(HeadlinesBackToNormal[0].textContent).toEqual(
      'chevron_right Great Unix Toolschevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vertchevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vertchevron_right pacman search pacman- sudo pacman -Ss package_name more_vertmore_vert'
    )
    expect(HeadlinesBackToNormal[1].textContent).toEqual(
      'chevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vert'
    )
    expect(HeadlinesBackToNormal[2].textContent).toEqual(
      'chevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vert'
    )
    expect(HeadlinesBackToNormal[3].textContent).toEqual(
      'chevron_right pacman search pacman- sudo pacman -Ss package_name more_vert'
    )
  })

  it('cycles over todo options when double clicking on an item and selecting the cycle TODO option', async () => {
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default

    const { getByText, queryByText, getAllByText, getAllByTestId } = render(
      <Provider initState={initState}>
        <App />
      </Provider>
    )

    expect(getByText('rsync')).toBeDefined()

    fireEvent.click(getAllByText('more_vert')[0], { button: 1 })

    fireEvent.click(getByText('Cycle TODO'), { button: 1 })

    expect(getAllByTestId('headline')[1].textContent).toEqual(
      'chevron_right TODO  rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vert'
    )

    fireEvent.click(getAllByText('more_vert')[0], { button: 1 })

    fireEvent.click(getByText('Cycle TODO'), { button: 1 })

    expect(getAllByTestId('headline')[1].textContent).toEqual(
      'chevron_right DONE  rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vert'
    )

    fireEvent.click(getAllByText('more_vert')[0], { button: 1 })

    fireEvent.click(getByText('Cycle TODO'), { button: 1 })

    expect(getAllByTestId('headline')[1].textContent).toEqual(
      'chevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vert'
    )
  })

  it('clicking on the check icon in move mode saves the changes', async () => {
    const mockFileHelpers = require('../../src/utils/file-helpers')
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default

    const { getByText, getAllByText, getByTitle, getAllByTitle, baseElement } = render(
      <Provider initState={initState}>
        <App />
      </Provider>
    )

    fireEvent.click(getAllByText('more_vert')[2], { button: 1 })

    fireEvent.click(getByText('Move'), { button: 1 })

    expect(getByTitle('move-note-up')).toBeDefined()

    expect(getByTitle('move-note-down')).toBeDefined()

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getAllByTitle('move-mode-save')[0], { button: 1 })

    expect(mockFileHelpers.saveChanges).toHaveBeenCalledWith({
      newText:
        '\n** pacman\nsearch pacman\n- sudo pacman -Ss package_name\n\n* Great Unix Tools\n** rsync\nCopy a file with a progress bar\nsudo rsync --info=progress2 source dest\n** du - disk usage\ndu -sh file_path\n-s : summarized\n-h : human readable https://test.com',
      selectedRow: 'test1'
    })

    expect(baseElement).toHaveTextContent(
      'chevron_right pacman search pacman- sudo pacman -Ss package_name more_vertchevron_right Great Unix Toolschevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vertchevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vertmore_vertaddmenucalendar_todaysettingstest1Link To DropboxMove Items'
    )
  })

  it('clicking on the x icon in move mode restores the text to the previous state', async () => {
    const mockFileHelpers = require('../../src/utils/file-helpers')
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default

    const { getByText, getAllByText, getByTitle, getAllByTitle, container, baseElement } = render(
      <Provider initState={initState}>
        <App />
      </Provider>
    )

    expect(baseElement).toHaveTextContent(
      'chevron_right Great Unix Toolschevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vertchevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vertchevron_right pacman search pacman- sudo pacman -Ss package_name more_vertmore_vertaddmenucalendar_todaysettingstest1Link To DropboxMove Items'
    )

    fireEvent.click(getAllByText('more_vert')[2], { button: 1 })

    fireEvent.click(getByText('Move'), { button: 1 })

    expect(getByTitle('move-note-up')).toBeDefined()

    expect(getByTitle('move-note-down')).toBeDefined()

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getAllByTitle('move-mode-cancel')[0], { button: 1 })

    await waitForElement(() => getByTitle('Add'))

    expect(baseElement).toHaveTextContent(
      'chevron_right Great Unix Toolschevron_right rsync Copy a file with a progress bar sudo rsync --info=progress2 source destmore_vertchevron_right du - disk usage du -sh file_path- s : summarized- h : human readablehttps://test.com more_vertchevron_right pacman search pacman- sudo pacman -Ss package_name more_vertmore_vertaddmenucalendar_todaysettingstest1Link To DropboxMove Items'
    )
  })
})
