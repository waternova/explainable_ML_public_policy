import React, { Component } from 'react';
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


class DataSetUpload extends Component {
  constructor (props)
    {
    super();

    this.state = {
      modalIsOpen: false,
      name : '',
      description: ''
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    } openModal() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleChange(event) {
    var key = event.target.id;
    if(key === 'name') {
      this.setState({name: event.target.value});
    } else if(key === 'description') {
      this.setState({description: event.target.value});
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.name.length === 0) {alert("Please input a name."); return;}
    if (this.file.files.length === 0) {alert("No file is selected."); return;}
    var data = new FormData();
    data.append('name', this.state.name);
    data.append('description', this.state.description);
    data.append('file', this.file.files[0]);
    fetch ("/api/dataset/", {
      method: "POST",
      body: data
    }).then( res => {
      console.log(res);
      this.closeModal();
      this.props.onChange();
    }).catch(error => {
     console.log('Request failed: ', error)
    });
  }

  render() {
    return (
      <span>
        <div className="toolbar" onClick={this.openModal}>
          <img src="upload_dataset.svg" className="icon_btn" alt="icon"/>
          Upload a Dataset...
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Upload a Dataset">
          <form method="post" action="api/dataset/" encType="multipart/form-data" onSubmit={this.handleSubmit}>
            <label>Name</label><br/><input type="text" id="name" name="name" value={this.state.name} onChange={this.handleChange}/> <br/> <br/>
            <label>Description</label><br/><input type="text" id="description" name="description" value={this.state.description} onChange={this.handleChange}/>  <br/> <br/>
            <input type="file" id="file" name="file" accept=".csv" ref={e => {this.file = e;}}/>  <br/> <br/>
            <button onClick={this.closeModal} className="btn">Cancel</button>
            <input type="submit" className="btn" value="Upload"/> &nbsp;
          </form>
        </Modal>
      </span>
    );
  }
}

export default DataSetUpload


