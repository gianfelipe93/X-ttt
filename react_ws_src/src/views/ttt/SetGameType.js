import React, { Component } from 'react'
import Button from '../../components/Button'

export default class SetGameType extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		const { onSetType } = this.props
		return (
			<div id='SetGameType'>
				<h1>Choose game type</h1>
				<Button onClick={() => onSetType('live')} text='Live against another player' />
				&nbsp;&nbsp;&nbsp;&nbsp;
				<Button onClick={() => onSetType('comp')} text='Against a computer' />
			</div>
		)
	}
}