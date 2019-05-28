import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { set } from 'idb-keyval'
import { Dropbox } from 'dropbox'

const getFileList = client => {
    client.filesListFolder({ path: '', recursive: false, include_media_info: false, include_deleted: false, include_has_explicit_shared_members: false })
        .then(file => file.entries.filter(entry => /org$/.test(entry.name) == true).forEach(orgFile => {
            getTempUrl(client, orgFile.path_lower, orgFile.name)
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
    if(hashValue === "") return false
    const client = new Dropbox({ accessToken: hashValue.substring(1).split('&')[0].replace('access_token=','')})
    resolve(client)
})

export default () => initDropbox().then(dropbox => getFileList(dropbox))
