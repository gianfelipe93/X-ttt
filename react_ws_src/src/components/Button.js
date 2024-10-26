import React from 'react'

const Button = (props) => {
  const { onClick, text } = props

  return <button type='submit' onClick={onClick} className='button long'><span>{text} <span className='fa fa-caret-right'></span></span></button>
}

export default Button;