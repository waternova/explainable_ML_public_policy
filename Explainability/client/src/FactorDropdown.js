import React from 'react'
import AbstractDropdown from './AbstractDropdown.js'
import classNames from 'classnames'
import './FactorDropdown.css';

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
    this.handleFactorFormSubmit = this.handleFactorFormSubmit.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
  }

  buildMenu () {
    // TODO: add Cancel button to reset description to original
    return (
      <div>
      <form onSubmit={this.handleFactorFormSubmit}>
        <label className="labels">Factor Name </label> <br/>
        <input type="text" className="factor_name" id="name" name="name" defaultValue={this.props.originalName} readonly="" />
        <br/><br/>
        <label className="labels">Alias </label> <br/>
        <input className="alias" id="alias" name="alias" defaultValue={this.props.alias} />
        <br/><br/>
        <label className="labels">Description </label>
        <textarea className="description" id="description" name="description" defaultValue={this.props.description} />
        <br/>
        <input id="is_binary" name="is_binary" type="checkbox" defaultChecked={this.props.is_binary} />
        <label className="labels">Binary Variable </label>
        <br/>
        <input id="is_enabled" name="is_enabled" type="checkbox" defaultChecked={this.props.is_enabled} />
        <label className="labels">Enabled </label>
        <br/> <br/>
        <button className="btn" name="cancel" onClick={this.closeDialog}>Cancel</button>
        <input className="btn" name="apply" type="submit" value="Apply" />
      </form>
      <br/>
      </div>
    );
  }

  closeDialog() {
    this.setState({ isOpen: false });
  }

  handleFactorFormSubmit(event) {
    // Needs to close this dropdown before delegating to Row state
    event.preventDefault();
    this.closeDialog();
    this.props.handleFactorFormSubmit(event);
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