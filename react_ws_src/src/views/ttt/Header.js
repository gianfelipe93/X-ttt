import React from 'react'
import SetName from './SetName'
import { GAME_STEPS } from '../../util/constants'

const Header = (props) => {
  const { game_step, username, saveUserName } = props

  if (game_step === GAME_STEPS.SET_NAME) {
    return <SetName
      onSetName={saveUserName}
    />
  }

  return <div>
    <h2>Welcome, {username}</h2>
  </div>
}

export default Header