import React, {Component} from 'react';
import {Button, Typography, TextField} from '@material-ui/core';
import { Container } from 'reactstrap';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import {Redirect} from 'react-router-dom';
//import {setAuthToken} from '../App';
//import jwt from 'jsonwebtoken';
import Card from '@material-ui/core/Card';

library.add(faSignInAlt);

 export class Login extends Component{
   state = {
     username: '',
     password: '',
     errors : [],
     msg : '',
     loggedIn : false
   }

   componentWillMount(){
     this.setState({
       msg : this.props.msg
     })
   }
  
   
  login = () => {
    axios
      .post('/login', {...this.state})
      .then(res => {
        //const token = res.data.token;
        //localStorage.setItem('jwtToken', token);
        console.log(res.data);
        //SETTING AUTHORIZATION TOKEN
        //setAuthToken(token);
        //console.log(jwt.decode(token));
        //console.log(res);
        if(res.data.status === 200){
          //this.setState({loggedIn : true});
          this.props.getUser(res.data.user);
          this.props.getMsg("You're now Logged in!");
        }
        else if(res.data.status === 400){
          
          let validationError=[], key;
          for (key in res.data.errors){
            validationError.push(res.data.errors[key].msg);
          }
          this.setState({errors : validationError});
        }
        else {
          this.setState({
            errors : [res.data.errors]
          });
        }
      })
      .catch(err => console.log(err));

  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ 
      [e.target.id] : e.target.value
    });
  }


  render(){
    if(this.props.userId){
      return <Redirect to='/' />;
    }
    else{
      let renderMessages = '';
      
      if(this.state.errors){
        renderMessages = this.state.errors.map(error =><div className='alert alert-danger'>{error}</div>);
      }
      if(this.props.msg !== ''){
        renderMessages = <div className='alert alert-success'>{this.props.msg}</div>
      }
      if(this.props.errorMsg !== ''){
        renderMessages = <div className='alert alert-danger'>{this.props.errorMsg}</div>
      }
      return(      
        <Container style={{
          width: '35vw', 
          marginTop: '75px'
          }}>
        {renderMessages}
        <Card style={{padding : '30px'}}>
        <Typography
          variant='display1'
          align='left'
          style={{color: '#333', marginBottom: '25px'}}>
          Login
        </Typography>
        <TextField
          required
          label="Username"
          id='username'
          name='username'
          onChange={this.handleChange}
          defaultValue=""
          helperText="Enter your username"
          style = {{margin: '10px 0'}}
          //margin="dense"
          //style={{width: '500px', borderColor: 'lightblue'}}
          fullWidth
        />
        <TextField
          required
          label="Password"
          id='password'
          name='password'
          onChange={this.handleChange}
          defaultValue=""
          helperText="Enter Your Password"
          type='password'
          style = {{margin: '10px 0'}}
          //margin="dense"
          //style={{width: '500px', borderColor: 'lightblue'}}
          fullWidth
        />
        <Button variant="contained" onClick={this.login} style={{background:'#2196f3', color:'white', marginTop:'25px'}}>
          Login
          <FontAwesomeIcon style={{marginLeft:'5px'}} icon="sign-in-alt" />
        </Button>
        </Card>
        </Container> 
      );
    }

  }
 }