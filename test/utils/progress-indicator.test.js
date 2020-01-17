import { testCase1, testCase2 } from './progress-indicator-data'
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

  it.skip('looks for checkboxes and determines that a checkbox has subcheckboxes which arent checked', () => {
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
*** DONE Emacs mode specific key bindings
- Org mode
  - [X] toggle todo state
  - [X] toggle checkbox
  - [X] create checkbox
  - [X] create timestamp
- JS mode [2/5]
  - [X] go to definition
  - [X] find references
  - [-] rename symbol
    - [X] documentation at point
    - [ ] refactor
*** DONE Write a blog post on Ledger
*** DONE Start new ledger
*** DONE Fix datetime width
*** DONE Clearing date time doesn't work
*** DONE Post workout mturk
*** DONE Lunchtime mturk
*** DONE Outline next blog post
*** DONE Set out chicken for defrost at lunchtime
*** DONE Better alphabetize file explorer
*** DONE Agenda horizontal overflow scroll appearing
*** DONE Add and Edit note should always scroll to top of window
*** DONE Agenda repeater
*** DONE Watch videos on https://emacsconf.org/2019/videos
*** DONE Agenda Todo cycle forwarder
*** DONE setup smb connection with network drive
** Not Completed
*** TODO Download all of Talebs books and audiobooks
*** TODO Read the Unix programming environment
*** TODO Prepare emacs to replace stackedit
*** TODO Webworker for tasks including reset Welcome to Weborg page
*** TODO Amp image fallback`

    expect(dispatch.mock.calls[0][0].payload).toEqual(expectedText)
  })

  it('looks for all checkboxes and places them in a hierarchical array', () => {
    const { parentNode } = testCase2
    const result = findCheckboxes(parentNode)

    expect(result.length).toEqual(1)

    expect(result[0].children.length).toEqual(5)

    expect(result[0].children[0].children).toEqual(undefined)
    expect(result[0].children[1].children).toEqual(undefined)
    expect(result[0].children[2].children).toEqual(undefined)
    expect(result[0].children[3].children).toEqual(undefined)
    expect(result[0].children[4].children.length).toEqual(3)

    expect(result[0].children[4].children[0].children).toEqual(undefined)
    expect(result[0].children[4].children[1].children).toEqual(undefined)
    expect(result[0].children[4].children[2].children.length).toEqual(2)

    expect(result).toEqual([
      {
        children: [
          { index: 6, text: '[X]', type: 'checkbox', whitespace: 2 },
          { index: 7, text: '[X]', type: 'checkbox', whitespace: 2 },
          { index: 8, text: '[X]', type: 'checkbox', whitespace: 2 },
          { index: 9, text: '[X]', type: 'checkbox', whitespace: 2 },
          {
            children: [
              { index: 11, text: '[X]', type: 'checkbox', whitespace: 2 },
              { index: 12, text: '[X]', type: 'checkbox', whitespace: 2 },
              {
                children: [
                  { index: 14, text: '[ ]', type: 'checkbox', whitespace: 4 },
                  { index: 15, text: '[ ]', type: 'checkbox', whitespace: 4 }
                ],
                index: 13,
                text: '[ ]',
                type: 'checkbox',
                whitespace: 2
              }
            ],
            text: '[2/5]',
            type: 'progress',
            whitespace: 0
          }
        ],
        index: 4,
        text: '[/]',
        type: 'progress',
        whitespace: -1
      }
    ])
  })
})
