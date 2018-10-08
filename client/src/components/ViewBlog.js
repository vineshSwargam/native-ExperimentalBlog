import React from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import { Container, ListGroup, ListGroupItem } from 'reactstrap';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { Menu } from './Menu';

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
 

export default class Example extends React.Component {
    state={
        blog: '',
        liked: false,
        deleted : false,
        edit : false
    }
    edit = () => {
        this.props.getId(this.props.blogId);
        this.setState({edit : true});
    }
    like = () => {
        this.setState({liked : !this.state.liked});
    }
    componentDidMount(){
        axios
            .get('/viewblog/'+this.props.blogId)
            .then(res => {
                console.log(res.data);
                this.setState({
                    blog : res.data
                })
            })
            .catch(err => console.log(err));
    }
    deleteBlog = () => {
        axios
            .delete('/deleteblog/'+this.props.blogId)
            .then(res => {
                console.log(res.data);
                if(res.status === 200){
                    this.props.msg(res.data);
                    this.setState({deleted : true});
                }
                
            })
            .catch(err => console.log(err));
    }

  render() {
      let blog = this.state.blog;
    if(this.state.deleted){
        return <Redirect to='/' />
    }
    if(this.state.edit){
        return <Redirect to='/updateblog' />
    }
    return (
        <div>
            <Container style={{width:'65vw'}}>
            <ListGroup>
                <ListGroupItem>
                    <Card>
                        <CardActionArea>
                            <CardMedia
                            image={images[blog.img]}
                            title="Contemplative Reptile" style={{height:'400px'}}
                            />
                            <CardContent style={{cursor: 'default'}}>
                            <Typography gutterBottom variant="headline" 
                            component="h2"
                            style={{fontFamily: 'Brandon_reg'}}>
                                {blog.title}
                            </Typography>
                            <Typography component="h1" 
                            style={{fontFamily: 'Brandon_light'}}>
                                {blog.body}
                            </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" 
                                color="primary"
                                data={blog._id}
                                onClick={this.like}
                            >{(this.state.liked) ? <Favorite /> : <FavoriteBorder />}               
                            </Button>
                            <Button size="small" 
                                color="primary"
                                data={blog._id} 
                                onClick={this.edit}
                                href='/blogger'
                                style={{fontFamily: 'Brandon_reg'}}
                            >{blog.writer}                        
                            </Button>
                            {/*
                            { (this.state.blog.author === this.props.userId) ? 
                            <Button size="small" 
                            color="primary"
                            data={blog._id} 
                            onClick={this.edit}
                            href='/updateblog'>
                            Edit
                            </Button> :
                            <Button size="small" 
                            color="primary"
                            data={blog._id} 
                            onClick={this.edit}
                            href='/updateblog'
                            disabled>
                            Edit
                            </Button>
                            }
                            */
                        }
                        </CardActions>
                    </Card> 
                </ListGroupItem>
            </ListGroup>
            </Container>
            <Menu 
                blogId = {blog._id} 
                edit = {this.edit} 
                delete = {this.deleteBlog} 
                userId = {this.props.userId} 
                author = {this.state.blog.author}/>
        </div>
      
    );
  }
}