import React, { Component } from 'react';
import DropdownBox from './DropdownBox.js';
import './common.css';
import './CommentDropdown.css';

class CommentDropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      model_id: this.props.model_id,
      comments: this.props.comments,
      newComment: '',
      user_name: 'Anonymous',
      isOpen: false,
    };
    this.handleNewCommentAdd = this.handleNewCommentAdd.bind(this);
    this.handleNewCommentChange = this.handleNewCommentChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleNewCommentAdd(event) {
    event.preventDefault();
    const newComment = {
      model_id: this.state.model_id,
      user_name: this.state.user_name,
      comment_text: this.state.newComment,
      updated_datetime: Date.now(),
    }
    this.setState({
      comments: this.state.comments.concat([newComment]),
      newComment: '',
    });
    this.props.handleUpdateComments(this.state.comments);
  }

  handleNewCommentChange(event) {
    this.setState({
      newComment: event.target.value,
    });
  }

  handleUserChange(event) {
    this.setState({
      user_name: event.target.value,
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
      const dateString = new Date(comment.updated_datetime).toLocaleString();
      return (
        <li className="comment_dialog_item" key={comment.id}>
          <strong>{comment.user_name}: </strong>
          {comment.comment_text} <br/>
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
          <form onSubmit={this.handleNewCommentAdd}>
            <label>
              Comment by&nbsp;
              <input className="comment_dialog_user" id="username" name="username" value={this.state.user_name} onChange={this.handleUserChange}/>
            </label>
            <br/>
            <label>
              Your comment:
              <textarea className="comment_dialog_text" value={this.state.newComment} onChange={this.handleNewCommentChange} />
            </label>
            <input className="btn" name="close" type="button" value="Close" onClick={this.handleClose} />
            <input className="btn" name="comment_add" type="submit" value="Add" />
            <br/>
          </form>
        </div>
      </DropdownBox>
    );
  }
}

export default CommentDropdown;
