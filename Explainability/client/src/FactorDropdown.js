import React, { Component } from 'react';
import DropdownBox from './DropdownBox.js';
import './FactorDropdown.css';

class FactorDropdown extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleFactorFormSubmit = this.handleFactorFormSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleClose(event) {
    if (event) {event.preventDefault()}
    this.setState({isOpen: false});
  }

  handleOpen() {
    this.setState({isOpen: true});
  }

  handleFactorFormSubmit(event) {
    // Needs to close this dropdown before delegating to Row state
    event.preventDefault();
    this.handleClose();
    this.props.handleFactorFormSubmit(event);
  }

  render () {
    return (
      <DropdownBox 
      labelValue="..." 
      isOpen={this.state.isOpen} 
      handleClose={this.handleClose} 
      handleOpen={this.handleOpen}>
        <div>
          <form onSubmit={this.handleFactorFormSubmit}>
            <label className="labels">Factor Name </label> <br/>
            <input type="text" className="factor_name" id="name" name="name" defaultValue={this.props.originalName} readOnly="" />
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
            <input className="btn" name="cancel" type="button" value="Cancel" onClick={this.handleClose}></input>
            <input className="btn" name="apply" type="submit" value="Apply" />
          </form>
          <br/>
        </div>
      </DropdownBox>
    )
  }
}

FactorDropdown.defaultProps = { baseClassName: 'Dropdown' }
export default FactorDropdown