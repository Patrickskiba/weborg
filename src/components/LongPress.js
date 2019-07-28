import React from 'react'
class LongPress extends React.Component {
  constructor(props) {
    super(props)
    this.state = { pressIntended: false, longPressed: false }
    this.longId = undefined
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      this.setState({ pressIntended: false })
      clearTimeout(this.longId)
    })
  }

  componentWillUnmount() {
    clearTimeout(this.longId)
    window.removeEventListener('scroll', () => {
      this.setState({ pressIntended: true })
      clearTimeout(this.longId)
    })
  }

  componentDidUpdate(prevProps) {
    if (this.state.pressIntended !== prevProps.pressIntended) {
      if (this.state.pressIntended) {
        this.longId = setTimeout(() => {
          this.setState({ longPressed: true })
          this.props.long()
        }, 500)
      } else {
        clearTimeout(this.longId)
      }
    }
  }

  render() {
    return (
      <div
        onMouseDown={() => this.setState({ pressIntended: true })}
        onMouseUp={() => {
          if (this.state.longPressed) {
            this.setState({ longPressed: false })
          }
          if (this.state.pressIntended && !this.state.longPressed) {
            this.props.short()
          }
          this.setState({ pressIntended: false })
        }}
        onMouseLeave={() => this.setState({ pressIntended: false })}
        onTouchStart={() => this.setState({ pressIntended: true })}
        onTouchEnd={() => {
          if (this.state.longPressed) {
            this.setState({ longPressed: false })
          }
          if (this.state.pressIntended && !this.state.longPressed) {
            this.props.short()
          }
          this.setState({ pressIntended: false })
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

export default LongPress
