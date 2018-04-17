import React, { Component } from 'react';
import Modal from 'react-modal';
import './common.css';
import UploadImg from './images/upload_dataset.svg';

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)'
  },
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    border: '3px solid #7096C9',
    backgroundColor: '#E5ECFF',
    padding: '0'
  }
};


class DataSetUpload extends Component {
  constructor (props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      name : '',
      description: ''
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.clickCancel = this.clickCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  clickCancel() {
    this.setState({name:'', description:''});
    this.closeModal();
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
          <img src={UploadImg} className="icon_btn" alt="icon"/>
          Upload...
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Upload a Dataset">
          <div className="modal_label">
            Select a local file to upload a dataset
          </div>
          <div className="modal_main">
            <form method="post" action="api/dataset/" encType="multipart/form-data" onSubmit={this.handleSubmit}>
              <label>Name</label><br/>
              <input className="edit_box" type="text" id="name" name="name" value={this.state.name} onChange={this.handleChange}/>
              <br/><br/>
              <label>Description</label><br/>
              <input className="edit_box" type="text" id="description" name="description" value={this.state.description} onChange={this.handleChange}/>
              <br/><br/>
              <input type="file" id="file" name="file" accept=".csv" ref={e => {this.file = e;}}/>
              <br/><br/>
              <div class="dialog_bottom_buttons">
                <input type="submit" className="btn" value="Upload"/>
                <button onClick={this.clickCancel} className="btn">Cancel</button>
              </div>
            </form>
          </div>
        </Modal>
      </span>
    );
  }
}

export default DataSetUpload


