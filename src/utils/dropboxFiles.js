import { set } from 'idb-keyval'
import { Dropbox } from 'dropbox'

let dropbox

const getFileList = () => {
  dropbox.filesListFolder({ path: '', recursive: false, include_media_info: false, include_deleted: false, include_has_explicit_shared_members: false })
    .then(file => file.entries.filter(entry => /org$/.test(entry.name) == true).forEach(orgFile => {
      getTempUrl(dropbox, orgFile.path_lower, orgFile.name)
    }))
    .catch(x => console.error(x))
}

const getTempUrl = (client, path, name) => {
  const reader = new FileReader()
  client.filesGetTemporaryLink({ path: path }).then(file => {
    const url = file.link
    fetch(url).then(data => data.blob()).then(blob => reader.readAsText(blob))
  }).catch(console.error)

  reader.onload = () => set(name, reader.result)
}

const initDropbox = () => new Promise(resolve => {
  const hashValue = window.location.hash
  if (hashValue === '') return false
  dropbox = new Dropbox({ accessToken: hashValue.substring(1).split('&')[0].replace('access_token=', '') })
  resolve(dropbox)
})

initDropbox().then(getFileList)

export const saveFile = ({file, newText}) => {
  if(dropbox) {
    dropbox.filesUpload({path: `/${file}`, contents: newText, mode: 'overwrite' }).then(res => {
      console.log(res)
    }).catch(console.error)
  } else {
    console.log('naw')
  }
}

export default () => dropbox

