import React from 'react'
import ReactDOM from 'react-dom'
import * as parse from '../parser'

const testText = 
`* This is a test
Test test test
test test
** headline test
here it is
`

export default () => <div>{ JSON.stringify(parse(testText))}</div>
