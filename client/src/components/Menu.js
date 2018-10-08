import React from 'react';
import Edit from '@material-ui/icons/Edit';
import Publish from '@material-ui/icons/Publish';
import Attachment from '@material-ui/icons/Attachment';
import Pages from '@material-ui/icons/Pages';
import Share from '@material-ui/icons/Share';
import Delete from '@material-ui/icons/Delete';



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


export class Menu extends React.Component{

    constructor(props){
        super(props);
    }

    edit = () => {
        //console.log(e.target.parentNode);
       //let id = document.getElementById('blogUpdateId').getAttribute('data');
       //console.log(id);
       this.props.edit();
    }

    delete = () => {
        this.props.delete();
    }
    menuEnter = () => {

        let floatingBlock = document.getElementById('floatingBlock');
        let floatingButton = document.getElementById('floatingButton');
        let list = document.getElementById('floatingOptions');
        //    console.log(list);
        let listitems = list.children;
        
        floatingBlock.addEventListener('mouseover', () => {
        console.log('hovered');
        list.style.visibility = 'visible';
        //console.log(listitems);
        for(let i = 0; i < listitems.length; i++){
            //listitems[i].children[0].style.transform = 'scale(1,1)';
            listitems[i].children[0].style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
            listitems[i].children[0].style.opacity = '1';
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
            console.log('works');
            
            for(let i = 0; i < listitems.length; i++){
                //listitems[i].children[0].style.transform = 'scale(0.1,0.1)';
                listitems[i].children[0].style.transform = 'matrix(0.1, 0, 0, 0.1, 0, 30)';
                listitems[i].children[0].style.opacity = '0.1';
                //console.log(listitems[i]);  
            }
            setTimeout( () => {
                list.style.visibility = 'hidden';
            }, 300);
            
            });
    }
    render(){
        return(
            <div id='floatingBlock' style={floatingBlockStyle}>
            <button onMouseOver = {this.menuEnter} onMouseLeave={this.menuLeave} id='floatingButton' style={floatingButtonStyle} ><Pages style={buttonStyle} /></button>

            {((this.props.author === this.props.userId) && (this.props.userId !== '') ) ? 
            <ul id='floatingOptions' style={floatingOptionsStyle}>
                <li ><button onClick = {this.delete} style={{...listStyle, background: '#000'}} ><Delete style={buttonStyle} /></button></li>
                <li ><button style={{...listStyle, background: '#000'}} ><Share style={buttonStyle} /></button></li>
                <li ><button type='button'  id='blogUpdateId' onClick={this.edit} data = {this.props.blogId} style={{...listStyle, background: '#000'}}><Edit style={buttonStyle} /></button></li>
                
                    {/*insert, format, publish, attach*/}
            </ul> :
            <ul id='floatingOptions' style={floatingOptionsStyle}>
                
                <li ><button style={{...listStyle, background: '#000'}} ><Share style={buttonStyle} /></button></li>
                    {/*insert, format, publish, attach*/}
            </ul>
            }

            </div>
        )
    }
}