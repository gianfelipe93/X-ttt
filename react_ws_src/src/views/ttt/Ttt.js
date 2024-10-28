import React, { Component } from 'react'

import SetGameType from './SetGameType'

import GameMain from './GameMain'
import { GAME_STEPS } from '../../util/constants'
import Header from './Header'
import useCurrentUser from '../../hooks/useCurrentUser'
import { get } from 'lodash'

export default class Ttt extends Component {
	constructor(props) {
		super(props)

		this.state = {
			game_step: this.set_game_step(),
			username: '',
			game_type: null
		}

		this.saveUserName = this.saveUserName.bind(this)
		this.saveGameType = this.saveGameType.bind(this)
		this.gameEnd = this.gameEnd.bind(this)
		this.set_game_step = this.set_game_step.bind(this)
	}

	renderGameComponent(game_step) {
		if (game_step === GAME_STEPS.SET_GAME_TYPE) {
			return <SetGameType onSetType={this.saveGameType} />
		} else if (game_step === GAME_STEPS.START_GAME) {
			return <GameMain game_type={this.state.game_type} onEndGame={this.gameEnd} />
		} else {
			return null
		}
	}

	render() {
		const { game_step } = this.state
		const { name } = useCurrentUser(['name'])

		return (
			<section id='TTT_game'>
				<div id='page-container'>
					<Header game_step={game_step} userName={name} saveUserName={this.saveUserName} />
					{this.renderGameComponent(game_step)}
				</div>
			</section>
		)
	}

	updateState(key, value) {
		let tempState = this.state
		tempState[key] = value

		this.setState(tempState)
	}

	//	------------------------	------------------------	------------------------

	saveUserName(name) {
		// eslint-disable-next-line no-undef
		app.settings.curr_user = {}
		// eslint-disable-next-line no-undef
		app.settings.curr_user.name = name

		this.updateState('username', name)
		this.upd_game_step()
	}

	//	------------------------	------------------------	------------------------

	saveGameType(type) {
		this.updateState('game_type', type)
		this.upd_game_step()

	}

	//	------------------------	------------------------	------------------------

	gameEnd() {
		this.updateState('game_type', null)
	}

	//	------------------------	------------------------	------------------------
	//	------------------------	------------------------	------------------------

	upd_game_step() {
		this.updateState('game_step', this.set_game_step())
	}

	//	------------------------	------------------------	------------------------

	set_game_step() {
		const { name, valid } = useCurrentUser(['name'])
		const game_type = get(this.state, 'game_type', null)

		if (!valid || !name)
			return GAME_STEPS.SET_NAME
		else if (!game_type)
			return GAME_STEPS.SET_GAME_TYPE
		else
			return GAME_STEPS.START_GAME
	}
}

//	------------------------	------------------------	------------------------

Ttt.propTypes = {
	params: React.PropTypes.any
}

Ttt.contextTypes = {
	router: React.PropTypes.object.isRequired
}