import React, { Component } from 'react'

import io from 'socket.io-client'

import TweenMax from 'gsap'

import rand_arr_elem from '../../helpers/rand_arr_elem'
import rand_to_fro from '../../helpers/rand_to_fro'
import GameBoardTdConstructor from './GameBoardTd'
import Button from '../../components/Button'

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

		if (this.props.game_type !== 'live')
			this.state = {
				cell_vals: {},
				next_turn_ply: true,
				game_play: true,
				game_stat: 'Start game'
			}
		else {
			this.sock_start()

			this.state = {
				cell_vals: {},
				next_turn_ply: true,
				game_play: false,
				game_stat: 'Connecting'
			}
		}

		this.click_cell = this.click_cell.bind(this)
		this.end_game = this.end_game.bind(this)
		this.changeTurn = this.changeTurn.bind(this)
		this.animateCell = this.animateCell.bind(this)
		this.handleCell = this.handleCell.bind(this)
		this.turn_comp = this.turn_comp.bind(this)
		this.turn_opp_live = this.turn_opp_live.bind(this)
		this.addWinClass = this.addWinClass.bind(this)
		this.check_turn = this.check_turn.bind(this)
	}

	componentDidMount() {
		TweenMax.from('#game_stat', 1, { display: 'none', opacity: 0, scaleX: 0, scaleY: 0, ease: Power4.easeIn })
		TweenMax.from('#game_board', 1, { display: 'none', opacity: 0, x: -200, y: -200, scaleX: 0, scaleY: 0, ease: Power4.easeIn })
	}

	sock_start() {
		this.socket = io(app.settings.ws_conf.loc.SOCKET__io.u);

		this.socket.on('connect', function () {
			this.socket.emit('new player', { name: app.settings.curr_user.name });
		}.bind(this));

		this.socket.on('pair_players', function () {
			this.setState({
				next_turn_ply: data.mode === 'm',
				game_play: true,
				game_stat: 'Playing with ' + data.opp.name
			})
		}.bind(this));

		this.socket.on('opp_turn', this.turn_opp_live.bind(this));
	}

	componentWillUnmount() {
		this.socket && this.socket.disconnect();
	}

	cell_cont(c) {
		const { cell_vals } = this.state

		if (!cell_vals) return

		return (<div>
			{cell_vals[c] === 'x' ? <i className="fa fa-times fa-5x"></i> : <i className="fa fa-circle-o fa-5x"></i>}
		</div>)
	}

	render() {
		const { cell_vals, game_play, game_stat } = this.state
		const { game_type } = this.props
		const turnText = this.state.next_turn_ply ? 'Your turn' : 'Opponent turn'
		const GameBoardTd = GameBoardTdConstructor(this.click_cell)

		return (
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
								<GameBoardTd index="1" onClick={this.click_cell} typeOfCell={cell_vals['c1']} />
								<GameBoardTd index="2" onClick={this.click_cell} typeOfCell={cell_vals['c2']} className="vbrd" />
								<GameBoardTd index="3" onClick={this.click_cell} typeOfCell={cell_vals['c3']} />
							</tr>
							<tr>
								<GameBoardTd index="4" onClick={this.click_cell} typeOfCell={cell_vals['c4']} className="hbrd" />
								<GameBoardTd index="5" onClick={this.click_cell} typeOfCell={cell_vals['c5']} className="vbrd hbrd" />
								<GameBoardTd index="6" onClick={this.click_cell} typeOfCell={cell_vals['c6']} className="hbrd" />
							</tr>
							<tr>
								<GameBoardTd index="7" onClick={this.click_cell} typeOfCell={cell_vals['c7']} />
								<GameBoardTd index="8" onClick={this.click_cell} typeOfCell={cell_vals['c8']} className="vbrd" />
								<GameBoardTd index="9" onClick={this.click_cell} typeOfCell={cell_vals['c9']} />
							</tr>
						</tbody>
					</table>
				</div>
				<Button onClick={this.end_game} text='End Game' />
			</div>
		)
	}

	click_cell(e) {
		const { next_turn_ply, game_play, cell_vals } = this.state

		if (!next_turn_ply || !game_play) return

		const cell_id = e.currentTarget.id.substr(11)
		if (cell_vals[cell_id]) return

		this.changeTurn(cell_id)
	}

	animateCell(cell_id) { //not sure what this function does but it's repeated in the code
		TweenMax.from(this.refs[cell_id], 0.7, { opacity: 0, scaleX: 0, scaleY: 0, ease: Power4.easeOut })
	}

	handleCell(cell_id, cellValue) {
		const { cell_vals } = this.state
		let tempCellVals = { ...cell_vals }

		tempCellVals[cell_id] = cellValue

		this.animateCell(cell_id)

		this.setState({
			...this.state,
			cell_vals: tempCellVals
		})

		this.check_turn()
	}

	changeTurn(cell_id) {
		const { game_type } = this.props

		this.handleCell(cell_id, 'x')

		if (game_type === 'live') {
			this.socket.emit('ply_turn', { cell_id });
		}
	}

	turn_comp() {
		const { cell_vals } = this.state
		let tempCellVals = { ...cell_vals }
		let empty_cells_arr = []


		for (let i = 1; i <= 9; i++)
			!tempCellVals['c' + i] && empty_cells_arr.push('c' + i)

		const c = rand_arr_elem(empty_cells_arr)
		this.handleCell(c, 'o')
	}

	turn_opp_live(data) {
		this.handleCell(data.cell_id, 'o')
	}

	addWinClass() {
		this.refs[set[0]].classList.add('win')
		this.refs[set[1]].classList.add('win')
		this.refs[set[2]].classList.add('win')
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
			this.addWinClass()

			TweenMax.killAll(true)
			TweenMax.from('td.win', 1, { opacity: 0, ease: Linear.easeIn })

			this.setState({
				game_stat: (cell_vals[set[0]] == 'x' ? 'You' : 'Opponent') + ' win',
				game_play: false
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
		this.socket && this.socket.disconnect();
		this.props.onEndGame()
	}
}
