import React from 'react';

class Chatroom extends React.Component {
  
  render() {
    return (
      <div className="row">
      <div className="Chat col-7">
      <header>
      <h3>Room name</h3>
    </header>
    <section id="chatroom">
      <section id="feedback"></section>
    </section>

    <section id="input_zone"> 
      <input id="message" className="form-control" type="text" style= {{borderColor: 'black'}}/>
      <button id="send_message" className="btn btn-primary m-0" type="button">Send</button>
    </section>
    </div>
    <div className="Chat col-4">
      <header>
      <h3>Member</h3>
    </header>
    <section id="members">
    </section>
    </div>
    </div>
    )
  }
}

export default Chatroom;