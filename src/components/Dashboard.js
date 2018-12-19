import React from 'react';
import { baseURL } from '../shared/config';
import axios from 'axios';
import Room from '../tpl/Room';
import socket from '../shared/socket';

class Dashboard extends React.PureComponent {
  state = {
    roomList : null,
    user: null
  }

  _isMounted = false;

  constructor(props) {
    super(props);

    //declare accessible html elements
    this.roomIdInput = React.createRef();
    this.roomNameInput = React.createRef();

    // check login
    (() => {
      if (this.props.location.state) {
        console.log(this.props.location.state);
        
        // get room list
        axios.get(baseURL + '/room/getRoomList')
        .then((res) => {
          if(this._isMounted) {
            console.log(res.data);
            if(this.props.location.state.state)
            this.setState({
              roomList: res.data,
              user: this.props.location.state.state
            })
            else
            this.setState({
              roomList: res.data,
              user: this.props.location.state
            })
          }
        })
      }
      else {
        this.props.history.replace({pathname: '/'});
      }
    })();
    //reload room list
    socket.on('reloadRoomList', (res) => {
      if(this._isMounted) {
      console.log(res.roomList);
        this.setState({
          roomList: res.roomList
        })
      }

    })

  }

  // create new room
  createRoom = () => {
    let info = {
      roomId: this.roomIdInput.current.value,
      roomName: this.roomNameInput.current.value,
      host: this.props.location.state,
      messHistory: [],
      status: 'ACTIVED',
      activeUserList: {}
    };

    // emit create event to server
    socket.emit('room.create', info, this.state.user);
    socket.once('room.created', () => {
      console.log(socket);
      console.log(info );
      this.props.history.push({pathname: '/chatroom', state: {
      roomInfo: info,user: this.state.user}})
    })
    

    // show error when create
    socket.once('fail', (data) => {
      console.log(socket);
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
        messHistory: res.messHistory,
        status: res.data.status,
        activeUserList: res.data.activeUserList
      }

      // go to chat room by id
        this.props.history.push({pathname: '/chatroom',  state: {
          roomInfo: info,user: this.state.user}})
    })
  }


  componentDidMount = () => {
    this._isMounted = true;
    // not allow roomid has space 
    (() => {
      this.roomIdInput.current.addEventListener('keypress', (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          return false;
        }
      })
    })();
  }

  componentWillUnmount = () => {
    this._isMounted = false;
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
                <input className="form-control" id="roomId" ref={this.roomIdInput}></input>
              </div>
              <div className="form-group">
                <label htmlFor="nameRoom">Your Room Name</label>
                <input className="form-control" id="roomName" ref={this.roomNameInput}></input>
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