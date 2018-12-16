import React from 'react';
import './Login.css';
import userModel from '../model/user';
import axios from 'axios';
import { baseURL } from '../shared/config';

class Login extends React.Component {
  state = {
    user: userModel,
    access: false
  };

  // check account
  loginAuth = () => {
    axios.post(baseURL + '/user/checkAccount', {
      username: document.getElementById('userNameLogin').value,
      password: document.getElementById('passwordLogin').value
    })
    .then((res) => {
      if(!res.data)
      alert('Your username or password is not correct!')
      else {
        this.setState({
          user: {
            username : res.data.username,
            nickname : res.data.nickname,
            password : res.data.password 
          },
          access: true
        })  

        // go to dashboard
        this.props.history.push({pathname: '/dashboard', state: this.state.user});
      }
    })
  };


  // create new account
  createAccount = () => {
    this.setState({
      user : {
        username : document.getElementById('userName').value,
        nickname : document.getElementById('nickName').value,
        password : document.getElementById('password').value
      }
    },() => {
      axios.post(baseURL + '/user/createAccount', this.state.user)
    .then((res) => {
      if (res.data === 'EXISTED')
      alert('Username already has existed!');
    });
    })
    
  };

  componentDidMount = () => {
    // not allow username has space
    (() => {
      document.getElementById('userName').addEventListener('keypress', (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          return false;
        }
      })
    })();
  }

  render() {
    return (
    <>
      <div className="container Login">
      <div className="login-form">
      <div className="main-div">
    <div className="panel">
   <h2>Login</h2>
   <p>Please enter your username and password</p>
   </div>
    <form id="Login">

        <div className="form-group">


            <input type="text" className="form-control" id="userNameLogin" />

        </div>

        <div className="form-group">

            <input type="password" className="form-control" id="passwordLogin" />

        </div>
        <div className="forgot text-center">
        <p data-toggle="modal" data-target="#signUpForm">Sign Up</p>
</div>
        <button type="button" className="btn btn-primary" onClick={()=> this.loginAuth()}>Login</button>

    </form>
    </div>
</div></div>
<div className="modal fade" id="signUpForm" tabIndex="-1" role="dialog" >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Create Account</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="userName">Your Username</label>
                <input className="form-control" id="userName" ref="userName"></input>
              </div>
              <div className="form-group">
                <label htmlFor="nickName">Your Nickname</label>
                <input className="form-control" id="nickName"></input>
              </div>
              <div className="form-group">
                <label htmlFor="password">Your Password</label>
                <input className="form-control" id="password" type="password"></input>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" id="createUserBtn" data-dismiss="modal" onClick={() => this.createAccount()}>Create</button>
            </div>
          </div>
        </div>
      </div>
    </>
    )
  }
}

export default Login;