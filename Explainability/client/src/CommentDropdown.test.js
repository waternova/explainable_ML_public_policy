import React from 'react';
import ReactDOM from 'react-dom';
import CommentDropdown from './CommentDropdown.js';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('should render without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CommentDropdown />, div);
});

it('should add a new comment on handleNewComment', () => {
  const div = document.createElement('div');
  const commentDropdown = ReactDOM.render(<CommentDropdown />, div);
  commentDropdown.setState({newComment: 'a comment'});
  commentDropdown.handleNewComment(new MouseEvent('click'));
  expect(commentDropdown.state.comments.length).toBe(1);
  expect(commentDropdown.state.comments[0].text).toBe('a comment');
});

it('should add a two new comments on handleNewComment', () => {
  const div = document.createElement('div');
  const commentDropdown = ReactDOM.render(<CommentDropdown />, div);
  commentDropdown.setState({newComment: 'a comment'});
  commentDropdown.handleNewComment(new MouseEvent('click'));
  commentDropdown.setState({newComment: 'another comment'});
  commentDropdown.handleNewComment(new MouseEvent('click'));
  expect(commentDropdown.state.comments.length).toBe(2);
  expect(commentDropdown.state.comments[1].text).toBe('another comment');
});
