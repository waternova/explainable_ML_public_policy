import React from 'react'
import AbstractDropdown from './AbstractDropdown.js'
import classNames from 'classnames'

// https://github.com/fraserxu/react-dropdown/blob/master/index.js

const DEFAULT_PLACEHOLDER_STRING = 'Comments'

class CommentDropdown extends AbstractDropdown {
  constructor (props) {
    super(props)
    this.state = {
      selected: props.value || {
        label: props.placeholder || DEFAULT_PLACEHOLDER_STRING,
        value: ''
      },
      isOpen: false,
      comments: [],
      newComment: '',
    }
    this.mounted = true
    this.handleDocumentClick = this.handleDocumentClick.bind(this)
    this.fireChangeEvent = this.fireChangeEvent.bind(this)
    this.handleNewComment = this.handleNewComment.bind(this)
    this.handleNewCommentChange = this.handleNewCommentChange.bind(this)
  }

  buildMenu () {
    let comments = this.state.comments.map((comment) => {
      console.log(comment);
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

  handleNewComment(event) {
    event.preventDefault();
    const newComment = {
      username: 'User1',
      text: this.state.newComment,
      date: Date.now(),
    }
    this.setState({
      selected: {label: DEFAULT_PLACEHOLDER_STRING, value: ''},
      isOpen: true,
      comments: this.state.comments.concat([newComment]),
      newComment: '',
    });
  }

  handleNewCommentChange(event) {
    this.setState({
      selected: {label: DEFAULT_PLACEHOLDER_STRING, value: ''},
      isOpen: true,
      comments: this.state.comments.slice(),
      newComment: event.target.value,
    });
  }

  render () {
    const { baseClassName, placeholderClassName, menuClassName, arrowClassName, className } = this.props

    const disabledClass = this.props.disabled ? 'Dropdown-disabled' : ''
    const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label

    const dropdownClass = classNames({
      [`${baseClassName}-root`]: true,
      [className]: !!className,
      'is-open': this.state.isOpen
    })
    const placeholderClass = classNames({
      [`${baseClassName}-placeholder`]: true,
      [placeholderClassName]: !!placeholderClassName
    })
    const menuClass = classNames({
      [`${baseClassName}-menu`]: true,
      [menuClassName]: !!menuClassName
    })
    const arrowClass = classNames({
      [`${baseClassName}-arrow`]: true,
      [arrowClassName]: !!arrowClassName
    })

    const value = (<div className={placeholderClass}>{placeHolderValue}</div>)
    const menu = this.state.isOpen ? <div className={menuClass}>{this.buildMenu()}</div> : null

    return (
      <div className={dropdownClass}>
        <div className={`${baseClassName}-control ${disabledClass}`} onMouseDown={this.handleMouseDown.bind(this)} onTouchEnd={this.handleMouseDown.bind(this)}>
          {value}
          <span className={arrowClass} />
        </div>
        {menu}
      </div>
    )
  }
}

CommentDropdown.defaultProps = { baseClassName: 'Dropdown' }
export default CommentDropdown