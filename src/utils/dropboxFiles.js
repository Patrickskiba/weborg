import { set } from 'idb-keyval'
import { Dropbox } from 'dropbox'

let dropbox

const getFileList = async () => {
  const getTempUrl = async (client, path, name) => {
    const reader = new FileReader()
    const file = await client.filesGetTemporaryLink({ path: path })
    const url = file.link

    fetch(url)
      .then(data => data.blob())
      .then(blob => reader.readAsText(blob))
      .catch(console.error)

    reader.onload = () => set(name, reader.result)
  }

  const fileList = await dropbox
    .filesListFolder({
      path: '',
      recursive: false,
      include_media_info: false,
      include_deleted: false,
      include_has_explicit_shared_members: false,
    })
    .catch(x => console.error(x))

  return fileList.entries
    .filter(entry => /org$/.test(entry.name) == true)
    .map(orgFile => {
      getTempUrl(dropbox, orgFile.path_lower, orgFile.name)
      return orgFile.name
    })
}

const initDropbox = () =>
  new Promise(resolve => {
    const hashValue = window.location.hash
    if (hashValue === '') return false
    dropbox = new Dropbox({
      accessToken: hashValue
        .substring(1)
        .split('&')[0]
        .replace('access_token=', ''),
    })
    resolve(dropbox)
  })

export const authenticateUser = () => {
  const client = new Dropbox({ clientId: 'ly01o1ewx36u70x' })
  const url = client.getAuthenticationUrl(HOST_URL)
  window.location.href = url
}

export const saveFile = ({ file, newText }) => {
  if (dropbox) {
    dropbox
      .filesUpload({ path: `/${file}`, contents: newText, mode: 'overwrite' })
      .catch(console.error)
  } else {
    console.log('naw')
  }
}

export default async () => {
  const client = await initDropbox()
  return getFileList(client)
}
