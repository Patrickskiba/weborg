export const fileText = `* Todos 
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
  hello nice
  great
  - [ ] rename symbol
  - [ ] documentation at point
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

export const parentNode = {
  type: 'headline',
  index: 4,
  level: 3,
  State: 'DONE',
  content: [{ type: 'text', text: 'Emacs mode specific key bindings' }],
  children: [
    {
      type: 'section',
      content: [
        { type: 'list', text: '-', whitespace: 0, index: 5 },
        { type: 'checkbox', index: 5 },
        { type: 'text', text: 'Org mode' }
      ],
      index: 5
    },
    {
      type: 'section',
      content: [
        { type: 'list', text: '  -', whitespace: 2, index: 6 },
        { type: 'checkbox', text: '[X]', index: 6 },
        { type: 'text', text: 'toggle todo state' }
      ],
      index: 6
    },
    {
      type: 'section',
      content: [
        { type: 'list', text: '  -', whitespace: 2, index: 7 },
        { type: 'checkbox', text: '[X]', index: 7 },
        { type: 'text', text: 'toggle checkbox' }
      ],
      index: 7
    },
    {
      type: 'section',
      content: [
        { type: 'list', text: '  -', whitespace: 2, index: 8 },
        { type: 'checkbox', text: '[X]', index: 8 },
        { type: 'text', text: 'create checkbox' }
      ],
      index: 8
    },
    {
      type: 'section',
      content: [
        { type: 'list', text: '  -', whitespace: 2, index: 9 },
        { type: 'checkbox', text: '[X]', index: 9 },
        { type: 'text', text: 'create timestamp' }
      ],
      index: 9
    },
    {
      type: 'section',
      content: [
        { type: 'list', text: '-', whitespace: 0, index: 10 },
        { type: 'checkbox', index: 10 },
        { type: 'text', text: 'JS mode' },
        { type: 'progress', text: '[2/5]' }
      ],
      index: 10
    },
    {
      type: 'section',
      content: [
        { type: 'list', text: '  -', whitespace: 2, index: 11 },
        { type: 'checkbox', text: '[X]', index: 11 },
        { type: 'text', text: 'go to definition' }
      ],
      index: 11
    },
    {
      type: 'section',
      content: [
        { type: 'list', text: '  -', whitespace: 2, index: 12 },
        { type: 'checkbox', text: '[X]', index: 12 },
        { type: 'text', text: 'find references' }
      ],
      index: 12
    },
    { type: 'section', index: 13, content: [{ type: 'text', text: '  hello nice' }] },
    { type: 'section', index: 14, content: [{ type: 'text', text: '  great' }] },
    {
      type: 'section',
      content: [
        { type: 'list', text: '  -', whitespace: 2, index: 15 },
        { type: 'checkbox', text: '[ ]', index: 15 },
        { type: 'text', text: 'rename symbol' }
      ],
      index: 15
    },
    {
      type: 'section',
      content: [
        { type: 'list', text: '  -', whitespace: 2, index: 16 },
        { type: 'checkbox', text: '[ ]', index: 16 },
        { type: 'text', text: 'documentation at point' }
      ],
      index: 16
    },
    {
      type: 'section',
      content: [
        { type: 'list', text: '  -', whitespace: 2, index: 17 },
        { type: 'checkbox', text: '[ ]', index: 17 },
        { type: 'text', text: 'refactor' }
      ],
      index: 17
    }
  ]
}
