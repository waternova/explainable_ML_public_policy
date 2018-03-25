import React, { Component } from 'react';
import classNames from 'classnames';
import DataSetUpload from './DataSetUpload.js'

class DataSetListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.value.id,
      name: this.props.value.name,
      description: this.props.value.description,
      modified: this.props.value.modified,
      content: this.props.value.content,
    };
  }

  render() {
    var dt = new Date(this.state.modified);
    return (
      <tr>
      <td className="check"><input id={this.state.id} type="checkbox"/></td>
      <td className="id">{this.state.id}</td>
      <td className="name">{this.state.name}</td>
      <td className="datetime">{dt.toLocaleString()}</td>
      <td className="path">{this.state.content.url}</td>
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
  };

  render() {
    const ListItems = this.state.items.map((entry, number) => {
      return (<DataSetListItem key={entry.id} index={number} value={entry}/>);
    })
    return (
      <div className="wrapper">
        <h1>Model List</h1>
        <p>
        <button className="toolbar" onClick={this.deleteModel}>Delete</button> &nbsp;
        <button className="toolbar" onClick={this.handleImportClick}>Import a model...</button> &nbsp;
        <input type="file" className="hidden" id="file_import" name="file" accept=".json" onChange={this.importModelBegin}/>
        </p>
        <table id="myTable" className="myTable">
        <thead>
        <tr>
        <th className="check"><input id="checkAll" type="checkbox" onClick={this.checkAll}/></th>
        <th className="id">Id</th>
        <th className="name">Model Name</th>
        <th className="accuracy">Accuracy</th>
        <th className="modified">Modified</th>
        <th className="parent">Parent Id</th>
        </tr>
        </thead>
        <tbody>
        {ListItems}
        </tbody>
        </table>
        </div>
    );
  }
}
export default DataSetList