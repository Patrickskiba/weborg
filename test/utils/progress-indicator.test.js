import { testCase1, testCase2, testCase3 } from './progress-indicator-data'
import { toggleCheckbox, findCheckboxes } from '../../src/utils/progress-indicator-helpers'

jest.mock('../../src/utils/file-helpers')

describe('progress indicator tests', () => {
  it('looks for checkboxes and determines a 2/4 progress ratio', () => {
    const checkbox = '[ ]'
    const lineNumber = 15
    const selectedRow = 'todo.org'

    const { fileText, parentNode } = testCase1

    const dispatch = jest.fn()

    toggleCheckbox({ checkbox, lineNumber, fileText, parentNode, selectedRow, dispatch })

    const expectedText = `* Todos 
** Completed
*** DONE Mturk
http://146.66.103.39/~expandy5/mturk101.html
*** DONE Emacs mode specific key bindings
- Org mode
  - [X] toggle todo state
  - [X] toggle checkbox
  - [X] create checkbox
  - [ ] create timestamp
- JS mode [3/5]
  - [X] go to definition
  - [X] find references
  hello
  nice
  - [X] rename symbol
  - [ ] documentation at point
  - [ ] refactor
** Not Completed
*** TODO Download all of Talebs books and audiobooks
*** TODO Read the Unix programming environment
*** TODO Prepare emacs to replace stackedit
*** TODO Webworker for tasks including reset Welcome to Weborg page
*** TODO get erin on schwab account
*** TODO Amp image fallback
*** TODO Rss on phone
*** TODO Take a look at iterators for efficient array maths`

    expect(dispatch.mock.calls[0][0].payload).toEqual(expectedText)
  })

  it('looks for checkboxes and determines that a checkbox has subcheckboxes which arent checked', () => {
    const checkbox = '[ ]'
    const lineNumber = 14
    const selectedRow = 'todo.org'

    const { fileText, parentNode } = testCase2

    const dispatch = jest.fn()

    toggleCheckbox({ checkbox, lineNumber, fileText, parentNode, selectedRow, dispatch })

    const expectedText = `* Todos 
** Completed
*** DONE Mturk
http://146.66.103.39/~expandy5/mturk101.html
*** DONE Emacs mode specific key bindings [4/4]
- Org mode
  - [X] toggle todo state
  - [X] toggle checkbox
  - [X] create checkbox
  - [X] create timestamp
- JS mode [2/3]
  - [X] go to definition
  - [X] find references
  - [-] rename symbol
    - [X] documentation at point
    - [ ] refactor
** Not Completed
*** TODO Download all of Talebs books and audiobooks
*** TODO Read the Unix programming environment
*** TODO Prepare emacs to replace stackedit
*** TODO Webworker for tasks including reset Welcome to Weborg page
*** TODO get erin on schwab account
*** TODO Amp image fallback
*** TODO Rss on phone
*** TODO Take a look at iterators for efficient array maths`

    expect(dispatch.mock.calls[0][0].payload).toEqual(expectedText)
  })

  it('looks for all checkboxes and places them in a hierarchical array', () => {
    const { parentNode } = testCase2
    const result = findCheckboxes(parentNode, 14)

    expect(result).toEqual([
      { oldText: '[ ]', newText: '[X]', index: 14 },
      { oldText: '[ ]', newText: '[-]', index: 13 },
      { oldText: '[2/5]', newText: '[2/3]', index: 10 },
      { oldText: '[/]', newText: '[4/4]', index: 4 }
    ])
  })

  it('percentage does not make very long float numbers', () => {
    const { parentNode } = testCase3
    const result = findCheckboxes(parentNode, 11)

    expect(result).toEqual([
      { oldText: '[X]', newText: '[ ]', index: 11 },
      { oldText: '[%]', newText: '[33%]', index: 10 },
      { oldText: '[/]', newText: '[4/4]', index: 4 }
    ])
  })
})
