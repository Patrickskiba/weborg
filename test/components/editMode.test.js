import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
  prettyDOM,
  waitForElement
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import userEvent from 'user-event'

jest.mock('idb-keyval', () => ({
  keys: () => Promise.resolve([]),
  set: () => {}
}))

jest.mock('dropbox')

jest.mock('../../src/utils/dropbox-files')

jest.mock('../../src/components/LongPress', () => ({ short, children }) => (
  <div onClick={() => short()}>{children}</div>
))

describe('editMode tests', () => {
  afterEach(cleanup)

  it('renders 3 editiable fields', async () => {
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { getByLabelText, getByText, container } = render(
      <Provider>
        <App />
      </Provider>
    )

    const editNode = getByText('Click on a headline to edit it')

    userEvent.dblClick(editNode, { button: 1 })

    const editItem = await waitForElement(() => getByText('Edit'))

    userEvent.click(editItem)

    const level = getByLabelText('Level')
    const headline = getByLabelText('Headline')
    const content = getByLabelText('Content')

    expect(level.value).toEqual('1')

    expect(headline.value).toEqual('Click on a headline to edit it')

    expect(content.value).toEqual('')

    expect(container).toMatchSnapshot()
  })

  it('changes are saved and are reflected on the view screen', async () => {
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { getByLabelText, getByText, getByTitle, container } = render(
      <Provider>
        <App />
      </Provider>
    )

    const editNode = getByText('Click on a headline to edit it')

    userEvent.dblClick(editNode, { button: 1 })

    const editItem = await waitForElement(() => getByText('Edit'))

    userEvent.click(editItem)

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

  it('displays a delete option and deletes the note from the file', async () => {
    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { getByTitle, getByText, baseElement } = render(
      <Provider>
        <App />
      </Provider>
    )

    const editNode = getByText(
      'To delete a note go to the edit screen and click the options icon in the upper right corner'
    )

    userEvent.dblClick(editNode, { button: 1 })

    const editItem = await waitForElement(() => getByText('Edit'))

    userEvent.click(editItem)

    const menu = getByTitle('SettingsIcon')

    userEvent.click(menu, { button: 1 })

    const deleteBtn = getByText('Delete Item')

    userEvent.click(deleteBtn, { button: 1 })

    const deleteConfirm = getByText('Delete')
    userEvent.click(deleteConfirm, { button: 1 })

    expect(baseElement).toHaveTextContent('Click on a headline to edit it')
    expect(baseElement).toHaveTextContent('This is a headline note')
    expect(baseElement).not.toHaveTextContent(
      'To delete a note go to the edit screen and click the options icon in the upper right corner'
    )
  })

  it('it should display a prepopulated field if there is a dateTime for that node', async () => {
    const text = [
      '* this is a test',
      'some context',
      '** level two headline',
      'DEADLINE: <2019-07-14 11:25:AM>',
      'context beneth'
    ].join('\n')

    const { StoreProvider: Provider } = require('../../src/components/Store')

    const App = require('../../src/components/App').default
    const { getByText, getByLabelText } = render(
      <Provider text={text}>
        <App />
      </Provider>
    )

    userEvent.dblClick(getByText('level two headline'))

    const editItem = await waitForElement(() => getByText('Edit'))

    userEvent.click(editItem)

    const deadline = await waitForElement(() => getByLabelText('DEADLINE'))

    expect(deadline.value).toEqual('2019-07-14 Sun 11:25:AM')
  })

  it('it should display a prepopulated field if there is a dateTime deadline for that node', async () => {
    const text = [
      '* this is a test',
      'some context',
      '** level two headline',
      'DEADLINE: <2019-07-14 11:25:AM>',
      'context beneth'
    ].join('\n')

    const { StoreProvider: Provider } = require('../../src/components/Store')

    const App = require('../../src/components/App').default
    const { getByText, getByLabelText } = render(
      <Provider text={text}>
        <App />
      </Provider>
    )

    userEvent.dblClick(getByText('level two headline'))

    const editItem = await waitForElement(() => getByText('Edit'))

    userEvent.click(editItem)

    const deadline = await waitForElement(() => getByLabelText('DEADLINE'))

    expect(deadline.value).toEqual('2019-07-14 Sun 11:25:AM')
  })
})
