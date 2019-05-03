import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'

const title = 'My Minimal React Webpack Babel Setup'

const text =
`* TODO nice *bold bold* /italic test/ _underline_ +test+ test
hi *this is a bold* test
** nice
here are some notes
here are some notes
here are some notes
* DONE nice 
hi *this is a bold* test
`

ReactDOM.render(
  <App text={text} />,
  document.getElementById('app')
)

module.hot.accept()
