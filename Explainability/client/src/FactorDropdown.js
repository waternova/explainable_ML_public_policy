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
  }

  buildMenu () {
    // TODO: add Cancel button to reset description to original
    return (
      <div>
      <form onSubmit={this.props.saveNewDescription}>
        <div>Original Name: {this.props.originalName}</div>
        <label>Visible Name: </label><input value={this.props.visibleName} onChange={this.props.handleNewNameUpdate} />
        <label>Description: </label><textarea value={this.props.description} onChange={this.props.handleNewDescriptionUpdate} />
        <label>Is Binary Variable: </label><input type="checkbox" checked={this.props.isBinary} onChange={this.props.handleBinaryVarUpdate} />
        <input type="submit" value="Save" />
      </form>
      </div>
    );
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