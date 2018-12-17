import React from 'react';

let Member = (props) => {
  return (
  <>
  <p style={props.cssStyle}>{props.name}</p>
  </>
  )
}

export default Member;