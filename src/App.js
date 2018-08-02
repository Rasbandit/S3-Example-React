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

  handlePhoto(event) {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = photo => {
      this.setState({
        file: photo.target.result,
        filename: file.name,
        filetype: file.type,
        img: '',
      });
    };
    reader.readAsDataURL(file);
  }

  sendPhoto(event) {
    event.preventDefault();

    return axios.post('/api/s3', this.state).then(({ data: { Location: img } }) => {
      this.setState({ img });
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
