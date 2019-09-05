import React from 'react'
import ReactDOM from 'react-dom'
import Root from './hot-reload'
import { get, set } from 'idb-keyval'
import welcome from './utils/welcome-file'
import { StoreProvider } from './components/Store'
import './main.css'

set(welcome.fileName, welcome.text)

get('lastVisitedPage').then(filename => {
  if (filename) {
    get(filename).then(text => {
      ReactDOM.render(
        <StoreProvider text={text} selectedRow={filename}>
          <Root />
        </StoreProvider>,
        document.getElementById('app')
      )
    })
  } else {
    ReactDOM.render(
      <StoreProvider text={welcome.text} selectedRow={welcome.fileName}>
        <Root />
      </StoreProvider>,
      document.getElementById('app')
    )
  }
})
