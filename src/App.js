import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import CommentsList from './components/CommentsList';
import './App.css';

function App() {
  return (
    <Provider store={store}>
    
      <div className="App">
        <CommentsList />
      </div>
      
    </Provider>
  );
}

export default App;

