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

jest.mock('idb-keyval', () => ({
  keys: () => Promise.resolve([]),
  set: () => {},
}))

jest.mock('dropbox')

jest.mock('../../src/utils/dropbox-files')

describe('editMode tests', () => {
  afterEach(cleanup)

  it('renders 3 editiable fields', () => {
    const App = require('../../src/components/App').default
    const { getByLabelText, getByText, container } = render(<App />)

    const editNode = getByText('Click on a headline to edit it')

    fireEvent.click(editNode, { button: 1 })

    const level = getByLabelText('Level')
    const headline = getByLabelText('Headline')
    const content = getByLabelText('Content')

    expect(level.value).toEqual('1')

    expect(headline.value).toEqual('Click on a headline to edit it')

    expect(content.value).toEqual('')

    expect(container).toMatchSnapshot()
  })

  it('changes are saved and are reflected on the view screen', async () => {
    const App = require('../../src/components/App').default
    const { getByLabelText, getByText, getByTitle, container } = render(<App />)

    const editNode = getByText('Click on a headline to edit it')

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
    const { getByTitle, container, baseElement, getByText } = render(<App />)

    const beforeHTML = prettyDOM(baseElement)

    const editNode = getByText('Click on a headline to edit it')

    fireEvent.click(editNode, { button: 1 })

    const save = getByTitle('save')

    fireEvent.click(save, { button: 1 })

    await waitForElement(() => getByText('Click on a headline to edit it'))

    expect(container).toMatchSnapshot()

    const afterHTML = prettyDOM(baseElement)

    expect(beforeHTML).toEqual(afterHTML)
  })

  it.only('displays a delete option and deletes the note from the file', async () => {
    const App = require('../../src/components/App').default
    const { debug, getByTitle, getAllByText, getByText, baseElement } = render(
      <App />
    )

    const editNode = getByText(
      'To delete a note go to the edit screen and click the options icon in the upper right corner'
    )

    fireEvent.click(editNode, { button: 1 })

    const menu = getByTitle('SettingsIcon')

    fireEvent.click(menu, { button: 1 })

    const deleteBtn = getByText('Delete Item')

    fireEvent.click(deleteBtn, { button: 1 })

    const deleteConfirm = getByText('Delete')
    fireEvent.click(deleteConfirm, { button: 1 })

    expect(baseElement).toHaveTextContent('Click on a headline to edit it')
    expect(baseElement).toHaveTextContent('This is a headline note')
    expect(baseElement).not.toHaveTextContent(
      'To delete a note go to the edit screen and click the options icon in the upper right corner'
    )
  })
})
