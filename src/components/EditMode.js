import React, { useState } from 'react'
import styled from 'styled-components'

const HeadlineLevel = styled.input`
    width: 100%;
`

const HeadlineText = styled.input`
    width: 100%;
`

const SectionText = styled.textarea`
    width: 100%;
`

const getHeadlineText = editNode => editNode.content.map(content => content.text)

const sectionFilter = x => x.type === 'section'

const getSectionText = editNode => editNode.children
    .filter(sectionFilter)
    .map(x => x.content.map(x => x.text))
    .join('\n')

const getLineNumberRange = editNode => ({ 
    start: editNode.index,
    end: getSectionText(editNode) ? 
    editNode.children.filter(sectionFilter).slice(-1)[0].index :
    editNode.index
})

const saveChanges = ({editNode, text, changes}) => {
    const createOrgEntry = ({ level, headlineText, sectionText }) => (
        `${'*'.repeat(level)} ${headlineText}\n${sectionText}`)

    const editRange = getLineNumberRange(editNode)
    const textArr = text.split('\n')

    return [...textArr.slice(0, editRange.start),
        ...createOrgEntry(changes).split('\n'),
        ...textArr.slice(editRange.end + 1)].join('\n')
}

export default ({ editNode, setEditNode, text, setText }) => {
    const level = useFormInput(editNode.level)
    const headlineText = useFormInput(getHeadlineText(editNode))
    const sectionText = useFormInput(getSectionText(editNode))

    return <div>
        <button onClick={() => setEditNode()}>Clickith me</button>
        <div>
            <label htmlFor="headline-level-input">Level</label>
            <HeadlineLevel id="headline-level-input" type="text" {...level} />
        </div>
        <div>
            <label htmlFor="headline-text-input">Headline</label>
            <HeadlineText id="headline-text-input" type="text" {...headlineText} />
        </div>
        <div>
            <label htmlFor="section-text-input">Content</label>
            <SectionText id="section-text-input" {...sectionText} />
        </div>
        <div><button onClick={() => setText(saveChanges({editNode, text, changes: {
            level: level.value, 
            headlineText: headlineText.value, 
            sectionText: sectionText.value}
        }))}>Click me</button></div>
        </div>
}

const useFormInput = initialValue => {
  const [value, setVal] = useState(initialValue)

  const onChange = e => setVal(e.target.value)

  return { value, onChange }
}
