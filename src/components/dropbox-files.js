import React from 'react'
import ReactDOM from 'react-dom'
import { Dropbox } from 'dropbox'

const getFileList = () => {
    const hashValue = window.location.hash
    if(hashValue === "") return false
    const client = new Dropbox({ accessToken: hashValue.substring(1).split('&')[0].replace('access_token=','')})
    client.filesListFolder({ path: '', recursive: false, include_media_info: false, include_deleted: false, include_has_explicit_shared_members: false })
        .then(x => console.log(x.entries.filter(entry => /org$/.test(entry.name) == true)))
        .catch(x => console.error(x))
}

export default () => <div>
    { getFileList() }
</div>
