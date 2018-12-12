import React from 'react';

class Dashboard extends React.Component {
  
  createRoom = () => {
    this.props.history.push({pathname: '/chatroom'});
  }
  render() {
    return (
    <>
    <div className="table-responsive">
    <button className="btn btn-success" data-toggle="modal" data-target="#createRoom">Create Room</button>
    <table className="table table-hover table-bordered">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Room Name</th>
          <th scope="col">Host</th>
          <th scope="col">Members</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
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
                <label htmlFor="nameRoom">Your Name</label>
                <input className="form-control" id="userName"></input>
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