import React, { Component } from 'react';
import DataSetUpload from './DataSetUpload.js'
import './common.css';
import './DataSetList.css';
import DeleteImg from './images/delete_dataset.svg';

class DataSetListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.value.id,
      name: this.props.value.name,
      description: this.props.value.description,
      modified: this.props.value.modified,
      file: this.props.value.file
    };
  }

  render() {
    var dt = new Date(this.state.modified);
    var filename = decodeURI(this.state.file.split('/').pop().split('#')[0].split('?')[0]);
    return (
      <tr>
      <td className="check"><input id={this.state.id} type="checkbox"/></td>
      <td className="id">{this.state.id}</td>
      <td className="name">{this.state.name}</td>
      <td className="datetime">{dt.toLocaleString()}</td>
      <td className="path"><a href={this.state.file} target="_blank" download>{filename}</a></td>
      </tr>
    );
  }
}

class DataSetList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      items: []
    };
    this.refreshItems = this.refreshItems.bind(this);
    this.deleteDataSet = this.deleteDataSet.bind(this);
    this.checkAll = this.checkAll.bind(this);
  };

  componentDidMount() {
    this.refreshItems();
  }

  refreshItems () {
    fetch ("/api/dataset/?format=json", {
      method: "GET",
      headers: {"Content-Type" : "application/json;charset=UTF-8"},
      }).then( res => res.json()).then(data => {
        this.setState({items: []});
        for (var i=0; i<data.length; i++) {
          this.setState({items:this.state.items.concat(data[i])});
        }
        console.log("%d Datasets Loaded", data.length);
      }).catch(error => console.log("Request failed:", error));
  }

  checkAll(event) {
    for (var i=0; i<this.state.items.length; i++) {
      document.getElementById(this.state.items[i].id).click();
    }
  }

  async deleteDataSet() {
    var isDelete = window.confirm("Do you want to delete selected datasets?");
    if (isDelete === false) return;
    var res;
    for (var i=0; i<this.state.items.length; i++) {
      var data_id = this.state.items[i].id;
      if (document.getElementById(data_id).checked) {
        console.log("Trying to delete dataset #%d", data_id);
        res = await fetch ("/api/dataset/" + data_id + "/", {method: "DELETE"},);
        console.log("DELETE status:%d", res.status);
      }
    }
    this.refreshItems();
  }

  render() {
    const ListItems = this.state.items.map((entry, number) => {
      return (<DataSetListItem key={entry.id} index={number} value={entry}/>);
    })
    return (
      <div className="wrapper">
        <div className="page_title">Dataset List</div>
        <div className="toolbar_frame">
          <DataSetUpload onChange={this.refreshItems} />
          <div className="toolbar" onClick={this.deleteDataSet}>
            <img src={DeleteImg} className="icon_btn" alt="icon"/>
            Delete
          </div>
        </div>
        <div className="table_wrapper">
          <table className="table_list" id="dataSetListTable">
            <thead>
              <tr>
                <th className="check"><input id="checkAll" type="checkbox" onClick={this.checkAll}/></th>
                <th className="id">Id</th>
                <th className="name">Dataset Name</th>
                <th className="modified">Uploaded</th>
                <th className="path">File URL</th>
              </tr>
            </thead>
            <tbody>
              {ListItems}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default DataSetList