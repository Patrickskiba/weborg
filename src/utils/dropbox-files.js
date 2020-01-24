import { get, set, keys } from 'idb-keyval'
import { Dropbox } from 'dropbox'

let dropbox

const getTempUrl = async (client, path, name) => {
  const reader = new FileReader()
  const file = await client.filesGetTemporaryLink({ path: path })
  const url = file.link

  fetch(url)
    .then(data => data.blob())
    .then(blob => reader.readAsText(blob))
    .catch(console.error)

  reader.onload = () => {
    set(name, reader.result)
  }
}

const getFileList = async () => {
  const localDB = await keys()

  const fileList = await dropbox
    .filesListFolder({
      path: '',
      recursive: false,
      include_media_info: false,
      include_deleted: false,
      include_has_explicit_shared_members: false
    })
    .catch(x => console.error(x))

  return fileList.entries
    .filter(entry => /org$/.test(entry.name) == true)
    .map(orgFile => {
      if (!localDB.includes(orgFile.name)) set(orgFile.name, '')
      getTempUrl(dropbox, orgFile.path_lower, orgFile.name)
      return orgFile.name
    })
}

const initDropbox = async () =>
  new Promise(async (resolve, reject) => {
    let accessToken
    if (window.location.hash) {
      accessToken = window.location.hash
        .substring(1)
        .split('&')[0]
        .replace('access_token=', '')
      set('DBX_TOKEN', accessToken)
    } else {
      accessToken = await get('DBX_TOKEN')
    }

    if (accessToken == null) reject('Dropbox not authenticated')
    dropbox = new Dropbox({ accessToken })
    resolve(dropbox)
  })

const updateLastUpdatedTime = file => {
  const defaultDT = new Date().toISOString()
  set(`${file} - lastUpdatedTime`, defaultDT)
}

// TODO: Clean up dup code in getLatestOfFile and getTempUrl later

export const getLatestOfFile = file => {
  if (dropbox) {
    const reader = new FileReader()

    return dropbox
      .filesGetTemporaryLink({ path: `/${file}` })
      .then(fileInfo => fetch(fileInfo.link))
      .then(data => data.blob())
      .then(blob => reader.readAsText(blob))
      .then(
        () =>
          new Promise((res, rej) => {
            reader.onload = () => {
              res(reader.result)
            }
            reader.onerror = () => {
              rej(reader.error)
            }
          })
      )
      .catch(console.error)
  } else {
    console.log('naw')
  }
}

export const authenticateUser = () => {
  const client = new Dropbox({ clientId: 'ly01o1ewx36u70x' })
  const url = client.getAuthenticationUrl(HOST_URL)
  window.location.href = url
}

export const saveFile = ({ file, newText }) => {
  if (dropbox) {
    dropbox
      .filesUpload({ path: `/${file}`, contents: newText, mode: 'overwrite' })
      .then(() => updateLastUpdatedTime(file))
      .catch(console.error)
  } else {
    console.log('naw')
  }
}

export const removeFile = ({ file }) => {
  if (dropbox) {
    dropbox
      .filesDeleteV2({ path: `/${file}` })
      .then(() => updateLastUpdatedTime(file))
      .catch(console.error)
  } else {
    console.log('naw')
  }
}

export default async () => {
  try {
    const client = await initDropbox()
    return getFileList(client)
  } catch (error) {
    console.error(error)
  }
}
