import React, { Component } from 'react'
import { Link } from 'react-router'

import SetGameType from './SetGameType'

import GameMain from './GameMain'
import { GAME_STEPS } from '../../util/constants'

export default class Ttt extends Component {
	constructor(props) {
		super(props)

		this.state = {
			game_step: this.set_game_step(),
			username: app.settings.curr_user.name,
			game_type: null
		}

		this.saveUserName = this.saveUserName.bind(this)
		this.saveGameType = this.saveGameType.bind(this)
		this.gameEnd = this.gameEnd.bind(this)
	}

	componentDidUpdate(_, prevState) {
		if (prevState.game_step !== this.state.game_step || prevState.username !== this.state.username) {
			this.upd_game_step()
		}
	}

	renderGameComponent = () => {
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

		return (
			<section id='TTT_game'>
				<div id='page-container'>
					<Header game_step={game_step} userName={app.settings.curr_user.name} saveUserName={this.saveUserName} />

					{this.renderGameComponent()}
				</div>
			</section>
		)
	}

	updateState = (key, value) => {
		this.setState({
			...this.state,
			[key]: value
		})
	}

	//	------------------------	------------------------	------------------------

	saveUserName(name) {
		app.settings.curr_user = {}
		app.settings.curr_user.name = name

		updateState('username', name)
	}

	//	------------------------	------------------------	------------------------

	saveGameType(type) {
		updateState('game_type', type)
	}

	//	------------------------	------------------------	------------------------

	gameEnd() {
		updateState('game_type', null)
	}

	//	------------------------	------------------------	------------------------
	//	------------------------	------------------------	------------------------

	upd_game_step() {
		updateState('game_step', this.set_game_step())
	}

	//	------------------------	------------------------	------------------------

	set_game_step() {
		if (!app.settings.curr_user || !app.settings.curr_user.name)
			return GAME_STEPS.SET_NAME
		else if (!this.state.game_type)
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