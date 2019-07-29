import React from 'react'
import ReactDOM from 'react-dom'
import Root from './hot-reload'
import { set } from 'idb-keyval'
import welcome from './utils/welcome-file'
import { StoreProvider } from './components/Store'

set(welcome.fileName, welcome.text)

ReactDOM.render(
  <StoreProvider>
    <Root />
  </StoreProvider>,
  document.getElementById('app')
)
