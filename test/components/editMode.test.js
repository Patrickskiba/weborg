import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
  waitForElementToBeRemoved,
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
    window.scrollTo = jest.fn()

    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { getByLabelText, getByText, getAllByText, getByRole, container } = render(
      <Provider>
        <App />
      </Provider>
    )

    fireEvent.click(getAllByText('more_vert')[3], { button: 1 })

    fireEvent.click(getByText('Edit'), { button: 1 })

    const level = getByRole('level')
    const headline = getByLabelText('Headline')
    const content = getByLabelText('Content')

    expect(level.textContent).toEqual('1')

    expect(headline.value).toEqual('Click on a headline to edit it')

    expect(content.value).toEqual('')
  })

  it('changes are saved and are reflected on the view screen', async () => {
    window.scrollTo = jest.fn()

    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { getByLabelText, getByText, getAllByText, getByRole, getByTitle, container } = render(
      <Provider>
        <App />
      </Provider>
    )

    fireEvent.click(getAllByText('more_vert')[3], { button: 1 })

    fireEvent.click(getByText('Edit'), { button: 1 })

    const level = getByRole('level')

    fireEvent.click(getAllByText('add')[0])
    fireEvent.click(getAllByText('add')[0])

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
  })

  it('displays a delete option and deletes the note from the file', async () => {
    window.scrollTo = jest.fn()

    const { StoreProvider: Provider } = require('../../src/components/Store')
    const App = require('../../src/components/App').default
    const { getByTitle, getByText, getAllByText, baseElement } = render(
      <Provider>
        <App />
      </Provider>
    )

    const editNode = getByText(
      'To delete a note go to the edit screen and click the options icon in the upper right corner'
    )

    fireEvent.click(getAllByText('more_vert')[4], { button: 1 })

    fireEvent.click(getByText('Delete'), { button: 1 })

    const deleteConfirm = getAllByText('Delete')[1]
    userEvent.click(deleteConfirm, { button: 1 })

    expect(baseElement).toHaveTextContent('Click on a headline to edit it')
    expect(baseElement).toHaveTextContent('This is a headline note')
    expect(baseElement).not.toHaveTextContent(
      'To delete a note go to the edit screen and click the options icon in the upper right corner'
    )
  })

  it('it should display a prepopulated field if there is a dateTime for that node', async () => {
    window.scrollTo = jest.fn()

    const text = [
      '* this is a test',
      'some context',
      '** level two headline',
      'DEADLINE: <2019-07-14 11:25:AM>',
      'context beneth'
    ].join('\n')

    const { StoreProvider: Provider } = require('../../src/components/Store')

    const App = require('../../src/components/App').default
    const { getByText, getAllByText, getByLabelText } = render(
      <Provider text={text}>
        <App />
      </Provider>
    )

    fireEvent.click(getAllByText('more_vert')[0], { button: 1 })

    fireEvent.click(getByText('Edit'), { button: 1 })

    const deadline = await waitForElement(() => getByLabelText('DEADLINE'))

    expect(deadline.value).toEqual('2019-07-14 Sun 11:25:AM')
  })

  it('should all the deadline to be edited and saved', async () => {
    window.scrollTo = jest.fn()

    const text = [
      '* this is a test',
      'some context',
      '** level two headline',
      'DEADLINE: <2019-07-14 11:25:AM>',
      'context beneth'
    ].join('\n')

    const { StoreProvider: Provider } = require('../../src/components/Store')

    const App = require('../../src/components/App').default
    const {
      getByText,
      getByLabelText,
      getByDisplayValue,
      getByTitle,
      queryByText,
      getAllByText
    } = render(
      <Provider text={text}>
        <App />
      </Provider>
    )

    fireEvent.click(getAllByText('more_vert')[0], { button: 1 })

    fireEvent.click(getByText('Edit'), { button: 1 })

    const deadline = await waitForElement(() => getByLabelText('DEADLINE'))

    expect(deadline.value).toEqual('2019-07-14 Sun 11:25:AM')

    userEvent.click(deadline)

    await waitForElement(() => getByText('CLEAR'))

    fireEvent.change(getByDisplayValue('2019-07-14'), {
      target: { value: '2019-09-02' }
    })

    userEvent.click(getByText('Submit'))

    await waitForElementToBeRemoved(() => queryByText('Submit'))

    userEvent.click(deadline)

    await waitForElement(() => getByText('CLEAR'))

    fireEvent.change(getByDisplayValue('11:25'), {
      target: { value: '23:00' }
    })

    userEvent.click(getByText('Submit'))

    await waitForElementToBeRemoved(() => queryByText('Submit'))

    expect(deadline.value).toEqual('2019-09-02 Mon 11:00:PM')

    const save = getByTitle('save')

    fireEvent.click(save, { button: 1 })

    await waitForElement(() => getByText('this is a test'))

    expect(getByText('DEADLINE:')).toBeDefined()
    expect(getByText('<2019-09-02 Mon 11:00:PM>')).toBeDefined()
  })
})
