export const testCase1 = {
  fileText: `* Todos 
** Completed
*** DONE Mturk
http://146.66.103.39/~expandy5/mturk101.html
*** DONE Emacs mode specific key bindings
- Org mode
  - [X] toggle todo state
  - [X] toggle checkbox
  - [X] create checkbox
  - [ ] create timestamp
- JS mode [2/5]
  - [X] go to definition
  - [X] find references
  hello
  nice
  - [ ] rename symbol
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
*** TODO Take a look at iterators for efficient array maths`,
  parentNode: {
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
          { type: 'checkbox', text: '[ ]', index: 9 },
          { type: 'text', text: 'create timestamp' }
        ],
        index: 9
      },
      {
        type: 'section',
        content: [
          { type: 'list', text: '-', whitespace: 0, index: 10 },
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
      { type: 'section', index: 13, content: [{ type: 'text', text: '  hello' }] },
      { type: 'section', index: 14, content: [{ type: 'text', text: '  nice' }] },
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
}

export const testCase2 = {
  fileText: `* Todos 
** Completed
*** DONE Mturk
http://146.66.103.39/~expandy5/mturk101.html
*** DONE Emacs mode specific key bindings [/]
- Org mode
  - [X] toggle todo state
  - [X] toggle checkbox
  - [X] create checkbox
  - [X] create timestamp
- JS mode [2/5]
  - [X] go to definition
  - [X] find references
  - [ ] rename symbol
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
*** TODO Take a look at iterators for efficient array maths`,

  parentNode: {
    type: 'headline',
    index: 4,
    level: 3,
    State: 'DONE',
    content: [
      { type: 'text', text: 'Emacs mode specific key bindings' },
      { type: 'progress', text: '[/]' }
    ],
    children: [
      {
        type: 'section',
        content: [
          { type: 'list', text: '-', whitespace: 0, index: 5 },
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
      {
        type: 'section',
        content: [
          { type: 'list', text: '  -', whitespace: 2, index: 13 },
          { type: 'checkbox', text: '[ ]', index: 13 },
          { type: 'text', text: 'rename symbol' }
        ],
        index: 13
      },
      {
        type: 'section',
        content: [
          { type: 'list', text: '    -', whitespace: 4, index: 14 },
          { type: 'checkbox', text: '[ ]', index: 14 },
          { type: 'text', text: 'documentation at point' }
        ],
        index: 14
      },
      {
        type: 'section',
        content: [
          { type: 'list', text: '    -', whitespace: 4, index: 15 },
          { type: 'checkbox', text: '[ ]', index: 15 },
          { type: 'text', text: 'refactor' }
        ],
        index: 15
      }
    ]
  }
}

export const testCase3 = {
  fileText: `* Todos 
** Completed
*** DONE Mturk
http://146.66.103.39/~expandy5/mturk101.html
*** DONE Emacs mode specific key bindings [/]
- Org mode
  - [X] toggle todo state
  - [X] toggle checkbox
  - [X] create checkbox
  - [X] create timestamp
- JS mode [%]
  - [X] go to definition
  - [X] find references
  - [ ] rename symbol
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
*** TODO Take a look at iterators for efficient array maths`,

  parentNode: {
    type: 'headline',
    index: 4,
    level: 3,
    State: 'DONE',
    content: [
      { type: 'text', text: 'Emacs mode specific key bindings' },
      { type: 'progress', text: '[/]' }
    ],
    children: [
      {
        type: 'section',
        content: [
          { type: 'list', text: '-', whitespace: 0, index: 5 },
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
          { type: 'text', text: 'JS mode' },
          { type: 'progress', text: '[%]' }
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
      {
        type: 'section',
        content: [
          { type: 'list', text: '  -', whitespace: 2, index: 13 },
          { type: 'checkbox', text: '[ ]', index: 13 },
          { type: 'text', text: 'rename symbol' }
        ],
        index: 13
      },
      {
        type: 'section',
        content: [
          { type: 'list', text: '    -', whitespace: 4, index: 14 },
          { type: 'checkbox', text: '[ ]', index: 14 },
          { type: 'text', text: 'documentation at point' }
        ],
        index: 14
      },
      {
        type: 'section',
        content: [
          { type: 'list', text: '    -', whitespace: 4, index: 15 },
          { type: 'checkbox', text: '[ ]', index: 15 },
          { type: 'text', text: 'refactor' }
        ],
        index: 15
      }
    ]
  }
}
