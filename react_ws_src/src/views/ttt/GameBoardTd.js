import React from 'react'

const GameBoardTdConstructor = (onClick) => {
  const GameBoardTd = (props) => {
    const { index, className = '', typeOfCell } = props

    const cIndex = `c${index}`
    const cellIcon = typeOfCell === 'x' ? <i className="fa fa-times fa-5x"></i> : <i className="fa fa-circle-o fa-5x"></i>

    return <td id={`game_board-${cIndex}`} ref={cIndex} onClick={onClick} className={className}>
      {cellIcon}
    </td>
  }

  return GameBoardTd
}

export default GameBoardTdConstructor;