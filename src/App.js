import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      file: '',
      filename: '',
      filetype: '',
      img: '',
    };

    this.handlePhoto = this.handlePhoto.bind(this);
    this.sendPhoto = this.sendPhoto.bind(this);
  }

  // this is the event handler for the file input field
  handlePhoto(event) {
    // this makes a generic file reader that an convert files into strings that allows us to upload it to a server.
    const reader = new FileReader();
    // the file itself is located here
    const file = event.target.files[0];

    // this is an event handeler and will not actaully run untill the code on line 39 finishes running
    reader.onload = photo => {
      // the photo param here is the processed image from the reader.
      this.setState({
        file: photo.target.result,
        filename: file.name,
        filetype: file.type,
        img: '',
      });
    };
    // take the file from the input field and process it at a DataURL (a special way to interpret files)
    reader.readAsDataURL(file);
  }

  // when clicked it upload
  sendPhoto(event) {
    return axios.post('/api/s3', this.state).then(response => {
      this.setState({ img: response.data.location });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <input type="file" id="real" onChange={this.handlePhoto} />
        <button onClick={this.sendPhoto}>upload</button>
        <div>
          <img src={this.state.img} alt="none" />
        </div>
      </div>
    );
  }
}

export default App;
