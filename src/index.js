import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'

const title = 'My Minimal React Webpack Babel Setup'

const text =
`* TODO nice *bold bold* /italic test/ _unde rline_ test
hi *this is a bold* test
** nice
`

ReactDOM.render(
  <App text={text} />,
  document.getElementById('app')
)

module.hot.accept()
