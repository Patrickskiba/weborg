import React from 'react'
import { render, cleanup } from 'react-testing-library'
import jsdom from 'jsdom'


jest.mock('dropbox')

jest.mock('../../src/components/dropbox-files', () => ({setText}) => { 
    const testText = 
`
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
    it('renders the component', () => {
        const mockedDropbox = require('dropbox')
        const mockedDropboxFiles = require('../../src/components/dropbox-files')

        window.location.hash = '#access_token=test'

        const App = require('../../src/components/app').default
        const { getByText, getByTestId, container, asFragment } = render(<App />)
        console.log(getByText('Great Unix Tools'))
    })
})
