import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'
import Dropbox from 'dropbox'

const client = new Dropbox.Dropbox({ clientId: 'ly01o1ewx36u70x' })

var authUrl = client.getAuthenticationUrl('http://localhost:8080/')

console.log(authUrl)

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
