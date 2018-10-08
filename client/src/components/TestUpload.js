import React, { Component } from 'react';
import axios from 'axios';

/*
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  
const images = importAll(require.context('../uploads', false, /\.(png|jpe?g|svg)$/));
console.log(images);

let imgNames=[];
for (let keys in images) {
    imgNames.push(keys);
}
console.log(imgNames);
*/
/*
export default class TestUpload extends Component{

    state={
        selectedFile : ''
        //imgPath : images
    }
    fileSelected =(e) => {
        this.setState({selectedFile : e.target.files[0]});   
    }
    run = () => {
        console.log(this.state.selectedFile);
    }

    upload = () => {
		const data = new FormData();

		// If file selected
		if ( this.state.selectedFile ) {

			data.append( 'myImage', this.state.selectedFile, this.state.selectedFile.name );

            axios
                .post( '/upload', data, {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    }
                })
                .then(res => {
                    console.log(res.data);
                    this.setState({
                        imgPath: `../${res.data.file}`
                    })
                })
                .catch(err => console.log(err));
            }
    }

    render(){
        
        return(
          <div style={{paddingTop: '100px'}}>
            <input type='file' name='myImage' onChange={this.fileSelected} />
            <button onClick={this.upload} value='Upload'>Upload</button> 
            <img style={{width: '400px', height: 'auto'}} src={this.state.imgPath[imgNames[0]]} />
        </div>  
        );
        
        return(
            <div style={{paddingTop: '100px'}}>
                <form action='/upload' method='POST' enctype='multipart/form-data'>
                    <input type='file' name='myImage'/>
                    <button type='submit' value='Upload'>Upload</button>
                </form>
            </div>
        );
        
    }
}
*/