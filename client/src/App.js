import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './components/Home';
import {Login} from './components/Login';
import Register from './components/Register';
import NewBlog from './components/AddBlog';
import UpdateBlog from './components/UpdateBlog';
import ViewBlog from './components/ViewBlog';



const Error = () => (<div style={{paddingTop: '100px'}}><strong>Error 404 : Get a better keyboard. This URL doesn't exist.</strong></div>);

/*
export function setAuthToken(token){
  if(token){
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  else{
    delete axios.defaults.headers.common['Authorization'];
  }
}

setAuthToken(localStorage.jwtToken);
*/

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }} />
  );
}

const PrivateRoute = ({ component, ...rest }) => (
  <Route {...rest} render={(props) => (
    localStorage.jwtToken
      ? renderMergedProps(component, props, rest)
      : <Redirect to='/login' />
  )} />
)


export default class App extends Component{

  constructor(props){
    super(props);
    this.state = {
      userId : '',
      viewBlogId : localStorage.viewBlogId || '',
      updateBlogId : '',
      search : '',
      errorMsg : '',
      successMsg : ''
    }   
  }

  
  componentWillMount(){
    if(this.state.userId === ''){
      axios
        .get('/loggeduser')
        .then(res => {
          if(res.status ===200){
            localStorage.removeItem('jwtToken');
            this.setState({userId : res.data});
          }
          
        })
        .catch(err => console.log(err));
    }
  }

  getSearch = (search) => {
    this.setState({search : search});
  }

  getUser = (userId) => {
    this.setState({userId : userId});
  }

  getBlogId = (e) => {
    let id = e.target.parentNode.getAttribute('data');
    localStorage.setItem('viewBlogId', id);
    //this.setState({viewBlogId : id});
    console.log(`Local Storage Id : ${localStorage.viewBlogId}`);
  }
  getUpdateBlogId = (id) => {
    //let id = e.target.parentNode.getAttribute('data');
    //localStorage.setItem('updateBlogId', id);
    this.setState({updateBlogId : id});
    console.log(`Local Storage Id : ${localStorage.updateBlogId}`);
  }
  getSucMsg = (msg) => {
   this.setState({successMsg : msg});
  }
  getErrMsg = (msg) => {
    this.setState({errorMsg : msg});
   }
    render(){
      return(          
          <BrowserRouter>
            <div> 
              <Navbar userId={this.state.userId} 
                      removeUser={this.getUser} 
                      getSearch = {this.getSearch}/>
              <Switch>

               <PropsRoute path='/' exact 
                          component={Home} 
                          blogId={this.getBlogId} 
                          msg={this.state.successMsg}
                          getSearch={this.state.search}/> 

                <PropsRoute path='/register' exact 
                          component={Register} 
                          msg={this.getSucMsg}/>

                <PropsRoute path='/login' exact 
                          component={Login} 
                          getUser={this.getUser} 
                          userId={this.state.userId}
                          msg={this.state.successMsg}
                          errorMsg={this.state.errorMsg}
                          getMsg={this.getSucMsg}/>

                <PropsRoute path='/newblog' exact 
                          component={NewBlog} 
                          msg={this.getSucMsg} 
                          errorMsg={this.getErrMsg}
                          userId={this.state.userId}/>

                <PropsRoute path='/updateblog' exact 
                          component={UpdateBlog} 
                          blogId={this.state.updateBlogId} 
                          msg={this.getSucMsg}
                          errorMsg={this.getErrMsg}
                          userId={this.state.userId}/>

                <PropsRoute path='/viewblog' exact 
                          component={ViewBlog} 
                          blogId={this.state.viewBlogId} 
                          getId={this.getUpdateBlogId} 
                          userId={this.state.userId}
                          msg={this.getSucMsg}
                          errorMsg={this.getErrMsg}/>

                <Route component={Error} />

              </Switch>
            </div>            
          </BrowserRouter>
        
      )
    }
};
