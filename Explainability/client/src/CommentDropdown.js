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
      factor_name: this.props.factor_name,
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
      id : null,
      user_name: this.state.user_name,
      comment_text: this.state.newComment,
      updated_datetime: new Date().toISOString(),
      factor_name: this.state.factor_name,
      model_id: this.state.model_id,
    }
    var comments_write = this.state.comments.slice();
    comments_write.push(newComment);
    this.setState({comments: comments_write});
    this.setState({newComment: ''});
    this.props.handleUpdateComments(comments_write);
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
    let comments = this.state.comments.map((comment, index) => {
      let dateString = new Date(comment.updated_datetime).toLocaleString();
      let id =  index + comment.factor_name;
      return (
        <li className="comment_dialog_item" key={id}>
          <strong>{comment.user_name}: </strong>
          {comment.comment_text} <br/>
          <em> ({dateString})</em>
        </li>
      );
    })
    return (
      <DropdownBox
        icon_class={this.props.icon_class}
        icon_url={this.props.icon_url}
        floating_text={this.state.comments.length > 0 ? this.state.comments.length : null}
        isOpen={this.state.isOpen}
        handleClose={this.handleClose}
        handleOpen={this.handleOpen}
        baseClassName='CommentDropdown'>
        <div className="modal_main">
          <ul>
          {comments}
          </ul>
          <form onSubmit={this.handleNewCommentAdd}>
            <div className="comment_dialog_user_label">Comment by</div>
            <input className="comment_dialog_user" id="username" name="username" value={this.state.user_name} onChange={this.handleUserChange}/>
            <br/>
            <label>
              <textarea className="comment_dialog_text" value={this.state.newComment} onChange={this.handleNewCommentChange} />
            </label>
            <br/>
            <div className="dialog_bottom_buttons">
              <input className="btn" name="comment_add" type="submit" value="Add" />
              <input className="btn" name="close" type="button" value="Close" onClick={this.handleClose} />
            </div>
          </form>
        </div>
      </DropdownBox>
    );
  }
}

export default CommentDropdown;
