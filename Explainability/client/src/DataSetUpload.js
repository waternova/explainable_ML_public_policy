import React, { Component } from 'react';
import classNames from 'classnames';
//import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import './DataSetUpload.css'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('body')

class DataSetUpload extends Component {
  constructor (props)
    {
    super();

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    } openModal() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleSubmit(event) {
    event.preventDefault();
    //this.closeModal();
    return false;
  }

  render() {
    return (
      <div className="upload_button">
        <button className="toolbar" onClick={this.openModal}>Upload a Dataset...</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Upload a Dataset">
          <form method="post" action="api/dataset/" encType="multipart/form-data" onSubmit={(event) => { event.preventDefault(); } }>
            <label>Name</label><br/><input type="text" id="name" name="name" /> <br/> <br/>
            <label>Description</label><br/><input type="text" id="description" name="description" />  <br/> <br/>
            <input type="file" id="file" name="file" />  <br/> <br/>
            <input type="submit"/> <br/>
          </form>
          <button onClick={this.closeModal}>close</button>
        </Modal>
      </div>
    );
  }
}

export default DataSetUpload


