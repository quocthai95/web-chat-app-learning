import React from 'react';

let Room = (props) => {
  return (
  <>
  <tr onClick={props.click}>
    <td>{props.roomName}</td>
    <td>{props.hostName}</td>
  </tr>
  </>
  )
}

export default Room;