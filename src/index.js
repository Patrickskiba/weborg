import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'

const title = 'My Minimal React Webpack Babel Setup'

const text =
`* nice
hi
** nice
`

ReactDOM.render(
  <App text={text} />,
  document.getElementById('app')
)

module.hot.accept()
