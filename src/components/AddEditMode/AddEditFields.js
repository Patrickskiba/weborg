import React from 'react'
import TextField, { Input } from '@material/react-text-field'

const Level = ({ level }) => {
  return (
    <div>
      <label className='sub-header-1'>Select a level</label>
      <div className='row counter-row'>
        <div
          className='counter-button minus-button'
          onClick={() => level[1](x => (x > 1 ? x - 1 : x))}>
          <i className='material-icons large-icon'>remove</i>
        </div>
        <div role='level' className='headline-4'>
          {level[0]}
        </div>
        <div className='counter-button add-button' onClick={() => level[1](x => x + 1)}>
          <i className='material-icons large-icon'>add</i>
        </div>
      </div>
    </div>
  )
}

const Headline = ({ headline }) => {
  return (
    <TextField outlined htmlFor='headline-value' className='full-length-input' label='Headline'>
      <Input id='headline-value' {...headline} />
    </TextField>
  )
}

const SelectState = ({ state }) => {
  return (
    <div>
      <label className='sub-header-1'>Select a state</label>
      <div className='row state-row'>
        {['', 'Todo', 'Done'].map(x => (
          <div
            key={`state-${x}`}
            title={`state-${x}`}
            className={`chip ${x.toUpperCase() === state[0].toUpperCase() ? 'chip-selected' : ''}`}
            onClick={() => state[1](x.toUpperCase())}>
            <span className='chip-text'>{!x ? 'None' : x}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const SelectPriority = ({ priority }) => {
  return (
    <div>
      <label className='sub-header-1'>Select a priority</label>
      <div className='row priority-row'>
        {['', 'A', 'B', 'C'].map(x => (
          <div
            key={`priority-${x}`}
            title={`priority-${x}`}
            className={`chip ${x.toUpperCase() === priority[0] ? 'chip-selected' : ''}`}
            onClick={() => priority[1](x)}>
            <span className='chip-text'>{!x ? 'None' : x}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ContentArea = ({ section }) => {
  return (
    <TextField
      textarea
      outlined
      htmlFor='content-value'
      className='full-length-input content-area'
      label='Content'>
      <Input id='content-value' className='content-area' {...section} />
    </TextField>
  )
}

const Properties = ({ properties }) =>
  properties.map((property, idx) => {
    const keyid = `property-key${idx}`
    const valueid = `property-value${idx}`
    return (
      <div key={idx} className='row'>
        <TextField outlined htmlFor={keyid} className='half-length-input' label='Key'>
          <Input id={keyid} className='content-area' value={property[0].text} />
        </TextField>

        <TextField outlined htmlFor={valueid} className='half-length-input' label='Value'>
          <Input id={valueid} className='content-area' value={property[1].text} />
        </TextField>
      </div>
    )
  })

export { Level, Headline, SelectState, SelectPriority, ContentArea, Properties }
