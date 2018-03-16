import React from 'react'
import AbstractDropdown from './AbstractDropdown.js'
import classNames from 'classnames'

// https://github.com/fraserxu/react-dropdown/blob/master/index.js

const DEFAULT_PLACEHOLDER_STRING = ''

class FactorDropdown extends AbstractDropdown {
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
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  buildMenu () {
    // TODO: add Cancel button to reset description to original
    return (
      <div>
      <form onSubmit={this.handleFormSubmit}>
        <div>Original Name: {this.props.originalName}</div>
        <label>Visible Name: </label><input name="newAlias" value={this.props.newAlias} onChange={this.props.handleFactorFormUpdate} />
        <label>Description: </label><textarea name="newDescription" value={this.props.newDescription} onChange={this.props.handleFactorFormUpdate} />
        <label>Is Binary Variable: </label><input name="newIsBinary" type="checkbox" checked={this.props.newIsBinary} onChange={this.props.handleFactorFormUpdate} />
        <br />
        <input type="submit" value="Update" />
      </form>
      </div>
    );
  }

  handleFormSubmit(event) {
    // Needs to close this dropdown before delegating to Row state
    event.preventDefault();
    this.setState({ isOpen: false });
    this.props.handleFormSubmit(event);
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

    const value = (<div className={placeholderClass}>{placeHolderValue}</div>)
    const menu = this.state.isOpen ? <div className={menuClass}>{this.buildMenu()}</div> : null

    return (
      <div className={dropdownClass}>
        <div className={`${baseClassName}-control ${disabledClass}`} onMouseDown={this.handleMouseDown.bind(this)} onTouchEnd={this.handleMouseDown.bind(this)}>
          {value}
        </div>
        {menu}
      </div>
    )
  }
}

FactorDropdown.defaultProps = { baseClassName: 'Dropdown' }
export default FactorDropdown