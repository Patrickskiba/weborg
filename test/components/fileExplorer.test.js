import React from 'react'
import { render, cleanup, fireEvent, act } from 'react-testing-library'
import 'jest-dom/extend-expect'

jest.mock('idb-keyval', () => ({
    get: jest.fn(() => new Promise((res, rej) => res('here is some text'))),
    keys: jest.fn(() =>new Promise((res, rej) => res(['test1', 'test2', 'test3'])))
}))

describe('fileExplorer tests', () => {
    it('renders all the file names stored in indededDB', async () => {
        const keyval = require('idb-keyval')
        const setText = jest.fn()
        const FileExplorer = require('../../src/components/fileExplorer').default
         act(() => {
            const { getAllByText, getAllByTestId, container } = render(<FileExplorer setText={setText}/>)
        })
    })
})
