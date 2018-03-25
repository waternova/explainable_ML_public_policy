import React, { Component } from 'react';
import classNames from 'classnames';
//import ReactDOM from 'react-dom';
import Modal from 'react-modal';

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

//Modal.setAppElement('#datasetfile')

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
    alert("done.");
//    console.log("sss??????");
  }

  render() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Upload a Dataset"
        >

          <form method="post" action="api/dataset/" enctype="multipart/form-data" onSubmit={this.handleSubmit}>
            <label>Name</label><input type="text" id="name" name="name" /> <br/>
            <label>Description</label><input type="text" id="description" name="description" />  <br/>
            <label>Time</label><input type="datetime-local" id="modified" name="modified" /> <br/>
            <input type="file" id="content" name="content" />  <br/>
            <label> </label><input type="submit"/>
          </form>
          <button onClick={this.closeModal}>close</button>
        </Modal>
      </div>
    );
  }
}

export default DataSetUpload


