import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
  prettyDOM,
} from 'react-testing-library'
import userEvent from 'user-event'
import 'jest-dom/extend-expect'

jest.mock('idb-keyval')

jest.mock('dropbox')

jest.mock('../../src/utils/dropbox-files')

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

describe('editMode tests', () => {
  afterEach(cleanup)

  it('renders 3 editiable fields', () => {
    const App = require('../../src/components/App').default
    const { getByLabelText, getByText, container } = render(<App />)

    const editNode = getByText('rsync')

    fireEvent.click(editNode, { button: 1 })

    const level = getByLabelText('Level')
    const headline = getByLabelText('Headline')
    const content = getByLabelText('Content')

    expect(level.value).toEqual('2')

    expect(headline.value).toEqual('rsync')

    expect(content.value).toEqual(
      'Copy a file with a progress bar\nsudo rsync --info=progress2 source dest'
    )

    expect(container).toMatchSnapshot()
  })

  it('changes are saved and are reflected on the view screen', async () => {
    const App = require('../../src/components/App').default
    const { getByLabelText, getByText, getByTitle, container } = render(<App />)

    const editNode = getByText('rsync')

    fireEvent.click(editNode, { button: 1 })

    const level = getByLabelText('Level')
    userEvent.type(level, '3')

    const headline = getByLabelText('Headline')
    userEvent.type(headline, 'new headline')

    const content = getByLabelText('Content')
    userEvent.type(content, 'new content\nwith new line')

    const save = getByTitle('save')

    fireEvent.click(save, { button: 1 })

    await waitForElement(() => getByText('new headline'))

    expect(getByText('new headline')).toBeDefined()
    expect(getByText('new content')).toBeDefined()
    expect(getByText('with new line')).toBeDefined()

    expect(container).toMatchSnapshot()
  })

  it('clicking save button does not change original text when making no change', async () => {
    const App = require('../../src/components/App').default
    const { getByTitle, container, baseElement } = render(<App />)

    const beforeHTML = prettyDOM(baseElement)

    const editNode = getByText('rsync')

    fireEvent.click(editNode, { button: 1 })

    const save = getByTitle('save')

    fireEvent.click(save, { button: 1 })

    await waitForElement(() => getByText('rsync'))

    expect(container).toMatchSnapshot()

    const afterHTML = prettyDOM(baseElement)

    expect(beforeHTML).toEqual(afterHTML)
  })
})
