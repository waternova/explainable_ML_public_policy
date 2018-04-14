import React, { Component } from 'react';
import './common.css';
import './ModelView.css';
import './Dropdown.css';
import CommentDropdown from './CommentDropdown.js';
import FactorDropdown from './FactorDropdown.js';
import ConfusionMatrix from './ConfusionMatrix';
import classNames from 'classnames';
import FileSaver from 'file-saver';

class Row extends Component {
  constructor(props) {
    super(props);
    const value = this.props.value;
    this.state = {
      id: value.id,
      weight: value.weight,
      alias: value.alias,
      name: value.name,
      index: this.props.index,
      description: value.description,
      is_balanced: value.is_balanced,
      is_binary: value.is_binary,
      is_enabled: value.is_enabled,
      comments: value.comments,
      model_id: value.model_id,
    };
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleBalanceSelect = this.handleBalanceSelect.bind(this);
    this.handleFactorFormSubmit = this.handleFactorFormSubmit.bind(this);
    this.handleUpdateComments = this.handleUpdateComments.bind(this);
  }

  render() {
    const positiveColor = "#75acff";
    const negativeColor = "#aa6bf9";
    const graphSize = this.props.value.graphSize;
    let leftMargin = 150;
    if (graphSize < 0) {
      leftMargin = 150 + graphSize;
    }
    const barChartStyle = {
      backgroundColor: graphSize > 0 ? positiveColor:negativeColor,
      width: String(Math.abs(graphSize)) + 'px',
      marginLeft: String(leftMargin) + 'px',
    }
    const balanceButtonClassNames = classNames({
        'balance-button': true,
        'selected': this.props.value.is_balanced,
    });
    return (
      <tr>
        <td><span className={this.state.is_enabled ? "factor_enabled" : "factor_disabled"}>{this.state.alias}</span>
          <FactorDropdown
            className="factor-detail"
            originalName={this.state.name}
            description={this.state.description === null ? "" : this.state.description }
            alias={this.state.alias}
            weight={this.state.weight}
            is_binary={this.state.is_binary}
            is_enabled={this.state.is_enabled}
            handleFactorFormSubmit={this.handleFactorFormSubmit} />
        </td>
        <td><div className="chart-bar" style={barChartStyle}></div></td>
        <td>
            <CommentDropdown
              className="comment-detail"
              comments = {this.state.comments}
              handleUpdateComments={this.handleUpdateComments}
              model_id = {this.state.model_id}
              factor_name = {this.state.name}
              />
            <input 
              type="submit"
              value="Balance Model"
              className={balanceButtonClassNames}
              disabled={!this.state.is_binary}
              onClick={this.handleBalanceSelect} />
        </td>
        <td>
          <input 
            defaultValue={this.state.weight.toFixed(6)} 
            onChange={this.handleWeightChange} 
            onBlur={(event) => this.props.resortRows()} />
        </td>
      </tr>
    );
  }

  handleWeightChange(event) {
    var newWeight = parseFloat(event.target.value);
    if (isNaN (newWeight) === false)
    {
        this.setState({weight: newWeight} );
        this.props.onChange(this.props.index, "weight", newWeight);
    }
  }

  handleFactorFormSubmit(event) {
    event.preventDefault();
    for (var i=0; i<event.target.length; i++) {
      var name = event.target[i].name;
      if (name!=="apply" && name!=="cancel"){
        var value = event.target[i].type === 'checkbox' ? event.target[i].checked : event.target[i].value;
        this.setState( {[name]: value} );
        this.props.onChange(this.props.index, name, value);
      }
    }
  }

  handleUpdateComments(comments) {
    this.setState({'comments': comments});
    this.props.onChange(this.props.index, 'comments', comments);
  }

  handleBalanceSelect(event) {
    this.props.onChange(this.props.index, "is_balanced", !this.props.value.is_balanced);
    this.props.clearOtherBalanceSelect(this.state.id);
  }
}

class ModelView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      model_id: props.match.params.id,
      model_name: "",
      description: "",
      accuracy: 0.0,
      intercept: 0.0,
      modified: "",
      parent_id: null,
      rows: [],
      positiveThreshold: null,
      negativeThreshold: null,
      confusionMatrices: {},
      datasetId: null,
      nonCategoricalColumns: null,
      targetVariable: null,
    };

    this.testModel = this.testModel.bind(this);
    this.retrainModel = this.retrainModel.bind(this);
    this.saveModel = this.saveModel.bind(this);
    this.saveFactors = this.saveFactors.bind(this);
    this.updateFactor = this.updateFactor.bind(this);
    this.exportModel = this.exportModel.bind(this);
    this.clearOtherBalanceSelect = this.clearOtherBalanceSelect.bind(this);
    this.resortRows = this.resortRows.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.replaceModelDetails = this.replaceModelDetails.bind(this);
  }

  componentDidMount() {
    if (!this.props.skipFactorLoad) {
      this.loadModelFromServer();
    }
  }

  render() {
    const rows = this.state.rows.map((entry, number) => {
      return (<Row
        key={entry.id}
        index={number}
        value={entry}
        onChange={this.updateFactor}
        clearOtherBalanceSelect={this.clearOtherBalanceSelect}
        resortRows={this.resortRows}/>);
    });
    const balancedFactor = this.state.rows.find(x => x.is_balanced);
    const factorName = balancedFactor ? balancedFactor.alias : null;
    let confusionMatrices;
    const stateCmxs = this.state.confusionMatrices;
    if ('all' in stateCmxs) {
      const matrix = stateCmxs['all'];
      const maxSize = Math.max(...Object.values(matrix));
      const headerText = 'Predictions for all'
      confusionMatrices = [
        <ConfusionMatrix
          key='all'
          headerText={headerText}
          matrix={stateCmxs.all}
          maxSize={maxSize} />
      ]
    } else if ('positive_class' in stateCmxs && 'negative_class' in stateCmxs) {
      confusionMatrices = Object.entries(stateCmxs).map(([key, matrix]) => {
        const maxSize = Math.max(...Object.values(matrix));
        const isPositiveClass = key === 'positive_class';
        const headerText = `Predictions for cases where "${factorName}" is ${(isPositiveClass ? 'true' : 'false')}`;
        const threshold = isPositiveClass ? this.state.positiveThreshold : this.state.negativeThreshold;
        return (
          <ConfusionMatrix
            key={key}
            headerText={headerText}
            matrix={matrix}
            maxSize={maxSize}
            threshold={threshold} />
        )
      })
    }
    return (
      <div className="wrapper">
        <div className="page_title">
          Model #{this.state.model_id}: {this.state.model_name}
        </div>
        <h3>Description</h3>
        <textarea value={this.state.description} name="description" onChange={this.handleChange}/>
        <p>Accuracy: {(this.state.accuracy * 100).toFixed(2)}%</p>
        {confusionMatrices}
        <div className="toolbar_frame">
          <div className="toolbar" onClick={this.retrainModel}>
            <img src="/retrain_model.svg" className="icon_btn" alt="icon"/>
            Retrain
          </div>
          <div className="toolbar" onClick={this.testModel}>
            <img src="/test_model.svg" className="icon_btn" alt="icon"/>
            Test Model
          </div>
          <div id="save" className="toolbar" onClick={this.saveModel}>
            <img src="/save_model.svg" className="icon_btn" alt="icon"/>
            Save
          </div>
          <div id="saveas" className="toolbar" onClick={this.saveModel}>
            <img src="/saveas_model.svg" className="icon_btn" alt="icon"/>
            Save as...
          </div>
          <div className="toolbar" onClick={this.exportModel}>
            <img src="/export_model.svg" className="icon_btn" alt="icon"/>
            Export Model...
          </div>
        </div>
        <table id="modelViewTable">
          <thead>
            <tr>
              <th>Factor</th>
              <th width="300px" style={{"textAlign": "center"}}><span>Less likely</span><span> &lt;- Passing -&gt; </span><span>More likely</span></th>
              <th>Actions</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
          {rows}
          </tbody>
        </table>
        <br />
      </div>
    );
  }

  //Handler for Factor modification
  updateFactor(index, field, value) {
    let newRows = this.state.rows.slice();
    newRows[index][field] = value;
    this.setState({rows: newRows});
    if (field === 'weight' || field === 'is_enabled') {
      this.updateGraphSizes(newRows);
    }
  }

  updateGraphSizes(rows = this.state.rows.slice()) {
    const interceptRowIndex = rows.map(x=>x.name).indexOf("Intercept");
    let interceptRow;
    if (interceptRowIndex > -1) {
      interceptRow = rows[interceptRowIndex];
      rows.splice(interceptRowIndex, 1);
    }
    let weights = rows.map(x=>x.weight);
    let maxWeight = Math.max(...weights);
    let minWeight = Math.min(...weights);
    let maxSize = Math.max(maxWeight, -minWeight);
    for (let row of rows) {
      if (row.is_enabled) {
        row.graphSize = row.weight / maxSize * 100;
      } else {
        row.graphSize = 0;
      }
    }
    if (interceptRow) {
      interceptRow.graphSize = 0;
      rows.push(interceptRow);
    }
    this.setState({rows: rows});
    return rows;
  }

  resortRows(rows = this.state.rows.slice()) {
    const interceptRowIndex = rows.map(x=>x.name).indexOf("Intercept");
    let interceptRow;
    if (interceptRowIndex > -1) {
      interceptRow = rows[interceptRowIndex];
      rows.splice(interceptRowIndex, 1);
    }
    rows.sort((a, b) => { return Math.abs(a.weight) - Math.abs(b.weight) }).reverse();
    if (interceptRow) {
      rows.push(interceptRow);
    }
    this.setState({rows: rows});
  }

  clearOtherBalanceSelect(idSelected) {
    for (let rowData of this.state.rows) {
      if (rowData.id !== idSelected && rowData.is_balanced) {
        rowData.is_balanced = false;
      }
    }
  }

  saveFactors(model_id, factors, isUpdate) {
    var requestType, requestURL;
    if (isUpdate === true) {
      requestType = "PUT";
      //requestURL = "/api/factor/"+factor.id+"/";
      requestURL = "/api/factor_bulk/";
    }
    else {
      requestType = "POST";
      requestURL = "/api/factor_bulk/";
    }
    //split 'comments' field
    var factor_write;
    var factors_write = [];
    var comments_post = [];
    var comments_put = [];
    const json_header = {"Content-Type" : "application/json;charset=UTF-8"};
    factors.map(factor => {
      factor_write = {
        id: factor.id,
        weight: factor.weight,
        alias: factor.alias,
        name: factor.name,
        description: factor.description,
        is_balanced: factor.is_balanced,
        is_binary: factor.is_binary,
        is_enabled: factor.is_enabled,
        model_id: model_id
      };
      factors_write.push(factor_write);
      for (var i=0; i<factor.comments.length; i++) {
        factor.comments[i].model_id = model_id;
        if ( isUpdate && factor.comments[i].id != null) comments_put.push(factor.comments[i]);
        else comments_post.push(factor.comments[i]);
      }
      return true;
    });
    return fetch (requestURL, {method: requestType, headers: json_header, body: JSON.stringify(factors_write)
    }).then( res => {
      requestURL = "/api/comment_bulk/";
      return fetch (requestURL, {method: "POST", headers: json_header, body: JSON.stringify(comments_post)
      }).then( res => {
      return fetch (requestURL, {method: "PUT", headers: json_header, body: JSON.stringify(comments_put)});
      });
    }).catch(error => {
      console.log('Request failed: ', error)
      return error;
    });
  }

  //Handler for Save Button
  saveModel (event) {
    var isUpdate = event.target.id==="overwrite" ? true : false ;
    var popup_title = isUpdate ? "Overwrite existing model:" : "Save as a new model:"
    var saveName = prompt(popup_title, this.state.model_name);
    if (saveName === null || saveName.length === 0 ) return;
    var requestType, requestURL;
    var currentModel = {
      name: saveName,
      description: this.state.description,
      accuracy: this.state.accuracy,
      intercept: this.state.intercept,
      modified: new Date(),
      dataset_id: this.state.datasetId,
      non_categorical_columns: this.state.nonCategoricalColumns,
      target_variable: this.state.targetVariable,
      positive_threshold: this.state.positiveThreshold,
      negative_threshold: this.state.negativeThreshold,
    }
    if (isUpdate === true) {
      //Overwrite the model
      currentModel.parent_id = this.state.parent_id;
      requestType = "PUT";
      requestURL = "/api/model/"+this.state.model_id+"/";
      console.log("Overwriting a model: ", this.state.model_id );
      this.setState({model_name: saveName});
    }
    else {
      //Save as a new model
      currentModel.parent_id = this.state.model_id;
      requestType = "POST";
      requestURL = "/api/model/";
      console.log("Save as a new model:", saveName);
    }
    var modelJson = JSON.stringify(currentModel);
    var model_id = null;
    //console.log(modelJson);
    fetch (requestURL, {
      method: requestType,
      headers: {"Content-Type" : "application/json;charset=UTF-8"},
      body: modelJson
    }).then( res => res.json()).then(data => {
      model_id = data.id;
      return this.saveFactors(data.id, this.state.rows, isUpdate);
    }).then ( res => {
      return this.replaceModelDetails(model_id);
    }).then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      } else {
        alert("Successfully Saved: \n" + saveName);
      }
    }).catch(error => {
        console.log("Request failed: ", error);
        alert("Save Failure: \n" + error);
    });
  }

  replaceModelDetails(modelId) {
    let details = {};
    const cmxs = this.state.confusionMatrices;
    for (let [matrixType, matrix] of Object.entries(cmxs)) {
      for (let [key, value] of Object.entries(matrix)) {
        details[matrixType + '#' + key] = value;
    }
    }
    const updateJson = {
      model_id: modelId,
      details: details,
    }
    return fetch('/api/replacemodeldetails/', {
      method: 'POST',
      headers: {"Content-Type" : "application/json;charset=UTF-8"},
      body: JSON.stringify(updateJson)
    })
  }

  //Handler for Test Button
  testModel() {
      var data = {
          factors: this.state.rows,
          intercept: this.state.intercept,
          positive_threshold: this.state.positiveThreshold,
          negative_threshold: this.state.negativeThreshold,
          model_id: this.state.model_id,
      };
      var data_json = JSON.stringify(data);
      console.log("Test request: %s", this.state.model_name);
      console.log("Accuracy before test: %f", this.state.accuracy);
      fetch ("/api/testmodel/",
          {
              method: "POST",
              headers: {"Content-Type" : "application/json;charset=UTF-8"},
              body: data_json
          }).then( res => res.json()).then(data =>
          {
              this.setState({
                accuracy: parseFloat(data.accuracy),
                confusionMatrices: data.confusion_matrices,
              });
              console.log("Accuracy after test: %f", this.state.accuracy);
          }).catch(error => console.log("Request failed: ", error));
  }

  //Handler for Retrain Button
  retrainModel() {
      var data = {
          factors: this.state.rows,
          intercept: this.state.intercept,
          model_id: this.state.model_id,
      };
      var data_json = JSON.stringify(data);
      console.log("Retrain request: %s", this.state.model_name);
      fetch ("/api/retrainmodel/", {
          method: "POST",
          headers: {"Content-Type" : "application/json;charset=UTF-8"},
          body: data_json
      }).then( res => res.json()).then(data => {
          this.setState({rows: []});
          this.setState({
              rows: data.factors,
              positiveThreshold: data.positive_threshold,
              negativeThreshold: data.negative_threshold,
              accuracy: data.accuracy,
              confusionMatrices: data.confusion_matrices,
          });
          this.updateGraphSizes(data.factors);
          this.resortRows(data.factors);
          for (let factor of data.factors) {
              if (factor.name === 'Intercept') {
                  this.setState({intercept: factor.weight})
              }
          }
      }).catch(error => console.log("Request failed: ", error));
  }

  exportModel() {
    var currentModel = {
      name: this.state.model_name,
      description: this.state.description,
      accuracy: this.state.accuracy,
      intercept: this.state.intercept,
      modified: this.state.modified,
      parent_id: this.state.parent_id
    };
    var data = {model:currentModel, factors:this.state.rows }
    var data_json = JSON.stringify(data);
    var blob = new Blob([data_json], {type: "application/json;charset=utf-8"});
    console.log(blob);
    FileSaver.saveAs(blob, this.state.model_name+".json");
  }

  loadModelFromServer() {
    var model_id, i;
    fetch ("/api/model/" + this.state.model_id + "/?format=json", {
      method: "GET",
      headers: {"Content-Type": "application/json;charset=UTF-8"},
    }).then(res => res.json()).then(data_model => {
      this.setState({
        model_name: data_model.name,
        description: data_model.description,
        accuracy: parseFloat(data_model.accuracy),
        intercept: parseFloat(data_model.intercept),
        modified: data_model.modified,
        parent_id: data_model.parent_id,
        datasetId: data_model.dataset_id,
        nonCategoricalColumns: data_model.non_categorical_columns,
        targetVariable: data_model.target_variable,
        positiveThreshold: data_model.positive_threshold,
        negativeThreshold: data_model.negative_threshold,
      });
      model_id = data_model.id;
      return fetch ("/api/factors/?model_id=" + model_id, {
        method: "GET",
        headers: {"Content-Type" : "application/json;charset=UTF-8"},
      });
    }).then(res => res.json()).then(data_factors => {
      for (i=0; i<data_factors.length; i++) {
        data_factors[i].comments = [];
      }
      this.setState({rows: data_factors});
      return fetch ("/api/comments/?model_id=" +model_id, {
        method: "GET",
        headers: {"Content-Type" : "application/json;charset=UTF-8"},
      });
    }).then(res => res.json()).then(data_comments => {
      data_comments.map(comment => {
        var factors = this.state.rows.slice();
        for (i=0; i<factors.length; i++) {
          if (factors[i].name === comment.factor_name) {
            factors[i].comments.push(comment);
          }
        }
        return true;
      });
      return fetch("/api/modeldetail/?model_id=" + model_id, {
        method: "GET",
        headers: {"Content-Type" : "application/json;charset=UTF-8"},
      });
    }).then(res => res.json()).then(data => {
      let rows = this.updateGraphSizes();
      this.resortRows(rows);
      this.loadDetail(data);
    }).catch(error => {
      console.error("Request failed", error);
      return error;
    });
  }

  loadDetail(data) {
    let confusionMatrices = {};
    for (let detail of data) {
      let [matrixType, valueType] = detail.type.split('#', 2);
        if (!(matrixType in confusionMatrices)) {
          confusionMatrices[matrixType] = {};
        }
        confusionMatrices[matrixType][valueType] = detail.intValue;
    }
    this.setState({confusionMatrices: confusionMatrices})
  }

  handleChange(event) {
    const property = event.target.name;
    this.setState({[property]: event.target.value});
  }
}


export default ModelView;
