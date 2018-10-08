import React, {Component} from 'react';
import {Button, Typography, TextField} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Container } from 'reactstrap';
import axios from 'axios';
import '../App.css';
import { Redirect } from 'react-router-dom';


// horse
//pw: cynical

class Register extends Component{
  state= {
    name : '',
    username : '',
    password : '',
    password2 : '',
    registered : false,
    errors : []
  }

  componentDidMount(){
    axios
      .get('/register')
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ 
      [e.target.id] : e.target.value
    });
  }

  register = () => {
    axios
      .post('/register', {...this.state})
      .then(res =>{
        if(res.status !== 200){
          let validationError=[], key;
          for (key in res.data){
            validationError.push(res.data[key].msg);
          }
          //console.log(res.data);
          this.setState({errors : validationError});
        }
        else{
          this.setState({registered : true});
          this.props.msg("You're now Registered. Please Login");
        }
      })
      .catch(err => console.log(`ERROR: ${err}`));
  }

  render(){
    const renderErrors = this.state.errors.map(error => <div className='alert alert-danger'>{error}</div>);
    
    if(this.state.registered){
      return <Redirect to='/login' />
    }
    
    return(
    <div>
      <Container style={{width : '50vw'}}>
      {renderErrors}
      <Typography
        variant='display1'
        align='left'
        style={{color: '#333', marginBottom: '25px'}}>
        Register
      </Typography>
      <TextField
        required
        id='name'
        name='name'
        label="Name"
        defaultValue={this.state.name}
        onChange={this.handleChange}
        helperText="Name will become your Author Label"
        style = {{margin: '10px 0'}}
        //margin="dense"
        //style={{width: '500px', borderColor: 'lightblue'}}
        fullWidth
      />
      <TextField
        required
        id='username'
        name='username'
        label="Username"
        defaultValue={this.state.username}
        onChange={this.handleChange}
        helperText="username will be used for your login"
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
        defaultValue={this.state.password}
        onChange={this.handleChange}
        helperText="Must contain something"
        type='password'
        style = {{margin: '10px 0'}}
        //margin="dense"
        //style={{width: '500px', borderColor: 'lightblue'}}
        fullWidth
      />
      <TextField
        required
        label="Password Again"
        name='password2'
        id='password2'
        defaultValue={this.state.password2}
        onChange={this.handleChange}
        helperText="Watch it"
        type='password'
        style = {{marginTop: '10px', marginBottom:'20px'}}
        //margin="dense"
        //style={{width: '500px', borderColor: 'lightblue'}}
        fullWidth
      />
      <Button variant="contained" style={{background:'#2196f3', color:'white', marginTop:'15px'}} onClick={this.register}>
        Register
        <CloudUploadIcon style={{marginLeft:'5px'}}/>
      </Button>  
      </Container>       
      </div>  
    );
  }
}

export default Register;