import React from 'react';
import Member from '../tpl/Member';
import socket from '../shared/socket';


class Chatroom extends React.PureComponent {
  state = {
    memberList: null
  }

  // create element to show message in UI
  newMessageDisplay = (element, nickname, mess, messColor='red') => {
    let p = document.createElement('p');
    p.innerHTML = `<font color="${messColor}">${nickname}</font>: ${mess}`;
    element.appendChild(p);
  } 

  constructor(props) {
    super(props);
    (() => {
      
      // check login
      if (this.props.location.state) {
        console.log(this.props.location.state);
        // emit new joiner to other sockets in room
        socket.emit('room.join', this.props.location.state.roomInfo, this.props.location.state.user);
        // react to failed join
        socket.on('failGetRoom', () => {
            alert('Room is removed!');
            console.log(this.props.location.state.user);
            this.props.history.replace('/dashboard', {state: this.props.location.state.user});
        })

        // get userActiveList 
        socket.on('reloadMember', (res) => {
            console.log(res.data);
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
          this.newMessageDisplay(document.getElementById('announce'), res.nickname, 'has joined room chat!');
        })

        // get new message
        socket.on('newMessage', (res) => {
          console.log(res);
          document.getElementById('feedback').innerHTML = '';
          this.newMessageDisplay(document.getElementById('chatroom'), res.user.nickname, res.message);
        })


        // react to someone leave room
        socket.on('someoneLeaveRoom', (res) => {
          this.newMessageDisplay(document.getElementById('announce'), res.user.nickname, 'has left room chat!');
        })

        // react to someone is typing
        socket.on('typing', (res) => {
          console.log(res.message);
          if(res.message)
          document.getElementById('feedback').innerHTML = `<b>${res.user.nickname}</b> <i>is typing a message<i>`
          else
          document.getElementById('feedback').innerHTML = '';
        });
      }
      else {
        this.props.history.replace({pathname: '/dashboard'});
      }
    })();
  }

  componentDidMount = () => {
    // emit that user is typing 
    document.getElementById('message').addEventListener('keyup', (e) => {
        socket.emit('typing', {
          user: this.props.location.state.user,
          message: document.getElementById('message').value
        });
    })
    socket.on('disconnect', (reason) => {
  
    console.log('disconnect ' + reason)
      // else the socket will automatically try to reconnect
      document.getElementById('loaderContainer').style.display = "block";
      });
    
    socket.on('reconnect', (attemptNumber) => {
      console.log('reconnect ' + attemptNumber)
      socket.emit('room.join', this.props.location.state.roomInfo, this.props.location.state.user);
      document.getElementById('loaderContainer').style.display = "none";
      });
    
    
    socket.on('reconnect_error', (error) => {
      console.log('err to reconnect ' + error)
      if(document.getElementById('loaderContainer').style.display === "" ||  document.getElementById('loaderContainer').style.display === "none")
      document.getElementById('loaderContainer').style.display = "block";
    });

    
  }

  componentWillUnmount = () => {
    // announce leaving room to others
    socket.emit('room.leave', this.props.location.state.user);
    console.log(socket);
    // remove event listeners when leave room
    socket.off("newMessage");
    socket.off("sendMessage");
    socket.off("reloadMember");
    socket.off("joined");
    socket.off("someoneLeaveRoom");
    socket.off("typing");
    socket.off("failGetRoom");
    socket.off("fail");
    socket.off("disconnect");
    socket.off("reconnect");
    socket.off("reconnect_error");
  }
  
  render() {
    
     // send message function
     let sendMessage = () => {
      // emit new message to room
      if(document.getElementById('message').value) {
        this.newMessageDisplay(document.getElementById('chatroom'), this.props.location.state.user.nickname, document.getElementById('message').value, 'blue');
        
        socket.emit('sendMessage', {
          message: document.getElementById('message').value,
          user: this.props.location.state.user
        })
        document.getElementById('message').value = '';
        
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