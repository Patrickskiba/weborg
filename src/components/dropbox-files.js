import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Dropbox } from 'dropbox'

const getFileList = (client, setFileList) => {
    client.filesListFolder({ path: '', recursive: false, include_media_info: false, include_deleted: false, include_has_explicit_shared_members: false })
        .then(x => setFileList(x.entries.filter(entry => /org$/.test(entry.name) == true).map(x => ({ key: x.name }))))
        .catch(x => console.error(x))
}

const getTempUrl = (client, path, setText) => {
    const reader = new FileReader()
    client.filesGetTemporaryLink({ path: path }).then(file => { 
        const url = file.link
        fetch(url).then(data => data.blob()).then(blob => reader.readAsText(blob))
    }).catch(console.error)

    reader.onload = () => setText(reader.result)
}

const initDropbox = () => {
    const hashValue = window.location.hash
    if(hashValue === "") return false
    return new Dropbox({ accessToken: hashValue.substring(1).split('&')[0].replace('access_token=','')})
}

export default ({ fileList, setFileList }) => {
    const client = initDropbox()
    if (client) {
        if( fileList.length === 0) { 
            getFileList(client, setFileList) 
        }
    }
}
