import React from 'react'

export default ({ show, setShow, height = 'tall', header = '', footer, children }) => (
  <>
    {show && (
      <>
        <div className='file-explorer-darken' onClick={() => setShow(false)} />
        <div className={`file-explorer-container ${height}`}>
          <div className='agenda-header'>{header}</div>
          <div className={`file-explorer-list ${height}`}>
            <div className='file-explorer-list-container'>{children}</div>
          </div>
          {footer}
        </div>
      </>
    )}
  </>
)
