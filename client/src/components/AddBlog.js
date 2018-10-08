import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import {Button, Typography, TextField} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Container } from 'reactstrap';
import axios from 'axios';
import '../App.css';

//=============================================================

/*

let reload = false;

class NewBlog extends Component{

  constructor(props){
    super(props);
    this.state = {
      title : '',
      body : '',
      selectedImage : '',
      errors : [],
      submitted : false
    }
  }
  componentWillReceiveProps(){
    reload = true;
    console.log('Props Updated');
    this.setState({
      userId : this.props.userId
    });
  }
  

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ 
      [e.target.id] : e.target.value
    });
  }
  selectedImage = (e) => {
    this.setState({selectedImage : e.target.files[0]});
  }
  //Image Upload
  publish = () => {
    const data = new FormData();
    // If file selected
			data.append('myImage', this.state.selectedImage, this.state.selectedImage.name);
      data.append('title', this.state.title);
      data.append('body', this.state.body); 
        
      axios
        .post('/upload', data, {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
        })
        .then(res => {
          console.log('Coming from addblog');
          console.log(res.data);
          if(res.data.status === 200){
            this.props.msg(res.data); 
          }
          else{
            let validationError=[], key;
            for (key in res.data.errors){
              validationError.push(res.data.errors[key]);
            }
            this.setState({errors : validationError});
          }
        })
        .catch(err => console.log(err));

        

}

// The Effects of Nihilism on Humanity
//Streets of Venice
//Back Waters in Ireland
//A Look at Death Note
    

  render(){
    let renderErrors = '';
    if(this.state.errors){
      renderErrors = this.state.errors.map(error =><div className='alert alert-danger'>{error}</div>);
    }
    
    if((this.props.userId === '' && reload)){
      return <Redirect to='/login' />
    }
      return(
      
        <Container style={{width : '50vw'}}>
          <Typography
            variant='display1'
            align='left'
            style={{color: '#333', marginBottom: '25px'}}>
            Create Blog
          </Typography>
          {renderErrors}
          <TextField
            required
            id='title'
            label="Title"
            defaultValue={this.state.title}
            onChange={this.handleChange}
            helperText="Name will become your Author Label"
            style = {{margin: '10px 0'}}
            //margin="dense"
            //style={{width: '500px', borderColor: 'lightblue'}}
            fullWidth
          />
          <Typography
            variant='display1'
            align='left'
            style={{color: '#333', marginBottom: '25px'}}
          >{this.state.imgUploaded}
          </Typography>
          <TextField
            required
            id='body'
            label="Body"
            multiline
            defaultValue={this.state.body}
            onChange={this.handleChange}
            helperText="username will be used for your login"
            style = {{margin: '10px 0'}}
            //margin="dense"
            //style={{width: '500px', borderColor: 'lightblue'}}
            fullWidth
          />
          <div className='custom-file' style={{marginTop:'40px'}}>
            <input id='file' className='custom-file-input' type='file' name='myImage' onChange={this.selectedImage} />
            <label htmlFor='file' className='custom-file-label'>Choose File</label>
          </div>
          <br/>
          <Button variant="contained" style={{background:'#2196f3', color:'white', marginTop:'40px'}} onClick={this.publish}>
            Publish
            <CloudUploadIcon style={{marginLeft:'5px'}}/>
          </Button>         
          </Container>  
        );
}
}

export default NewBlog;
*/

let reload = false;

class NewBlog extends Component{

  constructor(props){
    super(props);
    this.state = {
      title : '',
      body : '',
      selectedImage : '',
      errors : [],
      submitted : false
    }
  }
  componentWillReceiveProps(){
    reload = true;
    this.setState({
      userId : this.props.userId
    });
  }
  

  handleChange = (e) => {
    this.setState({ 
      [e.target.id] : e.target.value
    });
  }
  selectedImage = (e) => {
    this.setState({selectedImage : e.target.files[0]});
  }

  formSubmit = (e) => { 
    e.preventDefault();      
    this.publish(this.state.selectedImage);    
    return false;
  
  }
  
  //Image Upload

  publish = (image) => {
    //console.log(image);
    const type = ['image/jpeg', 'image/png'];
    let errors = [];
    let i=0;

    if(this.state.title.length <= 3){
      console.log('Title');
      errors.push('Title must be more Descriptive');
      i++;
    }
    if(this.state.body.length <= 3){
      console.log('Body');
      errors.push('Body must be more Descriptive');
      i++;
    }  
    if(image === ''){
      console.log('Image not selected');
      errors.push('Please Select a Featured Image');
      i++;
    }
    else{
      if(type.indexOf(image.type) === -1 ){
        console.log('Image type');
        errors.push('Upload Images Only!');
        i++;
      }
      if(image.size >= 1000000){
        console.log('Body');
        errors.push('Image File Size must be less than 1MB');
        i++;
      }
    }
    if(i > 0) {
      this.setState({errors});
    }        
    else{
      
      console.log('entering form ')
      const data = new FormData();
    // If file selected
			data.append('myImage', image);
      data.append('title', this.state.title);
      data.append('body', this.state.body); 
        
      axios
          .post('/upload', data, {headers: {'Content-Type': `multipart/form-data`}})
          .then(res => {
            console.log('Coming from addblog');
            
            if(res.status === 200 && res.data.status === 200){
              console.log(res.status);
              console.log(res.data.status);
              this.props.msg(res.data);
              window.location.href = 'http://localhost:3000/';
            }
          })
          .catch(err => console.log(err));
    }
    
  }

    

// The Effects of Nihilism on Humanity
//Streets of Venice
//Back Waters in Ireland
//A Look at Death Note
    

  render(){
    let renderErrors = '';
    if(this.state.errors){
      renderErrors = this.state.errors.map(error =><div key={error} className='alert alert-danger'>{error}</div>);
    }
    
    if((this.props.userId === '' && reload)){
      this.props.errorMsg('Please Login to Write your own Blog');
      return <Redirect to='/login' />
    }
      return(
      
        <Container style={{width : '50vw'}}>
        <form
        onSubmit={this.formSubmit}>
          <Typography
            variant='display1'
            align='left'
            style={{color: '#333', marginBottom: '25px'}}>
            Create a Blog
          </Typography>
          {renderErrors}
          <TextField
            required
            id='title'
            name='title'
            label="Title"
            defaultValue={this.state.title}
            onChange={this.handleChange}
            helperText="Title of your Blog"
            style = {{margin: '10px 0'}}
            fullWidth
          />
          <TextField
            required
            name='body'
            id='body'
            label="Body"
            multiline
            defaultValue={this.state.body}
            onChange={this.handleChange}
            helperText="Content of your Blog"
            style = {{margin: '10px 0'}}
            //margin="dense"
            //style={{width: '500px', borderColor: 'lightblue'}}
            fullWidth
          />
          {//<input type='file' name='myImage' onChange={this.selectedImage} />
          }
          <div className='custom-file' style={{marginTop:'40px'}}>
            <input id='file' className='custom-file-input' type='file' name='myImage' onChange={this.selectedImage} />
            <label htmlFor='file' className='custom-file-label'>Choose File</label>
          </div>
          <br/>
          <Button variant="contained" style={{background:'#2196f3', color:'white', marginTop:'40px'}} type='submit'>
            Publish
            <CloudUploadIcon style={{marginLeft:'5px'}}/>
          </Button>   
          </form>      
          </Container>  
        );
}
}

export default NewBlog;