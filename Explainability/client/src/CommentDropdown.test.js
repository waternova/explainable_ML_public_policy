import React from 'react';
import ReactDOM from 'react-dom';
import CommentDropdown from './CommentDropdown.js';

it('should render without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CommentDropdown />, div);
});
