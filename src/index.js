import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initializeApp } from 'firebase';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  databaseURL: 'https://king-street-crusade-2018.firebaseio.com',
  projectId: 'king-street-crusade-2018'
};

initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
