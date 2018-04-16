import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

// Based on:
// https://github.com/fraserxu/react-dropdown/blob/master/index.js

class DropdownBox extends Component {
  constructor (props) {
    super(props);
    this.mounted = true;
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
      this.props.onFocus(this.props.isOpen);
    }
    if (event.type === 'mousedown' && event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();

    if (!this.props.disabled) {
      if (this.props.isOpen) {
        this.props.handleClose();
      } else {
        this.props.handleOpen();
      }
    }
  }

  handleDocumentClick (event) {
    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        if (this.props.isOpen) {
          this.props.handleClose();
        }
      }
    }
  }

  render () {
    const { baseClassName, menuClassName, arrowClassName, className, 
      labelClassName, labelValue } = this.props
    const disabledClass = this.props.disabled ? 'Dropdown-disabled' : '';

    const dropdownClass = classNames({
      [`${baseClassName}-root`]: true,
      [className]: !!className,
      'is-open': this.props.isOpen
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

    const value = (labelValue !=null ? <div className={labelClass}>{labelValue}</div> : "");
    const menu = this.props.isOpen ? <div className={menuClass}>{this.props.children}</div> : null
    const icon_custom = (this.props.icon_url != null ?
      <img className={this.props.icon_class} src={this.props.icon_url} alt=""/> :
      <div>_<span className={arrowClass}></span></div>);
    const icon_text = (this.props.floating_text != null ?
      <div className="overlay_text">{this.props.floating_text}</div> : "");
    return (
      <div className={dropdownClass}>
        <div className={`${baseClassName}-control ${disabledClass}`} 
        onMouseDown={this.handleMouseDown} 
        onTouchEnd={this.handleMouseDown}>
          {value}
          <div className="overlay_ground">
            {icon_custom}
            {icon_text}
          </div>
        </div>
        {menu}
      </div>
    )
  }
}

DropdownBox.defaultProps = { baseClassName: 'Dropdown' }
export default DropdownBox