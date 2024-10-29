
import React, { Component } from 'react'
import Button from '../../components/Button'
import useCurrentUser from '../../hooks/useCurrentUser';

export default class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: [],
      message: '',
    }

    this.sendMessage = this.sendMessage.bind(this)
    this.onMessageChange = this.onMessageChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount() {
    const { socket, currentUid } = this.props

    socket.emit('initializeChat', { currentUid })

    socket.on('newMessage', (msg) => {
      this.setState({
        messages: [...this.state.messages, msg]
      })
    })
  }

  scrollToBottom() {
    const chatMessages = document.querySelector('.chatMessages');

    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  sendMessage() {
    const { message } = this.state
    const { socket, currentUid } = this.props
    const { name } = useCurrentUser(['name'])

    socket.emit('newMessage', {
      userUid: currentUid,
      sender: name,
      message
    })

    this.setState({
      messages: this.state.messages,
      message: ''
    })
  }

  onMessageChange(e) {
    this.setState({
      messages: this.state.messages,
      message: e.target.value
    })
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }

  render() {
    const { currentUid } = this.props
    const { message } = this.state

    return (
      <div className='chatContainer'>
        <h1>Live chat</h1>
        <div className='chatMessages'>
          {this.state.messages.map((msg, i) => {
            return (
              <div key={i} className={msg.userUid === currentUid ? 'messageContainer self' : 'messageContainer'}>
                <strong className='messageUser'>{msg.sender}:</strong>
                <div className='textContainer'>
                  <div className='message'>{msg.message}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div ref={this.messagesEndRef} />
        <div className='newMessageContainer'>
          <input onKeyDown={this.handleKeyDown} type='text' className='newMessage' onChange={this.onMessageChange} placeholder='Type your message' value={message} />
          <Button text='Send' onClick={this.sendMessage} />
        </div>
      </div>
    )
  }
}
