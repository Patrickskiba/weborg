describe('move node tests', () => {
  const sampleText = `* this is a headline 0\n** this is a another headline 1\n** headline here 2\n** headline with subtext 3\nhere is the subtext 4\n** more headlines with subtext 5\nlook at all this subtext 6\n** headline 7`
  it('moves one headline with no children up one, replacing the position of another headline with no children', () => {
    const { moveNodeUp } = require('../../src/components/MoveNode')
    const mode = { type: 'Move', range: { start: 1, end: 1 } }
    const dispatch = jest.fn()

    moveNodeUp({ mode, text: sampleText, dispatch })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'moveNode',
      payload: {
        text: `** this is a another headline 1\n* this is a headline 0\n** headline here 2\n** headline with subtext 3\nhere is the subtext 4\n** more headlines with subtext 5\nlook at all this subtext 6\n** headline 7`,
        mode: {
          type: 'Move',
          range: { start: 0, end: 0 },
        },
      },
    })
  })

  it('moves one headline with section text up one, replacing the position of another headline with no children', () => {
    const { moveNodeUp } = require('../../src/components/MoveNode')
    const mode = { type: 'Move', range: { start: 3, end: 4 } }
    const dispatch = jest.fn()

    moveNodeUp({ mode, text: sampleText, dispatch })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'moveNode',
      payload: {
        text: `* this is a headline 0\n** this is a another headline 1\n** headline with subtext 3\nhere is the subtext 4\n** headline here 2\n** more headlines with subtext 5\nlook at all this subtext 6\n** headline 7`,
        mode: {
          type: 'Move',
          range: { start: 2, end: 3 },
        },
      },
    })
  })

  it('moves one headline with no children up one, replacing the position of another headline with section text', () => {
    const { moveNodeUp } = require('../../src/components/MoveNode')
    const mode = { type: 'Move', range: { start: 7, end: 7 } }
    const dispatch = jest.fn()
    moveNodeUp({ mode, text: sampleText, dispatch })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'moveNode',
      payload: {
        text: `* this is a headline 0\n** this is a another headline 1\n** headline here 2\n** headline with subtext 3\nhere is the subtext 4\n** headline 7\n** more headlines with subtext 5\nlook at all this subtext 6`,
        mode: {
          type: 'Move',
          range: { start: 5, end: 5 },
        },
      },
    })
  })

  it('moves one headline with section up one, replacing the position of another headline with section text', () => {
    const { moveNodeUp } = require('../../src/components/MoveNode')
    const mode = { type: 'Move', range: { start: 5, end: 6 } }
    const dispatch = jest.fn()
    moveNodeUp({ mode, text: sampleText, dispatch })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'moveNode',
      payload: {
        text: `* this is a headline 0\n** this is a another headline 1\n** headline here 2\n** more headlines with subtext 5\nlook at all this subtext 6\n** headline with subtext 3\nhere is the subtext 4\n** headline 7`,
        mode: {
          type: 'Move',
          range: { start: 3, end: 4 },
        },
      },
    })
  })

  it('moves one headline with no children up one, replacing the position of another headline with no children', () => {
    const { moveNodeDown } = require('../../src/components/MoveNode')
    const mode = { type: 'Move', range: { start: 1, end: 1 } }
    const dispatch = jest.fn()
    moveNodeDown({ mode, text: sampleText, dispatch })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'moveNode',
      payload: {
        text: `* this is a headline 0\n** headline here 2\n** this is a another headline 1\n** headline with subtext 3\nhere is the subtext 4\n** more headlines with subtext 5\nlook at all this subtext 6\n** headline 7`,
        mode: {
          type: 'Move',
          range: { start: 2, end: 2 },
        },
      },
    })
  })
  it('moves one headline with section text down one, replacing the position of another headline with no children', () => {
    const { moveNodeDown } = require('../../src/components/MoveNode')
    const mode = { type: 'Move', range: { start: 5, end: 6 } }
    const dispatch = jest.fn()
    moveNodeDown({ mode, text: sampleText, dispatch })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'moveNode',
      payload: {
        text: `* this is a headline 0\n** this is a another headline 1\n** headline here 2\n** headline with subtext 3\nhere is the subtext 4\n** headline 7\n** more headlines with subtext 5\nlook at all this subtext 6`,
        mode: {
          type: 'Move',
          range: { start: 6, end: 7 },
        },
      },
    })
  })
  it('moves one headline with no children down one, replacing the position of another headline with section text', () => {
    const { moveNodeDown } = require('../../src/components/MoveNode')
    const mode = { type: 'Move', range: { start: 2, end: 2 } }
    const dispatch = jest.fn()
    moveNodeDown({ mode, text: sampleText, dispatch })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'moveNode',
      payload: {
        text: `* this is a headline 0\n** this is a another headline 1\n** headline with subtext 3\nhere is the subtext 4\n** headline here 2\n** more headlines with subtext 5\nlook at all this subtext 6\n** headline 7`,
        mode: {
          type: 'Move',
          range: { start: 4, end: 4 },
        },
      },
    })
  })

  it('moves one headline with section down one, replacing the position of another headline with section text', () => {
    const { moveNodeDown } = require('../../src/components/MoveNode')
    const mode = { type: 'Move', range: { start: 3, end: 4 } }
    const dispatch = jest.fn()
    moveNodeDown({ mode, text: sampleText, dispatch })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'moveNode',
      payload: {
        text: `* this is a headline 0\n** this is a another headline 1\n** headline here 2\n** more headlines with subtext 5\nlook at all this subtext 6\n** headline with subtext 3\nhere is the subtext 4\n** headline 7`,
        mode: {
          type: 'Move',
          range: { start: 5, end: 6 },
        },
      },
    })
  })
})
