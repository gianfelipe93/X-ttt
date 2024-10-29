import React, { Component } from 'react'
import Button from '../../components/Button'

export default class SetName extends Component {

	constructor(props) {
		super(props)

		this.state = {
			name: ''
		}

		this.onNameTyped = this.onNameTyped.bind(this)
		this.saveName = this.saveName.bind(this)
	}

	onNameTyped(e) {
		this.setState({
			name: e.target.value
		})
	}

	//	------------------------	------------------------	------------------------

	render() {
		return (
			<div id='SetName'>
				<h1>Set Name</h1>
				<div ref='nameHolder' className='input_holder left'>
					<label>Name </label>
					<input onChange={this.onNameTyped} type='text' className='input name' placeholder='Name' />
				</div>
				<Button onClick={this.saveName} text='SAVE' />
			</div>
		)
	}

	//	------------------------	------------------------	------------------------

	saveName() {
		const { name } = this.state
		const { onSetName } = this.props

		onSetName(name)
	}
}