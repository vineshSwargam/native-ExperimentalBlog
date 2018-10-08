import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import {Button, Typography, TextField} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Container } from 'reactstrap';
import axios from 'axios';
import '../App.css';


class UpdateBlog extends React.Component{
  constructor(props){
    super(props);
    this.state= {
      title : '',
      body : '',
      selectedImage : '',
      errors : [],
      redirect : false
    }
  }
  componentDidMount(){
    console.log(this.props.blogId);
    axios
      .get('/blog/'+this.props.blogId)
      .then(res => {
        console.log(res.data);
        this.setState({
        title : res.data.title,
        body : res.data.body
      });
      })
      .catch(err => console.log(this.props.blogId));
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
  
  publish = () => {
    //this.state.errors = '';
    const image = this.state.selectedImage;
    const type = ['image/jpeg', 'image/png'];
    if(this.state.title.length <=3 ||   
      this.state.body.length <=3){
      let errors = [];
      if(image !== ''){
        if(type.indexOf(image.type) === -1 ){
          errors.push('Upload Images Only!');
        }
        if(image.size >= 1000000){
          errors.push('Image File Size must be less than 1MB');
        }
      }
      if(this.state.title.length <= 3){
        console.log('Title');
        errors.push('Title must be more Descriptive');
      }
      if(this.state.body.length <= 3){
        console.log('Body');
        errors.push('Body must be more Descriptive');
      }
      this.setState({errors});
    }
    else{
      const data = new FormData();

			data.append('myImage', this.state.selectedImage, this.state.selectedImage.name);
      data.append('title', this.state.title);
      data.append('body', this.state.body);
        
      axios
        .post('/updateblog/'+ this.props.blogId, data, {headers: {'Content-Type': `multipart/form-data`}
        })
        .then(res => {
          console.log('Coming from Updateblog');
          
          if(res.status === 200 && res.data.status === 200){
            console.log(res.data);
            this.props.msg(res.data.msg);
            this.setState({redirect : true});
          }
          else{
            let validationError=[], key;
            for (key in res.data){
              validationError.push(res.data[key]);
            }
            this.setState({errors : validationError});
          }
        })
        .catch(err => console.log(err));
    }
    



    /////////////////
    

}
    

  render(){
    //const errorSection = 
    let renderErrors = '';
    if(this.state.errors){
      renderErrors = this.state.errors.map(error =><div key={error} className='alert alert-danger'>{error}</div>);
    }

    if(this.props.userId === ''){
      this.props.errorMsg('Please Login to update Blogs');
      return <Redirect to = '/login' />
    }

    if(this.props.userId === this.props.blogId){
      this.props.errorMsg("You're Unauthorized to edit this blog.")
      return <Redirect to = '/' />
    }
    if(this.state.redirect){
      return <Redirect to = '/' />
    }
      return(
      
        <Container>
          <Typography
            variant='display1'
            align='left'
            style={{color: '#333', marginBottom: '25px'}}>
            Update Blog
          </Typography>
          {renderErrors}
          <TextField
            required
            id='title'
            label="Title"
            value={this.state.title}
            onChange={this.handleChange}
            helperText="Title of your Blog"
            style = {{margin: '10px 0'}}
            fullWidth
          />
          <TextField
            required
            id='body'
            label="Body"
            value={this.state.body}
            onChange={this.handleChange}
            helperText="Content of your Blog"
            style = {{margin: '10px 0'}}
            multiline
            fullWidth
          />
          <div className='custom-file' style={{marginTop:'40px'}}>
            <input id='file' className='custom-file-input' type='file' name='myImage' onChange={this.selectedImage} />
            <label htmlFor='file' className='custom-file-label'>Choose File</label>
          </div>
          <Button variant="contained" style={{background:'#2196f3', color:'white', marginTop:'15px'}} onClick={this.publish}>
            Update and Publish
            <CloudUploadIcon style={{marginLeft:'5px'}}/>
          </Button>         
          </Container>  
        );
}
}

export default UpdateBlog;

/*
You're in UpdateBlog section.
Check if no image selected, then update keeps old image.
Add menu to viewBlog.(Edit, share, update, delete)
Accesscontrol. Only allow writer to update/delete.

*/
