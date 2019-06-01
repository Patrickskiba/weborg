import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const getHeadlineText = editNode => editNode.content.map(content => content.text)

const getSectionText = editNode => editNode.children
    .filter(x => x.type === 'section')
    .map(x => x.content.map(x => x.text))
    .join('\n')

export default ({ editNode, setEditNode }) => {
    const level = useFormInput(editNode.level)
    const sectionText = useFormInput(getSectionText(editNode))
    const headlineText = useFormInput(getHeadlineText(editNode))

    return <div>
        <button onClick={() => setEditNode()}>Clickith me</button>
        {JSON.stringify(editNode)}
        <input type="text" {...level} />
        <input type="text" {...headlineText} />
        <textarea {...sectionText} />
        </div>
}

const useFormInput = initialValue => {
    const [value, setVal] = useState(initialValue)

    const onChange = e => setVal(e.target.value)

    return { value, onChange }
}
