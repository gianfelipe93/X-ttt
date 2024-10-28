import React from 'react'

const GameBoardTdConstructor = (onClick, winningSet) => {
  const GameBoardTd = (props) => {
    const { index, className = '', typeOfCell } = props

    const cIndex = `c${index}`
    let tdClass = className

    if (winningSet && winningSet.includes(cIndex)) {
      tdClass += ' win'
    }
    // const cellIcon = typeOfCell === 'x' ? <i className="fa fa-times fa-5x"></i> : typeOfCell === 'x' ? <i className="fa fa-circle-o fa-5x"></i> : <div></div>


    return <td id={`game_board-${cIndex}`} onClick={onClick} className={tdClass}>
      <div>
        {typeOfCell == 'x' && <i className="fa fa-times fa-5x"></i>}
        {typeOfCell == 'o' && <i className="fa fa-circle-o fa-5x"></i>}
      </div>
    </td>
  }

  return GameBoardTd
}

export default GameBoardTdConstructor;