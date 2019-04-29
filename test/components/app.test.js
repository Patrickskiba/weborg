import React from 'react'
import { render, cleanup } from 'react-testing-library'


describe('app tests', () => {
    it('renders the component', () => {
        const App = require('../../src/components/app').default
        const { getByText, getByTestId, container, asFragment } = render(<App />)

        console.log(container)
    })
})
