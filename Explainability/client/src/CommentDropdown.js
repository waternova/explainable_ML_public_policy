import React, { Component } from 'react';
import DropdownBox from './DropdownBox.js';

class CommentDropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comments: [],
      newComment: '',
      isOpen: false,
    };
    this.handleNewComment = this.handleNewComment.bind(this);
    this.handleNewCommentChange = this.handleNewCommentChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleNewComment(event) {
    event.preventDefault();
    const newComment = {
      username: 'User1',
      text: this.state.newComment,
      date: Date.now(),
    }
    this.setState({
      comments: this.state.comments.concat([newComment]),
      newComment: '',
    });
  }

  handleNewCommentChange(event) {
    this.setState({
      newComment: event.target.value,
    });
  }

  handleClose() {
    this.setState({isOpen: false});
  }

  handleOpen() {
    this.setState({isOpen: true});
  }

  render () {
    let comments = this.state.comments.map((comment) => {
      const dateString = new Date(comment.date).toString();
      return (
        <li key={comment.date}>
          <strong>{comment.username}: </strong>
          {comment.text}
          <em> ({dateString})</em>
        </li>
      );
    })
    return (
      <DropdownBox 
      labelValue="Comments" 
      isOpen={this.state.isOpen} 
      handleClose={this.handleClose} 
      handleOpen={this.handleOpen}>
        <div>
          <ul>
          {comments}
          </ul>
          <form onSubmit={this.handleNewComment}>
            <label>
              Your comment:
              <textarea value={this.state.newComment} onChange={this.handleNewCommentChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </DropdownBox>
    );
  }
}

export default CommentDropdown;
