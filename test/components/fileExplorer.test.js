import React from 'react'
import { render, cleanup, fireEvent, act, waitForElement } from 'react-testing-library'
import 'jest-dom/extend-expect'

jest.mock('idb-keyval', () => ({
    get: jest.fn(() => new Promise((res, rej) => res('here is some text'))),
    keys: jest.fn(() =>new Promise((res, rej) => res(['test1', 'test2', 'test3'])))
}))

describe('fileExplorer tests', () => {
    it('renders all the file names stored in indededDB, clicking on a file changes it background and returns calls setText', async () => {
        const keyval = require('idb-keyval')
        const setText = jest.fn()
        const FileExplorer = require('../../src/components/fileExplorer').default
        await act(async () => {
            const { getByText, container } = render(<FileExplorer setText={setText}/>)
            await waitForElement(() => getByText('test1'))
            expect(container).toMatchSnapshot()
            expect(getByText('test1')).toHaveStyle('background: #dddddd')

            fireEvent.click(getByText('test1'), { button: 1})

            expect(getByText('test1')).toHaveStyle('background: #b1b1b1')
        })
        act(() => expect(setText).toHaveBeenCalledWith('here is some text'))
    })
})
