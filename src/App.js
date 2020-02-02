import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import './App.css';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const app = new Clarifai.App({
 apiKey: '373fba18ca184a2d9e62972dfdf89489'
});

const particlesOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}

class App extends Component {
  constructor () {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
    }
  }

  calculateFaceLocation = (data) => {
    const clarifai = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifai.left_col * width,
      topRow: clarifai.top_row * height,
      rightCol: width - (clarifai.right_col * width),
      bottomRow: height - (clarifai.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setstate({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    console.log(event.target.value);
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .then(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
          />
         <Navigation />
         <Logo />
         <Rank />
         <ImageLinkForm 
           onInputChange = {this.onInputChange} 
           onButtonSubmit={this.onButtonSubmit}
         />
         <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;