import React from 'react';
import { baseURL } from '../shared/config';
import io from 'socket.io-client';
import axios from 'axios';
import Room from '../tpl/Room';

class Dashboard extends React.Component {
  state = {
    roomList : null,
    user: null
  }
  socket = io(baseURL + '/channel');

  // create new room
  createRoom = () => {
    let info = {
      roomId: document.getElementById('roomId').value,
      roomName: document.getElementById('roomName').value,
      host: this.props.location.state,
      messHistory: [],
      status: 'ACTIVED',
      activeUserList: {}
    };

    // emit create event to server
    this.socket.emit('room.create', info, this.state.user);

    // move to new chatroom when successfully create room
    this.socket.on('success', (data) => {
      this.props.history.push({pathname: '/chatroom', state: {
        roomInfo: info,user: this.state.user}})
    })

    // show error when create
    this.socket.on('fail', (data) => {
      alert(data.message);
    })
  }


  // join room by room id
  joinRoom = (id) => {
    // get room info
    axios.get(baseURL + '/room/' + id)
    .then((res) => {
      let info = {
        roomId: res.data.roomId,
        roomName: res.data.roomName,
        host: res.data.host,
        messHistory: [],
        status: res.data.status,
        activeUserList: res.data.activeUserList
      }

      // go to chat room by id
        this.props.history.push({pathname: '/chatroom',  state: {
          roomInfo: info,user: this.state.user}})
    })
  }

  componentWillMount = () => {
    // check login
    (() => {
      if (this.props.location.state) {
        console.log(this.props.location.state);

        // get room list
        axios.get(baseURL + '/room/getRoomList')
        .then((res) => {
          console.log(res.data);
          this.setState({
            roomList: res.data,
            user: this.props.location.state
          })
        })
      }
      else {
        this.props.history.replace({pathname: '/'});
      }
    })();
  }

  componentDidMount = () => {
    // not allow roomid has space 
    (() => {
      document.getElementById('roomId').addEventListener('keypress', (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          return false;
        }
      })
    })();
  }

  render() {

    // show room list
    let roomList = null;
    if (this.state.roomList) {
      roomList = (
        <>
        {
          Object.keys(this.state.roomList).map(room => {
            return <Room roomName={this.state.roomList[room].roomName}  hostName={this.state.roomList[room].host.username} key={this.state.roomList[room].roomId}  click={() => this.joinRoom(this.state.roomList[room].roomId)}/>
          })
        }
        </>
      )
    }
    return (
    <>
    <div className="table-responsive">
    <button className="btn btn-success" data-toggle="modal" data-target="#createRoom">Create Room</button>
    <table className="table table-hover table-bordered">
      <thead>
        <tr>
          <th scope="col">Room Name</th>
          <th scope="col">Host</th>
        </tr>
      </thead>
      <tbody>
        {roomList}
      </tbody>
    </table>  
    </div>
      <div className="modal fade" id="createRoom" tabIndex="-1" role="dialog" >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Create Room</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="nameRoom">Your Room Id</label>
                <input className="form-control" id="roomId"></input>
              </div>
              <div className="form-group">
                <label htmlFor="nameRoom">Your Room Name</label>
                <input className="form-control" id="roomName"></input>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" id="createRoomBtn" data-dismiss="modal" onClick={() => this.createRoom()}>Create</button>
            </div>
          </div>
        </div>
      </div>
    </>
    )
  }

}

export default Dashboard;