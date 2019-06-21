import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library'
import 'jest-dom/extend-expect'
import jsdom from 'jsdom'

jest.mock('idb-keyval')

jest.mock('dropbox')

jest.mock('../../src/utils/dropbox-files')

jest.mock('../../src/components/FileExplorer', () => ({ setText }) => {
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

  return <div></div>
})

describe('app tests', () => {
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
})
