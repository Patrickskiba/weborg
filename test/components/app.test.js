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

    expect(headlines[0]).toHaveTextContent(
      'This is a headline note Headline notes have bulletpoints at the start of a line Add a new headline by clicking the blue plus button'
    )
    expect(headlines[1]).toHaveTextContent(
      'Headline notes have bulletpoints at the start of a line'
    )
    expect(headlines[2]).toHaveTextContent(
      'Add a new headline by clicking the blue plus button'
    )
    expect(headlines[3]).toHaveTextContent('Click on a headline to edit it')

    fireEvent.click(getAllByTitle('dash-collapse')[0], { button: 1 })
    fireEvent.click(getAllByTitle('dash-collapse')[1], { button: 1 })

    const condensedHeadlines = getAllByTestId('headline')

    expect(condensedHeadlines[0]).toHaveTextContent('This is a headline note')
    expect(condensedHeadlines[1]).toHaveTextContent(
      'Click on a headline to edit it'
    )
    expect(condensedHeadlines[2]).toHaveTextContent(
      'To delete a note go to the edit screen and click the options icon in the upper right corner'
    )
    expect(condensedHeadlines[3]).toHaveTextContent(
      "A headline's level determines its parent and children"
    )

    expect(container).toMatchSnapshot()

    fireEvent.click(getAllByTitle('plus-expand')[0], { button: 1 })
    fireEvent.click(getAllByTitle('plus-expand')[0], { button: 1 })

    const uncondensedHeadlines = getAllByTestId('headline')

    expect(headlines[0]).toHaveTextContent(
      'This is a headline note Headline notes have bulletpoints at the start of a line Add a new headline by clicking the blue plus button'
    )
    expect(headlines[1]).toHaveTextContent(
      'Headline notes have bulletpoints at the start of a line'
    )
    expect(headlines[2]).toHaveTextContent(
      'Add a new headline by clicking the blue plus button'
    )
    expect(headlines[3]).toHaveTextContent('Click on a headline to edit it')
  })

  it('enables move mode when clicking on the move item option', async () => {
    const App = require('../../src/components/App').default

    const { getByText, getByTitle, container, baseElement } = render(<App />)

    fireEvent.click(getByTitle('options-menu'), { button: 1 })

    fireEvent.click(getByText('Move Items'), { button: 1 })

    expect(getByTitle('move-note-up')).toBeDefined()

    expect(getByTitle('move-note-down')).toBeDefined()

    fireEvent.click(getByText('Click on a headline to edit it'), { button: 1 })

    expect(container).toMatchSnapshot()

    expect(baseElement).toHaveTextContent(
      "This is a headline note Headline notes have bulletpoints at the start of a line Add a new headline by clicking the blue plus button Click on a headline to edit it To delete a note go to the edit screen and click the options icon in the upper right corner A headline's level determines its parent and children This is a child of the headline above it Click on the dash on the right to collapse a headline's children Notes don't have to be headlines They can also be content - Content text is grey - Context text cannot have children You can sync your changes with an existing Dropbox account by clicking the options icon Want to make a list of tasks? TODO Mark a headline with TODO Add some details about the task below in the content area DONE When you're done you can mark the task done TODO #[A] Have a lot of todo tasks? Give them a priority TODO #[B] This task is less important than the one above TODO #[C] Priority integrates with Agenda mode, a feature that will be coming soon Does Web-org support bold, underline, italic, and strikethrough text? Yes, yes it does - wrap text with * for bold - wrap text with _ for underline - wrap text with / for italic - wrap text with + for strikethrough"
    )

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    expect(baseElement).toHaveTextContent(
      "Click on a headline to edit it This is a headline note Headline notes have bulletpoints at the start of a line Add a new headline by clicking the blue plus button To delete a note go to the edit screen and click the options icon in the upper right corner A headline's level determines its parent and children This is a child of the headline above it Click on the dash on the right to collapse a headline's children Notes don't have to be headlines They can also be content - Content text is grey - Context text cannot have children You can sync your changes with an existing Dropbox account by clicking the options icon Want to make a list of tasks? TODO Mark a headline with TODO Add some details about the task below in the content area DONE When you're done you can mark the task done TODO #[A] Have a lot of todo tasks? Give them a priority TODO #[B] This task is less important than the one above TODO #[C] Priority integrates with Agenda mode, a feature that will be coming soon Does Web-org support bold, underline, italic, and strikethrough text? Yes, yes it does - wrap text with * for bold - wrap text with _ for underline - wrap text with / for italic - wrap text with + for strikethrough"
    )

    fireEvent.click(getByTitle('move-note-down'), { button: 1 })

    fireEvent.click(getByTitle('move-note-down'), { button: 1 })

    fireEvent.click(getByTitle('move-note-down'), { button: 1 })

    expect(baseElement).toHaveTextContent(
      "This is a headline note Headline notes have bulletpoints at the start of a line Add a new headline by clicking the blue plus button Click on a headline to edit it To delete a note go to the edit screen and click the options icon in the upper right corner A headline's level determines its parent and children This is a child of the headline above it Click on the dash on the right to collapse a headline's children Notes don't have to be headlines They can also be content - Content text is grey - Context text cannot have children You can sync your changes with an existing Dropbox account by clicking the options icon Want to make a list of tasks? TODO Mark a headline with TODO Add some details about the task below in the content area DONE When you're done you can mark the task done TODO #[A] Have a lot of todo tasks? Give them a priority TODO #[B] This task is less important than the one above TODO #[C] Priority integrates with Agenda mode, a feature that will be coming soon Does Web-org support bold, underline, italic, and strikethrough text? Yes, yes it does - wrap text with * for bold - wrap text with _ for underline - wrap text with / for italic - wrap text with + for strikethrough"
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

    fireEvent.click(getByText('Click on a headline to edit it'), { button: 1 })

    expect(container).toMatchSnapshot()

    expect(baseElement).toHaveTextContent(
      'This is a headline note Headline notes have bulletpoints at the start of a line Add a new headline by clicking the blue plus button'
    )

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-mode-save'), { button: 1 })

    expect(mockFileHelpers.saveChanges).toHaveBeenCalledWith({
      newText:
        "* Click on a headline to edit it\n* This is a headline note\n** Headline notes have bulletpoints at the start of a line\n** Add a new headline by clicking the blue plus button\n* To delete a note go to the edit screen and click the options icon in the upper right corner\n* A headline's level determines its parent and children\n*** This is a child of the headline above it\n*** Click on the dash on the right to collapse a headline's children\n** Notes don't have to be headlines\nThey can also be content\n- Content text is grey\n- Context text cannot have children\n** You can sync your changes with an existing Dropbox account by clicking the options icon \n* Want to make a list of tasks?\n** TODO Mark a headline with TODO\nAdd some details about the task below in the content area\n** DONE When you're done you can mark the task done\n** TODO [#A] Have a lot of todo tasks? Give them a priority\n** TODO [#B] This task is less important than the one above\n** TODO [#C] Priority integrates with Agenda mode, a feature that will be coming soon\n* Does Web-org support *bold,* _underline,_ /italic,/ and +strikethrough text?+\nYes, yes it does\n- wrap text with * for bold\n- wrap text with _ for underline\n- wrap text with / for italic\n- wrap text with + for strikethrough\n  ",
      selectedRow: 'Welcome to Weborg.org',
    })

    expect(baseElement).toHaveTextContent(
      "Click on a headline to edit it This is a headline note Headline notes have bulletpoints at the start of a line Add a new headline by clicking the blue plus button To delete a note go to the edit screen and click the options icon in the upper right corner A headline's level determines its parent and children This is a child of the headline above it Click on the dash on the right to collapse a headline's children Notes don't have to be headlines They can also be content - Content text is grey - Context text cannot have children You can sync your changes with an existing Dropbox account by clicking the options icon Want to make a list of tasks? TODO Mark a headline with TODO Add some details about the task below in the content area DONE When you're done you can mark the task done TODO #[A] Have a lot of todo tasks? Give them a priority TODO #[B] This task is less important than the one above TODO #[C] Priority integrates with Agenda mode, a feature that will be coming soon Does Web-org support bold, underline, italic, and strikethrough text? Yes, yes it does - wrap text with * for bold - wrap text with _ for underline - wrap text with / for italic - wrap text with + for strikethrough"
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

    fireEvent.click(getByText('Click on a headline to edit it'), { button: 1 })

    expect(baseElement).toHaveTextContent(
      'This is a headline note Headline notes have bulletpoints at the start of a line Add a new headline by clicking the blue plus button'
    )

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-note-up'), { button: 1 })

    fireEvent.click(getByTitle('move-mode-cancel'), { button: 1 })

    await waitForElement(() => getByTitle('Add'))

    expect(container).toMatchSnapshot()

    expect(mockFileHelpers.saveChanges).toHaveBeenCalledWith({
      newText:
        "* Click on a headline to edit it\n* This is a headline note\n** Headline notes have bulletpoints at the start of a line\n** Add a new headline by clicking the blue plus button\n* To delete a note go to the edit screen and click the options icon in the upper right corner\n* A headline's level determines its parent and children\n*** This is a child of the headline above it\n*** Click on the dash on the right to collapse a headline's children\n** Notes don't have to be headlines\nThey can also be content\n- Content text is grey\n- Context text cannot have children\n** You can sync your changes with an existing Dropbox account by clicking the options icon \n* Want to make a list of tasks?\n** TODO Mark a headline with TODO\nAdd some details about the task below in the content area\n** DONE When you're done you can mark the task done\n** TODO [#A] Have a lot of todo tasks? Give them a priority\n** TODO [#B] This task is less important than the one above\n** TODO [#C] Priority integrates with Agenda mode, a feature that will be coming soon\n* Does Web-org support *bold,* _underline,_ /italic,/ and +strikethrough text?+\nYes, yes it does\n- wrap text with * for bold\n- wrap text with _ for underline\n- wrap text with / for italic\n- wrap text with + for strikethrough\n  ",
      selectedRow: 'Welcome to Weborg.org',
    })
  })
})
