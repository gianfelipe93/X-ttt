import React, { Component } from 'react'

import io from 'socket.io-client'

import TweenMax from 'gsap'

import rand_arr_elem from '../../helpers/rand_arr_elem'
import rand_to_fro from '../../helpers/rand_to_fro'
import gameBoardTdConstructor from './GameBoardTd'
import Button from '../../components/Button'
import { clone } from 'lodash'
import useCurrentUser from '../../hooks/useCurrentUser'
import Chat from '../chat/Chat'
import useSocket from '../../hooks/useSocket'

export default class SetName extends Component {
	constructor(props) {
		super(props)

		this.win_sets = [
			['c1', 'c2', 'c3'],
			['c4', 'c5', 'c6'],
			['c7', 'c8', 'c9'],

			['c1', 'c4', 'c7'],
			['c2', 'c5', 'c8'],
			['c3', 'c6', 'c9'],

			['c1', 'c5', 'c9'],
			['c3', 'c5', 'c7']
		]


		this.state = {
			cell_vals: {},
			next_turn_ply: true,
			game_play: this.props.game_type !== 'live',
			game_stat: this.props.game_type !== 'live' ? 'Start game' : 'Connecting',
			winningSet: [],
			currentUid: null,
			game_over: false,
			mode: ''
		};

		if (this.props.game_type === 'live') {
			this.sock_start();
		}

		this.click_cell = this.click_cell.bind(this)
		this.end_game = this.end_game.bind(this)
		this.changeTurn = this.changeTurn.bind(this)
		this.handleCell = this.handleCell.bind(this)
		this.turn_comp = this.turn_comp.bind(this)
		this.turn_opp_live = this.turn_opp_live.bind(this)
		this.addWinClass = this.addWinClass.bind(this)
		this.check_turn = this.check_turn.bind(this)
		this.restartMatch = this.restartMatch.bind(this)
		this.resetBoard = this.resetBoard.bind(this)
	}

	componentDidMount() {
		// eslint-disable-next-line no-undef
		TweenMax.from('#game_stat', 1, { display: 'none', opacity: 0, scaleX: 0, scaleY: 0, ease: Power4.easeIn })
		// eslint-disable-next-line no-undef
		TweenMax.from('#game_board', 1, { display: 'none', opacity: 0, x: -200, y: -200, scaleX: 0, scaleY: 0, ease: Power4.easeIn })
	}

	sock_start() {
		const { name } = useCurrentUser(['name'])

		const OnConnect = function (socket) {
			alert('new player')
			socket.emit('new player', { name });
		}.bind(this)

		const onPaired = function (data) {
			alert('onPaired')
			this.setState({
				next_turn_ply: data.mode === 'm',
				game_play: true,
				game_stat: 'Playing with ' + data.opp.name,
				currentUid: data.uid,
				mode: data.mode
			})
		}.bind(this)

		const onOppTurn = this.turn_opp_live.bind(this)
		const onRestart = this.resetBoard.bind(this)
		const onEndGame = () => window.location = '/ttt'

		// eslint-disable-next-line no-undef
		this.socket = useSocket(app.settings.ws_conf.loc.SOCKET__io.u, OnConnect, onPaired, onOppTurn, onRestart, onEndGame)
	}

	resetBoard() {
		let tempState = clone(this.state)
		const { mode } = this.state

		tempState.cell_vals = {}
		tempState.next_turn_ply = mode === 'm'
		tempState.game_play = true
		tempState.game_stat = 'Start game'
		tempState.winningSet = []
		tempState.game_over = false

		this.setState(tempState)
	}

	restartMatch() {
		const { currentUid } = this.state
		this.resetBoard()
		this.socket.emit('restart', { currentUid });
	}

	componentWillUnmount() {
		this.end_game()
	}

	click_cell(e) {
		const { next_turn_ply, game_play, cell_vals } = this.state

		if (!next_turn_ply || !game_play) return

		const cell_id = e.currentTarget.id.substr(11)
		if (cell_vals[cell_id]) return

		this.changeTurn(cell_id)
	}

	handleCell(cell_id, cellValue) {
		const { cell_vals } = this.state
		let tempCellVals = clone(cell_vals)
		let tempState = clone(this.state)

		tempCellVals[cell_id] = cellValue
		tempState.cell_vals = tempCellVals

		this.setState(tempState, this.check_turn)
	}

	changeTurn(cell_id) {
		const { game_type } = this.props
		const { currentUid } = this.state

		this.handleCell(cell_id, 'x')

		if (game_type === 'live') {
			this.socket.emit('ply_turn', { cell_id, currentUid });
		}
	}

	turn_comp() {
		const { cell_vals } = this.state
		let tempCellVals = clone(cell_vals)
		let empty_cells_arr = []


		for (let i = 1; i <= 9; i++)
			!tempCellVals['c' + i] && empty_cells_arr.push('c' + i)

		const c = rand_arr_elem(empty_cells_arr)
		this.handleCell(c, 'o')
	}

	turn_opp_live(data) {
		this.handleCell(data.cell_id, 'o')
	}

	addWinClass(set) {
		for (let i = 1; i < 3; i++) {
			const element = document.getElementById(`game_board-${set[i]}`);
			element.classList.add('win')
		}
	}

	check_turn() {
		const { cell_vals, next_turn_ply } = this.state
		const { game_type } = this.props

		let win = false
		let set
		let fin = true

		if (game_type !== 'live') {
			this.setState({
				game_stat: 'Play'
			})
		}


		for (let i = 0; !win && i < this.win_sets.length; i++) {
			set = this.win_sets[i]

			const index0 = cell_vals[set[0]]
			const index1 = cell_vals[set[1]]
			const index2 = cell_vals[set[2]]

			win = index0 && index0 == index1 && index0 == index2

			if (win) {
				break
			}
		}

		if (win) {
			this.addWinClass(set)

			TweenMax.killAll(true)
			// eslint-disable-next-line no-undef
			TweenMax.from('td.win', 1, { opacity: 0, ease: Linear.easeIn })

			this.setState({
				game_stat: (cell_vals[set[0]] == 'x' ? 'You' : 'Opponent') + ' win',
				game_play: false,
				game_over: true,
				winningSet: set
			})

			this.socket && this.socket.disconnect();

		} else {
			for (let i = 1; i <= 9; i++)
				!cell_vals['c' + i] && (fin = false)

			if (fin) {
				this.setState({
					game_stat: 'Draw',
					game_play: false
				})

				this.socket && this.socket.disconnect();

			} else {
				game_type != 'live' && next_turn_ply && setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

				this.setState({
					next_turn_ply: !next_turn_ply
				})
			}
		}
	}

	end_game() {
		const { currentUid } = this.state

		this.props.onEndGame()
		this.socket.emit('endGame', { currentUid })
	}

	render() {
		const { cell_vals, game_play, game_stat, winningSet, currentUid } = this.state
		const { game_type } = this.props
		const turnText = this.state.next_turn_ply ? 'Your turn' : 'Opponent turn'
		const GameBoardTd = gameBoardTdConstructor(this.click_cell, winningSet)

		return (
			<div className='gameMainContainer'>
				<div id='GameMain'>
					<h1>Play {game_type}</h1>
					<div id="game_stat">
						<div id="game_stat_msg">{game_stat}</div>
						{game_play && <div id="game_turn_msg">{turnText}</div>}
					</div>
					<div id="game_board">
						<table>
							<tbody>
								<tr>
									<GameBoardTd index="1" typeOfCell={cell_vals['c1']} />
									<GameBoardTd index="2" typeOfCell={cell_vals['c2']} className="vbrd" />
									<GameBoardTd index="3" typeOfCell={cell_vals['c3']} />
								</tr>
								<tr>
									<GameBoardTd index="4" typeOfCell={cell_vals['c4']} className="hbrd" />
									<GameBoardTd index="5" typeOfCell={cell_vals['c5']} className="vbrd hbrd" />
									<GameBoardTd index="6" typeOfCell={cell_vals['c6']} className="hbrd" />
								</tr>
								<tr>
									<GameBoardTd index="7" typeOfCell={cell_vals['c7']} />
									<GameBoardTd index="8" typeOfCell={cell_vals['c8']} className="vbrd" />
									<GameBoardTd index="9" typeOfCell={cell_vals['c9']} />
								</tr>
							</tbody>
						</table>
					</div>
					<div className='buttonContainer'>
						<Button onClick={this.end_game} text='End Game' className="button short" />
						<Button onClick={this.restartMatch} text='Restart' className="button short" />
					</div>
				</div>
				{currentUid && <Chat currentUid={currentUid} socket={this.socket} />}
			</div>
		)
	}


}