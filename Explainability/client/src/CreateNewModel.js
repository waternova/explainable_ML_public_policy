import React, { Component } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

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


class CreateNewModel extends Component {
  constructor(props) {
    super();
    this.state = {
      modalIsOpen: false,
      name: '',
      dataset: null,
      description: null,
      datasetList: [],
      nonCategorical: '',
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch ("/api/dataset/?format=json", {
      method: "GET",
      headers: {"Content-Type" : "application/json;charset=UTF-8"},
      }).then( res => res.json()).then(data => {
        this.setState({
          datasetList: data.map(x => ({value: x.id, label: x.name}))
        });
      }).catch(error => console.error("Request failed:", error));
  }
  
  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleChange(event) {
    var key = event.target.name;
    if (key === 'name') {
      this.setState({name: event.target.value});
    } else if (key === 'description') {
      this.setState({description: event.target.value});
    } else if (key === 'dataset') {
      this.setState({dataset: event.target.value});
    } else if (key === 'nonCategorical') {
      this.setState({nonCategorical: event.target.value});
    }
  }

  handleSelectChange(newOption) {
    this.setState({dataset: newOption});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.name.length === 0) {alert("Please input a name."); return;}
    let newModel = {
      name: this.state.name,
      description: this.state.description,
      dataset_id: this.state.dataset.value,
      non_categorical_columns: this.state.nonCategorical,
      modified: new Date(),
    }
    fetch ("/api/model/", {
      method: "POST",
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(newModel)
    }).then(res => {
      this.closeModal();
      this.props.onChange();
    }).catch(error => {
      console.error('Request failed: ', error);
      alert('Request failed: ' + error);
    });
  }

  render() {
    const { dataset } = this.state;
    const datasetValue = dataset && dataset.value;

    return (
      <span className="new-model-button">
        <button className="toolbar" onClick={this.openModal}>New...</button> &nbsp;
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Create New Model">
          <form method="post" onSubmit={this.handleSubmit}>
            <label>Name</label>
            <br/>
            <input type="text" id="name" name="name" value={this.state.name} onChange={this.handleChange} required/> <br/> <br/>
            <label>Dataset</label>
            <Select
              name="dataset"
              value={datasetValue}
              onChange={this.handleSelectChange}
              options={this.state.datasetList}
            />
            <br/>
            <label>Description</label>
            <br/>
            <input type="text" id="description" name="description" value={this.state.description} onChange={this.handleChange}/>  
            <br/> <br/>
            <label>Non-categorical variables, as a comma-separated list</label>
            <br/>
            <input type="text" name="nonCategorical" value={this.state.nonCategorical} onChange={this.handleChange}/>  
            <br/> <br/>
            <button onClick={this.closeModal} className="btn">Cancel</button>
            <input type="submit" className="btn" value="Upload"/> &nbsp;
          </form>

        </Modal>
      </span>
    );
  }
}

export default CreateNewModel;
