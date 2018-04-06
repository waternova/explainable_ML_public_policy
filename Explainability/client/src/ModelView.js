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
              />
            <input 
                type="submit" 
                value="Balance Model" 
                className={balanceButtonClassNames} 
                disabled={!this.state.is_binary}
                onClick={this.handleBalanceSelect} />
        </td>
        <td><input defaultValue={this.state.weight} onChange={this.handleWeightChange}></input></td>
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
        /*if (name === "weight") {
          var newWeight = parseFloat(value);
          if (isNaN(newWeight) === false) value = newWeight;
        }*/
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
            confusionMatrices: [[[0,0], [0,0]]],
        };

        this.testModel = this.testModel.bind(this);
        this.retrainModel = this.retrainModel.bind(this);
        this.saveModel = this.saveModel.bind(this);
        this.saveFactors = this.saveFactors.bind(this);
        this.saveComments = this.saveComments.bind(this);
        this.updateFactor = this.updateFactor.bind(this);
        this.exportModel = this.exportModel.bind(this);
        this.clearOtherBalanceSelect = this.clearOtherBalanceSelect.bind(this);
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
              clearOtherBalanceSelect={this.clearOtherBalanceSelect}/>);
        });

        const confusionMatrices = this.state.confusionMatrices.map((matrix, index) => {
          return <ConfusionMatrix key={index} index={index} matrix={this.state.confusionMatrices[index]} />
        });

        return (
            <div className="wrapper">
                <h1>Model #{this.state.model_id} : {this.state.model_name}</h1>
                <h3> {this.state.description}</h3>
                <h2>Accuracy: {(this.state.accuracy * 100).toFixed(2)}%</h2>
                <h2>{this.state.positiveThreshold ? 'Threshold for positive class: ' + (this.state.positiveThreshold).toFixed(2): ''}</h2>
                <h2>{this.state.negativeThreshold ? 'Threshold for negative class: ' + (this.state.negativeThreshold).toFixed(2): ''}</h2>
                {confusionMatrices}
                <p>
                    <button className="toolbar" onClick={this.retrainModel}>Retrain</button> &nbsp;
                    <button className="toolbar" onClick={this.testModel}>Test Model</button> &nbsp;
                    <button id="overwrite" className="toolbar" onClick={this.saveModel}>Save</button> &nbsp;
                    <button id="saveas" className="toolbar" onClick={this.saveModel}>Save as...</button> &nbsp;
                    <button className="toolbar" onClick={this.exportModel}>Export Model...</button> &nbsp;
                </p>
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
      if (field === 'weight') {
        this.updateGraphSizes(newRows);
      }
    }

    updateGraphSizes(rows = this.state.rows.slice()) {
      let weights = rows.map(x=>x.weight);
      let maxWeight = Math.max(...weights);
      let minWeight = Math.min(...weights);
      let maxSize = Math.max(maxWeight, -minWeight);
      for (let row of rows) {
        row.graphSize = row.weight / maxSize * 100;
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

    saveComments(comments, isUpdate) {
      var requestType, requestURL;
      if (isUpdate === true) {
        requestType = "PUT";
        requestURL = "/api/comment/";
      }
      else {
        requestType = "POST";
        requestURL = "/api/comment/";
      }
      var commentsJson = JSON.stringify(comments);
      console.log(commentsJson);
      fetch (requestURL, {
        method: requestType,
        headers: {"Content-Type" : "application/json;charset=UTF-8"},
        body: commentsJson
      }).then( res => res.json()).then(data => {
        //console.log("Response: ", data);
      }).catch(error => {
         console.log('Request failed: ', error)
         return false;
      });
      return true;
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
    var comments_write = [];
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
      comments_write = comments_write.concat(factor.comments);
      console.log(factor.comments);
      return true;
    });
    var factorsJson = JSON.stringify(factors_write);
    var commentsJson = JSON.stringify(comments_write);
    console.log(comments_write);
    console.log(commentsJson);
    fetch (requestURL, {
      method: requestType,
      headers: {"Content-Type" : "application/json;charset=UTF-8"},
      body: factorsJson
    }).then( res => res.json()).then(data => {
      requestURL = "/api/comment_bulk/";
      fetch (requestURL, {
        method: requestType,
        headers: {"Content-Type" : "application/json;charset=UTF-8"},
        body: commentsJson
      });
      return true;
    }).catch(error => {
      console.log('Request failed: ', error)
      return false;
    });
    return true;
  }

  //Handler for Save Button
  saveModel (event) {
    var isUpdate = event.target.id==="overwrite" ? true : false ;
    var popup_title = isUpdate ? "Overwrite existing model:" : "Save as a new model:"
    var saveName = prompt(popup_title, this.state.model_name);
    if (saveName === null || saveName.length === 0 ) return;
    var currentModel, requestType, requestURL;
    if (isUpdate === true) {
      //Overwrite the model
      currentModel = {
        name: saveName,
        description: this.state.description,
        accuracy: this.state.accuracy,
        intercept: this.state.intercept,
        modified: new Date(),
        parent_id: this.state.parent_id
      };
      requestType = "PUT";
      requestURL = "/api/model/"+this.state.model_id+"/";
      console.log("Overwriting a model: %d", this.state.model_id );
      this.setState({model_name: saveName});
    }
    else {
      //Save as a new model
      currentModel = {
        name: saveName,
        description: this.state.description,
        accuracy: this.state.accuracy,
        intercept: this.state.intercept,
        modified: new Date(),
        parent_id: this.state.model_id
      };
      requestType = "POST";
      requestURL = "/api/model/";
      console.log("Save as a new model: ");
    }
    var modelJson = JSON.stringify(currentModel);
    fetch (requestURL, {
      method: requestType,
      headers: {"Content-Type" : "application/json;charset=UTF-8"},
      body: modelJson
    }).then( res => res.json()).then(data => {
      this.saveFactors(data.id, this.state.rows, isUpdate);
    }).catch(error =>
    {
        console.log("Request failed: ", error);
        alert("Save Failure: \n" + error);
    });
  }

  //Handler for Test Button
  testModel () {
    var data = {
      factors: this.state.rows,
      intercept: this.state.intercept,
      positive_threshold: this.state.positiveThreshold,
      negative_threshold: this.state.negativeThreshold,
    };
    var data_json = JSON.stringify(data);
    console.log("Test request: %s", this.state.model_name);
    console.log("Accuracy before test: %f", this.state.accuracy);
    fetch ("/api/testmodel/", {
      method: "POST",
      headers: {"Content-Type" : "application/json;charset=UTF-8"},
      body: data_json
    }).then( res => res.json()).then(data => {
      this.setState({
        accuracy: parseFloat(data.accuracy),
        confusionMatrices: data.confusion_matrices,
      });
      console.log("Accuracy after test: %f", this.state.accuracy);
    }).catch(error => console.log("Request failed: ", error));
  }

  //Handler for Retrain Button
  retrainModel () {
    var data = {factors: this.state.rows, intercept: this.state.intercept};
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
    fetch ("/api/model/" + this.state.model_id , {
      method: "GET",
      headers: {"Content-Type": "application/json;charset=UTF-8"},
    }).then(res => res.json()).then(data_model => {
      this.setState({
        model_name: data_model.name,
        description: data_model.description,
        accuracy: parseFloat(data_model.accuracy),
        intercept: parseFloat(data_model.intercept),
        modified: data_model.modified,
        parent_id: data_model.parent_id});
      model_id = data_model.id;
      return fetch ("/api/factors/?model_id=" + model_id + "&format=json", {
        method: "GET",
        headers: {"Content-Type" : "application/json;charset=UTF-8"},
      });
    }).then(res => res.json()).then(data_factors => {
      for (i=0; i<data_factors.length; i++) {
        data_factors[i].comments = [];
      }
      this.setState({rows: data_factors});
      this.updateGraphSizes();
      return fetch ("/api/comments/?model_id=" +model_id + "&format=json", {
        method: "GET",
        headers: {"Content-Type" : "application/json;charset=UTF-8"},
      });
    }).then(res => res.json()).then(data_comments => {
      data_comments.map(comment => {
        var factors = this.state.rows.slice();
        for (i=0; i<factors.length; i++) {
          if (factors[i].id === comment.factor_id) {
            factors[i].comments.push(comment);
          }
        }
        this.setState({rows: factors});
        return true;
      });
    });
  }
}


export default ModelView;
