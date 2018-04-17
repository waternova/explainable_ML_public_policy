import React, { Component } from 'react';
import './common.css';
import './ModelList.css';
import { Link } from 'react-router-dom';
import CreateNewModel from './CreateNewModel';
import ImportModelImg from './images/import_model.svg';
import DeleteModelImg from './images/delete_model.svg';

class ModelListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
        id: this.props.value.id,
        name: this.props.value.name,
        parent_id: this.props.value.parent_id,
        accuracy: this.props.value.accuracy,
        intercept: this.props.value.intercept,
        modified: this.props.value.modified,
        description: this.props.value.description,
    };
  }

  render() {
    var dt = new Date(this.state.modified);
    return (
      <tr>
        <td className="check"><input id={this.state.id} type="checkbox"/></td>
        <td className="id">{this.state.id}</td>
        <td className="name">
            <Link className="table_item_link" to={"/ModelView/"+this.state.id+"/"}>
                {this.state.name}
            </Link>
        </td>
        <td className="accuracy">{(this.state.accuracy * 100).toFixed(2)}%</td>
        <td className="modified">{dt.toLocaleString()}</td>
        <td className="parent">{this.state.parent_id}</td>
      </tr>
    );
  }
}

class ModelList extends React.Component {
  constructor (props) {
  super(props);
    this.deleteModel = this.deleteModel.bind(this);
    this.checkAll = this.checkAll.bind(this);
    this.handleImportClick=this.handleImportClick.bind(this);
    this.importModelBegin = this.importModelBegin.bind(this);
    this.importModelEnd = this.importModelEnd.bind(this);
    this.importFactor = this.importFactor.bind(this);
    this.refreshModelList = this.refreshModelList.bind(this);
    this.state = {
        models: []
    };
  }

  componentDidMount() {
    this.refreshModelList();
  }

  refreshModelList() {
    fetch ("/api/model/?format=json", {
      method: "GET",
      headers: {"Content-Type" : "application/json;charset=UTF-8"},
    }).then( res => res.json()).then(data => {
      this.setState({models: []});
      for (var i=0; i<data.length; i++) {
          this.setState({models:this.state.models.concat(data[i])});
      }
      console.log("%d Models Loaded", data.length);
    }).catch(error => console.log("Request failed:", error));
  }

  render() {
    const ListItems = this.state.models.map((entry, number) => {
    return (<ModelListItem key={entry.id} index={number} value={entry}/>);
    })

    return (
    <div className="wrapper">
      <div className="page_title">Model List</div>
      <div className="toolbar_frame">
        <CreateNewModel onChange={this.refreshModelList} />
        <div className="toolbar" onClick={this.handleImportClick}>
          <img src={ImportModelImg} className="icon_btn" alt="icon"/>
          Import...
        </div>
        <div className="toolbar" onClick={this.deleteModel}>
          <img src={DeleteModelImg} className="icon_btn" alt="icon"/>
          Delete
        </div>
      </div>
      <input type="file" className="hidden" id="file_import" name="file" accept=".json" onChange={this.importModelBegin}/>
      <div className="table_wrapper">
        <table className="table_list" id="modelListTable">
          <thead>
            <tr>
              <th className="list_col_check"><input id="checkAll" type="checkbox" onClick={this.checkAll}/></th>
              <th className="list_col_id">Id</th>
              <th className="list_col_name">Model Name</th>
              <th className="list_col_accuracy">Accuracy</th>
              <th className="list_col_modified">Modified</th>
              <th className="list_col_parent">Parent Id</th>
            </tr>
          </thead>
          <tbody>
            {ListItems}
          </tbody>
        </table>
      </div>
    </div>);
  }

 async deleteModel() {
  var isDelete = window.confirm("Do you want to delete selected models?");
  if (isDelete === false) return;
  var res;

 for (var i=0; i<this.state.models.length; i++) {
    var model_id = this.state.models[i].id;
    if (document.getElementById(model_id).checked) {
      res = await fetch ("/api/model/" + model_id + "/", {method: "DELETE"},);
      console.log("DELETE status:%d", res.status);
    }
  }
  this.refreshModelList();
}

  handleImportClick() {
      document.getElementById('file_import').click();
  }

  importFactor(model_id, factor)
  {
      factor.model_id = model_id
      var factorJson = JSON.stringify(factor);
      fetch ("/api/factor/",
      {
          method: "POST",
          headers: {"Content-Type" : "application/json;charset=UTF-8"},
          body: factorJson
      }).then( res => res.json()).then(data =>
      {
          return true;
      }).catch(error =>
      {
          console.log('Request failed: ', error)
          return false;
      });
      return true;
  }

  importModelEnd(event) {
      try {
          var data = JSON.parse(event.target.result);
      } catch(e) {
          alert("Cannot parse the file as JSON.");
          return;
      }
      console.log(data);
      if (!("model" in data && "factors" in data))
      {
          alert("Cannot find a model data.");
          return;
      }
      var model = data["model"];
      var factors = data["factors"];
      var modelJson = JSON.stringify(model);
      fetch ("/api/model/", {
          method: "POST",
          headers: {"Content-Type" : "application/json;charset=UTF-8"},
          body: modelJson
      }).then( res => res.json()).then(data => {
          console.log("Model %d added", data.id);
          var count = 0;
          for (var i=0; i<factors.length; i++) {
              if (this.importFactor(data.id, factors[i]) === true) {count++;}
          }
          console.log("%d/%d factors Imported.", factors.length, count);
          this.refreshModelList();
      }).catch(error => {
          console.log("Request failed: ", error);
      });
  }

  importModelBegin(event) {
      if (!(window.File && window.FileReader && window.FileList && window.Blob))
      {
          alert('The File APIs are not fully supported by your browser.');
          return;
      }
      var reader = new FileReader();
      var fileInput = document.getElementById('file_import');
      var file = fileInput.files[0];
      reader.onload = this.importModelEnd;
      reader.readAsText(file);
  }

  checkAll(event) {
      for (var i=0; i<this.state.models.length; i++) {
          document.getElementById(this.state.models[i].id).click();
      }
  }
}

export default ModelList;