import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

// Based on:
// https://github.com/fraserxu/react-dropdown/blob/master/index.js

class DropdownBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
    }
    this.mounted = true
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick, false)
    document.addEventListener('touchend', this.handleDocumentClick, false)
  }

  componentWillUnmount () {
    this.mounted = false
    document.removeEventListener('click', this.handleDocumentClick, false)
    document.removeEventListener('touchend', this.handleDocumentClick, false)
  }

  handleMouseDown (event) {
    if (this.props.onFocus && typeof this.props.onFocus === 'function') {
      this.props.onFocus(this.state.isOpen);
    }
    if (event.type === 'mousedown' && event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();

    if (!this.props.disabled) {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }

  handleDocumentClick (event) {
    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        if (this.state.isOpen) {
          this.setState({ isOpen: false });
        }
      }
    }
  }

  render () {
    const { baseClassName, menuClassName, arrowClassName, className, 
      labelClassName, labelValue = "Menu" } = this.props
    const disabledClass = this.props.disabled ? 'Dropdown-disabled' : '';

    const dropdownClass = classNames({
      [`${baseClassName}-root`]: true,
      [className]: !!className,
      'is-open': this.state.isOpen
    });
    const labelClass = classNames({
      [`${baseClassName}-label`]: true,
      [labelClassName]: !!labelClassName
    });
    const menuClass = classNames({
      [`${baseClassName}-menu`]: true,
      [menuClassName]: !!menuClassName
    });
    const arrowClass = classNames({
      [`${baseClassName}-arrow`]: true,
      [arrowClassName]: !!arrowClassName
    });

    const value = (<div className={labelClass}>{labelValue}</div>)
    const menu = this.state.isOpen ? <div className={menuClass}>{this.props.children}</div> : null
    
    return (
      <div className={dropdownClass}>
        <div className={`${baseClassName}-control ${disabledClass}`} 
        onMouseDown={this.handleMouseDown} 
        onTouchEnd={this.handleMouseDown}>
          {value}
          <span className={arrowClass} />
        </div>
        {menu}
      </div>
    )
    return (
      <div className={dropdownClass}>value</div>
    )
  }
}

DropdownBox.defaultProps = { baseClassName: 'Dropdown' }
export default DropdownBox