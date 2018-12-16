import React from 'react';
import io from 'socket.io-client';
import { baseURL } from '../shared/config';
import Member from '../tpl/Member';

class Chatroom extends React.Component {
  state = {
    memberList: null
  }
  socket = io(baseURL + '/channel');
  componentWillMount = () => {
    (() => {

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
      this.socket.on('fail', (data) => {
        alert(data.message);
      })

      // react to new joiner
      this.socket.on('joined', (res) => {
        console.log(res);
        let p = document.createElement('p');
        p.innerHTML = `<font color="red">${res.nickname}</font> has joined room chat! Please greeting them`;
        document.getElementById('announce').appendChild(p);
      })
      }
      else {
        this.props.history.replace({pathname: '/'});
      }
    })();
  }

  
  render() {

    // show members in room
    let memberList = null;
    if (this.state.memberList) {
      memberList = (
        <>
        {
          Object.keys(this.state.memberList).map(member => {
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
      <button id="send_message" className="btn btn-primary m-0" type="button">Send</button>
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