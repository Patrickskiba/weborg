import React from 'react'
import TextField, { Input } from '@material/react-text-field'

const Level = ({ level }) => {
  return (
    <div>
      <div className='sub-header-1'>Select a level</div>
      <div className='row counter-row'>
        <div
          className='counter-button minus-button'
          onClick={() => level[1](x => (x > 1 ? x - 1 : x))}>
          <i className='material-icons large-icon'>remove</i>
        </div>
        <div className='headline-4'>{level[0]}</div>
        <div className='counter-button add-button' onClick={() => level[1](x => x + 1)}>
          <i className='material-icons large-icon'>add</i>
        </div>
      </div>
    </div>
  )
}

const Headline = ({ headline }) => {
  return (
    <TextField outlined className='full-length-input' label='Headline'>
      <Input {...headline} />
    </TextField>
  )
}

const SelectState = ({ state }) => {
  console.log(state)
  return (
    <div>
      <div className='sub-header-1'>Select a state</div>
      <div className='row state-row'>
        {['', 'Todo', 'Done'].map(x => (
          <div
            key={x}
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
      <div className='sub-header-1'>Select a priority</div>
      <div className='row priority-row'>
        {['', 'A', 'B', 'C'].map(x => (
          <div
            key={x}
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
    <TextField textarea outlined className='full-length-input content-area' label='Content'>
      <Input className='content-area' {...section} />
    </TextField>
  )
}

export { Level, Headline, SelectState, SelectPriority, ContentArea }
