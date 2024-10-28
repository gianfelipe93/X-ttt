import React, { Component } from 'react'

import objectAssign from 'object-assign'

class FieldHolder extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { isValid, goodClasses, badClass } = this.props
    const currentClasses = isValid ? goodClasses : goodClasses + ' ' + badClass
    const props = objectAssign({}, this.props, { className: currentClasses })
    return (
      <div {...props} >
        {this.props.children}
      </div>
    )
  }
}

FieldHolder.propTypes = {
  children: React.PropTypes.any,
  isValid: React.PropTypes.bool,
  goodClasses: React.PropTypes.string.isRequired,
  badClass: React.PropTypes.string.isRequired
}

export default FieldHolder