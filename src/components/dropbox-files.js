import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const getFileList = (client, setOrgFiles) => {
    client.filesListFolder({ path: '', recursive: false, include_media_info: false, include_deleted: false, include_has_explicit_shared_members: false })
        .then(x => setOrgFiles(x.entries.filter(entry => /org$/.test(entry.name) == true)))
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

export default ({ client, setText }) => {
    const [orgFiles, setOrgFiles] = useState([])
    if( orgFiles.length === 0) { 
        getFileList(client, setOrgFiles) 
    }
    return orgFiles.map((file, idx) => <div key={idx} onClick={() => getTempUrl(client, file.path_lower, setText)}> { file.path_lower } </div>)
}
