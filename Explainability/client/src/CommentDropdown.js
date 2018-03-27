import React, { Component } from 'react';

class CommentDropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comments: [],
      newComment: '',
    };
    this.handleNewComment = this.handleNewComment.bind(this);
    this.handleNewCommentChange = this.handleNewCommentChange.bind(this);
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
    );
  }
}

export default CommentDropdown;
