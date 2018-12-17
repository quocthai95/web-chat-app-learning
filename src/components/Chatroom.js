import React from 'react';
import io from 'socket.io-client';
import { baseURL } from '../shared/config';
import Member from '../tpl/Member';

class Chatroom extends React.Component {
  state = {
    memberList: null
  }
  // socket = io(baseURL + '/channel');
  socket = null;

  constructor(props) {
    super(props);
    (() => {
      this.socket = this.props.location.state.socket;
      // check login
      if (this.props.location.state) {
        console.log(this.props.location.state);

        // emit new joiner to other sockets in room
        this.socket.emit('room.join', this.props.location.state.roomInfo, this.props.location.state.user);

        // get userActiveList 
      this.socket.on('reloadMember', (res) => {
        console.log(res.data);
        this.setState({
          memberList: res.data
        })
      })

      // show err when fail to connect socket server
      this.socket.on('fail', (res) => {
        alert(res.message);
      })

      // react to new joiner
      this.socket.on('joined', (res) => {
        console.log(res);
        let p = document.createElement('p');
        p.innerHTML = `<font color="red">${res.nickname}</font> has joined room chat!`;
        document.getElementById('announce').appendChild(p);
      })

      // get new message
      this.socket.on('newMessage', (res) => {
        console.log(res);
        document.getElementById('feedback').innerHTML = '';
        let p = document.createElement('p');
        p.innerHTML = `<font color="red">${res.user.nickname}</font>: ${res.message}`;
        document.getElementById('chatroom').appendChild(p);
      })


      // react to someone leave room
      this.socket.on('someoneLeaveRoom', (res) => {
        let p = document.createElement('p');
        p.innerHTML = `<font color="red">${res.user.nickname}</font> has left room chat!`;
        document.getElementById('announce').appendChild(p);
      })
      }
      else {
        this.props.history.replace({pathname: '/'});
      }
    })();
  }

  componentDidMount = () => {
    document.getElementById('message').addEventListener('keyup', (e) => {
        this.socket.emit('typing', {
          user: this.props.location.state.user,
          message: document.getElementById('message').value
        });
    })

    this.socket.on('typing', (res) => {
      console.log(res.message);
      if(res.message)
        document.getElementById('feedback').innerHTML = `<b>${res.user.nickname}</b> <i>is typing a message<i>`
      else
      document.getElementById('feedback').innerHTML = '';
    })
  }

  componentWillUnmount = () => {
    this.socket.emit('room.leave', this.props.location.state.user);
  }
  
  render() {
     // send message function
     let sendMessage = (id) => {
      // emit new message to room
      if(document.getElementById(id).value) {
        let p = document.createElement('p');
        p.innerHTML = `<font color="blue">${this.props.location.state.user.nickname}</font>: ${document.getElementById(id).value}`;
        document.getElementById('chatroom').appendChild(p);
        this.socket.emit('sendMessage', {
          message: document.getElementById(id).value,
          user: this.props.location.state.user
        })
        document.getElementById(id).value = '';
        
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
    <section id="chatroom">
      <section id="feedback"></section>
    </section>

    <section id="input_zone"> 
      <input id="message" className="form-control" type="text" style= {{borderColor: 'black'}}/>
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
    <section id="announce">
    </section>
    </div>
    </div>
    )
  }
}

export default Chatroom;