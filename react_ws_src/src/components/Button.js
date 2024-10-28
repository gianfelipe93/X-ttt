import React from 'react'

const Button = (props) => {
  const { onClick, text, className = 'button long' } = props

  return <button type='submit' onClick={onClick} className={className}><span>{text} <span className='fa fa-caret-right'></span></span></button>
}

export default Button;