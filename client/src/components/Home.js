import React from 'react';
import axios from 'axios';
import { Container, ListGroup, ListGroupItem } from 'reactstrap';
//import 'materialize-css/dist/css/materialize.min.css'
//import M from 'materialize-css'
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/Edit';
import Favorite from '@material-ui/icons/Favorite';
import Book from '@material-ui/icons/Book';
import AccountCircle from '@material-ui/icons/AccountCircle';

const listStyle = {
    margin: '0px',
    marginBottom: '20px',
    padding: '0px',
    //display: 'list-item',
    width: '56px',
    height: '56px',
    //padding: '10px',
    border: 'none',
    borderRadius: '50%',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.3)',
    //background: '#F44336',
    //transform: 'scale(0.1, 0.1)',
    transform: 'matrix(0.1, 0, 0, 0.1, 0, 30)',
    opacity : '0.1',    
    verticalAlign: 'middle',
    transition: '0.3s ease-out transform, 0.3s ease-out opacity'
}
const buttonStyle = {
    //color: '#fff', 
    color: 'rgb(33, 150, 243)',
    fontSize: '30px'
};
const floatingBlockStyle = {
    position: 'fixed', 
    right: '50px', 
    bottom: '30px', 
    textAlign: 'center'
};

const floatingButtonStyle = {
    height: '56px', 
    width: '56px', 
    border : 'none', 
    borderRadius: '50%', 
    textAlign:'center', 
    background: '#000', 
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.5)', 
    cursor: 'pointer'
}

const floatingOptionsStyle = { 
    visibility : 'hidden', 
    listStyleType : 'none', 
    padding: '0px', 
    margin:'0px', 
    position: 'absolute' , 
    bottom: '55px', 
    left:'0', 
    right:'0', 
    textAlign: 'center',
    verticalAlign: 'middle'
}

const cardMedia = {
    width : '100%'
}
const styles = theme => ({
    cardMedia : {
        width : '100%'
    }
})

function importAll(r) {
    let images = {};    
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  
  const images = importAll(require.context('../uploads', false, /\.(png|jpe?g|svg)$/));
  
  
  let imgNames=[];
  for (let keys in images) {
    imgNames.push(keys);
  }
  //console.log(images);
  //console.log(imgNames);


class Example extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            blogs: [],
            clickedBlogId : ''
        }
    } 

    clicked = (e) => {
        console.log('Coming from Home');
        console.log(e.target.parentNode.getAttribute('data'));
        this.props.blogId(e);
    }

    componentWillMount(){
       axios
            .get('/blogs')
            .then(res => {
                console.log(res.data);
                this.setState({
                blogs : res.data
                });
            })
            .catch(err => console.log('From Home request : '+ err));
        
    }

    menuEnter = () => {

        let floatingBlock = document.getElementById('floatingBlock');
        let floatingButton = document.getElementById('floatingButton');
        let list = document.getElementById('floatingOptions');
        //    console.log(list);
        let listitems = list.children;
        
        floatingBlock.addEventListener('mouseover', () => {
        //console.log('hovered');
        list.style.visibility = 'visible';
        //console.log(listitems);
        for(let i = 0; i < listitems.length; i++){
            //listitems[i].children[0].style.transform = 'scale(1,1)';
            listitems[i].children[0].children[0].style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
            listitems[i].children[0].children[0].style.opacity = '1';
            //console.log(listitems[i]);
        }
        });

    }
    menuLeave = () => {
        let floatingBlock = document.getElementById('floatingBlock');
        let floatingButton = document.getElementById('floatingButton');
        let list = document.getElementById('floatingOptions');
        //    console.log(list);
        let listitems = list.children;

        floatingBlock.addEventListener('mouseleave', () => {
            //console.log('works');
            
            for(let i = 0; i < listitems.length; i++){
                //listitems[i].children[0].style.transform = 'scale(0.1,0.1)';
                listitems[i].children[0].children[0].style.transform = 'matrix(0.1, 0, 0, 0.1, 0, 30)';
                listitems[i].children[0].children[0].style.opacity = '0.1';
                //console.log(listitems[i]);  
            }
            setTimeout( () => {
                list.style.visibility = 'hidden';
            }, 300);
            
            });
    }


  render() {

    const { classes } = this.props;
    
      let blogs = this.state.blogs;
      blogs.map(blog => {
        let temp = blog.body.split(' ').splice(0, 45);
        blog.body = temp.join(' ');
      });
      let search = this.props.getSearch; //from Navbar
      //let search = /this.state.search/;
      blogs = blogs.filter(blog => {
          let title = new RegExp(search, 'i');
          let result = [];
          result = blog.title.match(title);
          //console.log(result);
          if(result && result.length > 0){
            return blog;
          }
      })
    return (
        <div>
            <Container style={{width:'65vw'}}>
                {this.props.msg && <div className='alert alert-success'>{this.props.msg}</div>}
                <ListGroup>
                    {blogs.map(blog => 
                        <ListGroupItem key={blog._id}>
                        <Card>
                            <CardActionArea>
                                <CardMedia
                                classes={{
                                    root : classes.cardMedia,
                                    media : classes.cardMedia
                                }}  
                                image={images[blog.img]}
                                title={blog.title} style={{height:'200px'}}
                                />
                                <CardContent>
                                <Typography gutterBottom variant="headline" component="h2" style={{fontFamily: 'Brandon_reg'}}>
                                    {blog.title}
                                </Typography>
                                <Typography 
                                component="h1"
                                style={{fontFamily: 'Brandon_light', fontSize:'16px'}}>
                                    {blog.body}
                                </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" color="primary">
                                <span style={{fontFamily: 'Brandon_bld'}}>{blog.writer}</span>
                                </Button>
                                <Button size="small" 
                                color="primary"
                                data={blog._id}
                                onClick={this.clicked}
                                href='/viewblog'>
                                Read More
                                </Button>
                            </CardActions>
                        </Card> 
                        </ListGroupItem>
                       
                    )}
                </ListGroup>
            </Container>
            <div id='floatingBlock' style={floatingBlockStyle}>
            <button onMouseOver = {this.menuEnter} onMouseLeave={this.menuLeave} id='floatingButton' style={floatingButtonStyle} ><AccountCircle style={buttonStyle} /></button>
            <ul id='floatingOptions' style={floatingOptionsStyle}>
                <li ><a href="/"><button style={{...listStyle, background: '#000'}} ><Book style={buttonStyle} /></button></a></li>
                <li ><a href="/"><button style={{...listStyle, background: '#000'}} ><Favorite style={buttonStyle} /></button></a></li>
                <li ><a href="/newblog"><button style={{...listStyle, background: '#000'}}><Edit style={buttonStyle} /></button></a></li>
                    {/*insert, format, publish, attach*/}
            </ul>

            </div>
        </div>
      
    );
  }
}

Example.propTypes = {
    classes: PropTypes.object.isRequired
  };


export default withStyles(styles)(Example);