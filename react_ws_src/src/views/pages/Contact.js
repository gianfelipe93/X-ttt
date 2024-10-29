import React, { Component } from 'react'
import superagent from 'superagent'

import PopUp from '../layouts/PopUp'
import validator from 'validator'
import Button from '../../components/Button'
import FieldHolder from '../../components/FieldHolder'
import useCurrentUser from '../../hooks/useCurrentUser'

export default class Contact extends Component {

	constructor(props) {
		super(props)
		this.state = {
			unsent: true,
			sending: false,
			sent: false,
			sentErr: false,
			sentAttempt: false,
			nameValid: true,
			emailValid: true,
			subjectValid: true,
			messageValid: true,
			formData: {
				name: '',
				email: '',
				subject: '',
				message: ''
			}
		}

		this.handleChange = this.handleChange.bind(this)
		this.checkOnBlurr = this.checkOnBlurr.bind(this)
	}

	handleChange(event) {
		let tempState = this.state
		tempState.formData[event.target.name] = event.target.value

		this.setState(tempState);
	}

	render() {
		const { nameValid, emailValid, subjectValid, messageValid } = this.state

		const sendingCopy = (
			<div>I am sending your message over the wire.......... please hold.</div>
		)

		const sendingErr = (
			<div>There was an error sending your request. Please try again</div>
		)

		const sentCopy = (
			<div><strong>Okay we got your message, we will be touching base shortly.</strong></div>
		)

		const form = (
			<form id='contact_form'>
				<FieldHolder ref='nameHolder' goodClasses='input_holder left' badClass='error' isValid={nameValid}>
					<label>Name <span className='required'>is a required field</span></label>
					<input name='name' onChange={this.handleChange} type='text' className='input name' placeholder='Name' onBlur={this.checkOnBlurr} />
				</FieldHolder>

				<FieldHolder ref='emailHolder' goodClasses='input_holder left' badClass='error' isValid={emailValid}>
					<label>Email <span className='required'>is a required field</span></label>
					<input name='email' onChange={this.handleChange} type='email' className='input name' placeholder='Your Email' onBlur={this.checkOnBlurr} />
				</FieldHolder>

				<FieldHolder ref='subjectHolder' goodClasses='input_holder select_option' badClass='error' isValid={subjectValid}>
					<label>Subject <span className='required'>is a required field</span></label>
					<select name='subject' onChange={this.handleChange} onBlur={this.checkOnBlurr}>
						<option value=''>Choose one</option>
						<option>Join / Login</option>
						<option>An issue with the website</option>
						<option>Other</option>
					</select>
				</FieldHolder>

				<FieldHolder ref='messageHolder' goodClasses='input_holder clear message' badClass='error' isValid={messageValid}>
					<label>Message <span className='required'>is a required field</span></label>
					<textarea name='message' className='input textarea' onChange={this.handleChange} onBlur={this.checkOnBlurr}></textarea>
				</FieldHolder>

				<Button onClick={this.sendMessage.bind(this)} text='SEND' />
				<p className='disclaimer'>Any personal information collected in this contact form is so that we can send you the information you have requested. It will not be used for any other reason.</p>
			</form>
		)

		const { unsent, sending, sent, sentErr } = this.state

		return (
			<PopUp pageTitle='Contact Us'>
				{unsent && form}
				{sending && sendingCopy}
				{sent && !sentErr && sentCopy}
				{sent && sentErr && sendingErr}
			</PopUp>
		)
	}

	checkOnBlurr() {
		if (this.state.sentAttempt === false) return
		this.checkForm()
	}

	checkForm() {
		const { formData } = this.state
		let { name, email, subject, message } = formData

		const validName = name.length > 0
		const validEmail = validator.isEmail(email)
		const validSubject = subject.length > 0
		const validMessage = message.length > 0

		this.setState({
			nameValid: validName,
			emailValid: validEmail,
			subjectValid: validSubject,
			messageValid: validMessage
		})

		return validName && validEmail && validSubject && validMessage
	}

	sendMessage(e) {
		e.preventDefault()

		this.setState({ sentAttempt: true })

		// uncomment to test animation of states
		// if (true) {
		if (this.checkForm()) {
			// change the state of the form
			this.setState({
				unsent: false,
				sending: true
			})

			// get the form values
			const { formData } = this.state
			let { name, email, subject, message } = formData
			const { uid, login } = useCurrentUser(['uid', 'login'])

			superagent
				.post(app.settings.ws_conf.loc.SCRIPT_ROOT.u + app.settings.ws_conf.loc.SCRIPT__contact_form.u)
				.type('form')
				.send({
					uid: (app.settings.isLoggedIn ? uid : 0),
					login: (app.settings.isLoggedIn ? login : ''),
					nam: name,
					eml: email,
					sub: subject,
					mes: message
				})
				.end(function (err, res) {

					if (err || !res.ok) {
						console.log('something went wrong')
						this.setState({
							unsent: false,
							sending: false,
							sent: true,
							sentErr: true
						})
					} else {
						this.setState({
							unsent: false,
							sending: false,
							sent: true
						})
					}
				}.bind(this));
		}
	}
}