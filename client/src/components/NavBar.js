import React, { Component, Fragment } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import axios from 'axios'
import {TextField} from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import classNames from 'classnames';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import purple from '@material-ui/core/colors/purple';
import blue from '@material-ui/core/colors/blue';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      color : blue
    },
    margin: {
      margin: theme.spacing.unit,
    },
    cssLabel: {
      '&$cssFocused': {
        //color: amber[500],
      },
    },
    cssFocused: {},
    cssUnderline: {
      '&:after': {

      },
    },
    cssColor : {
        color : '#fff',
        '&::placeholder': {
            color: 'white',
            opacity : 1
        }
    }    
  });


export class Navbar extends Component{
    constructor(props){
      super(props);
      this.state = {
        search : ''
      }
      
    }
    

    handleChange = (e) => { 
      this.setState({ search : e.target.value});
      this.props.getSearch(e.target.value);
    }

    logout = () => {
        localStorage.removeItem('jwtToken');
        axios
            .get('/logout')
            .then(res => {
                if(res.status === 200){
                  this.props.removeUser('');
                }
            })
            .catch(err => console.log(`Error in Navbar is ${err}`));
    }
    
    render(){
        const { classes } = this.props;
        return(
            <AppBar style={{background: '#000'}}>
                <Toolbar style={{display: 'flex', justifyContent : 'space-around', alingContent :'center '}}>
                <Typography variant='display1' align='center' style={{color:'#2196f3', fontFamily: 'Brandon_bld'}} >
                    <a href='/' id='name'>Native</a>
                </Typography>
                <div className={classes.margin}>
                    <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Search />
                    </Grid>
                    <Grid item>
                        <TextField 
                        id="input-with-icon-grid"
                        placeholder=' search'
                        InputProps={{
                            classes : {
                                root : classes.cssColor
                                
                            }
                        }}
                        InputLabelProps={{
                            shrink : true
                        }}
                        value={this.state.search}
                        onChange={this.handleChange} 
                        />
                    </Grid>
                    </Grid>
                </div>             
                             
                <ul style={{margin : '0', marginRight:'50px', color:'#666', fontSize:'17px', fontFamily: 'Muli'} }>
                    
                    {(this.props.userId !== '') ?
                        <li className='li-gap'><a href='/' onClick={this.logout}>Logout</a> </li> :
                        <Fragment>
                        <li className='li-gap'><a href='/login'>Login</a></li> 
                        <li className='li-gap'><a href='/register'>Register</a></li>
                        </Fragment>
                        
                    }
                </ul>                    
                </Toolbar>
                
            </AppBar>
        );
    }
    
}

Navbar.propTypes = {
    classes: PropTypes.object.isRequired
  };

export default withStyles(styles)(Navbar);