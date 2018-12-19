import React from 'react';
import Member from '../tpl/Member';
import socket from '../shared/socket';


class Chatroom extends React.Component {
  state = {
    memberList: null
  }

  _isMounted = false;
  
  // create element to show message in UI
  newMessageDisplay = (element, nickname, mess, messColor='red') => {
    let p = document.createElement('p');
    p.innerHTML = `<font color="${messColor}">${nickname}</font>: ${mess}`;
    element.appendChild(p);
  } 

  constructor(props) {
    super(props);
    (() => {
      
    //declare accessible html elements
    this.announce = React.createRef();
    this.chatroom = React.createRef();
    this.feedback = React.createRef();
    this.message = React.createRef();

      // check login
      if (this.props.location.state) {
        console.log(this.props.location.state);
        // emit new joiner to other sockets in room
        socket.emit('room.join', this.props.location.state.roomInfo, this.props.location.state.user);

        // get userActiveList 
        socket.on('reloadMember', (res) => {
          console.log(res.data);
          if(this._isMounted)
          this.setState({
            memberList: res.data
          })
        })

        // show err when fail to connect socket server
        socket.on('fail', (res) => {
          alert(res.message);
        })

        // react to new joiner
        socket.on('joined', (res) => {
          console.log(res);
          this.newMessageDisplay(this.announce.current, res.nickname, 'has joined room chat!');
        })

        // get new message
        socket.on('newMessage', (res) => {
          console.log(res);
          this.feedback.current.innerHTML = '';
          this.newMessageDisplay(this.chatroom.current, res.user.nickname, res.message);
        })


        // react to someone leave room
        socket.on('someoneLeaveRoom', (res) => {
          this.newMessageDisplay(this.announce.current, res.user.nickname, 'has left room chat!');
        })
      }
      else {
        this.props.history.replace({pathname: '/'});
      }
    })();
  }

  componentDidMount = () => {
    this._isMounted = true;
    // emit that user is typing 
    this.message.current.addEventListener('keyup', (e) => {
        socket.emit('typing', {
          user: this.props.location.state.user,
          message: this.message.current.value
        });
    })

    // react to someone is typing
    socket.on('typing', (res) => {
      console.log(res.message);
      if(res.message)
        this.feedback.current.innerHTML = `<b>${res.user.nickname}</b> <i>is typing a message<i>`
      else
      this.feedback.current.innerHTML = '';
    })
  }

  componentWillUnmount = () => {
    this._isMounted = false;
    socket.emit('room.leave', this.props.location.state.user);
  }
  
  render() {
     // send message function
     let sendMessage = () => {
      // emit new message to room
      if(this.message.current.value) {
        this.newMessageDisplay(this.chatroom.current, this.props.location.state.user.nickname, this.message.current.value, 'blue');
        
        socket.emit('sendMessage', {
          message: this.message.current.value,
          user: this.props.location.state.user
        })
        this.message.current.value = '';
        
      }
    }

    // show members in room
    let memberList = null;
    if (this.state.memberList) {
      memberList = (
        <>
        {
          Object.keys(this.state.memberList).map(member => {
            if(this.state.memberList[member].username === this.props.location.state.user.username) {
              return <Member cssStyle={{color: 'blue'}} key={this.state.memberList[member].username} name={this.state.memberList[member].nickname} />
            }
            else 
              return <Member key={this.state.memberList[member].username} name={this.state.memberList[member].nickname} />
          })
        }
        </>
      )
    }

    return (
      <div className="row">
      <div className="Chat col-6">
      <header>
      <h3>{this.props.location.state.roomInfo.roomName}</h3>
    </header>
    <section id="chatroom" ref={this.chatroom}>
      <section id="feedback" ref={this.feedback}></section>
    </section>

    <section id="input_zone"> 
      <input id="message" ref={this.message} className="form-control" type="text" style= {{borderColor: 'black'}}/>
      <button id="send_message" className="btn btn-primary m-0" type="button" onClick={()=> sendMessage('message')}>Send</button>
    </section>
    </div>
    <div className="Chat col-3">
      <header>
      <h3>Member</h3>
    </header>
    <section id="members">
      {memberList}
    </section>
    </div>
    <div className="Chat col-3">
      <header>
      <h3>Announce</h3>
    </header>
    <section id="announce" ref={this.announce}>
    </section>
    </div>
    </div>
    )
  }
}

export default Chatroom;