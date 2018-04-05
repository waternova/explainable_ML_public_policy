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
      is_binary: value.is_binary,
      is_enabled: value.is_enabled,
    };
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleBalanceSelect = this.handleBalanceSelect.bind(this);
    this.handleFactorFormSubmit = this.handleFactorFormSubmit.bind(this);
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
            <CommentDropdown />
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
        /*if (name === "weight") {
          var newWeight = parseFloat(value);
          if (isNaN(newWeight) === false) value = newWeight;
        }*/
        this.setState( {[name]: value} );
        this.props.onChange(this.props.index, name, value);
      }
    }
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
        };

        this.testModel = this.testModel.bind(this);
        this.retrainModel = this.retrainModel.bind(this);
        this.saveModel = this.saveModel.bind(this);
        this.saveFactor = this.saveFactor.bind(this);
        this.updateFactor = this.updateFactor.bind(this);
        this.exportModel = this.exportModel.bind(this);
        //this.importModelBegin = this.importModelBegin.bind(this);
        //this.importModelEnd = this.importModelEnd.bind(this);
        //this.handleImportClick = this.handleImportClick.bind(this);
        this.loadModel = this.loadModel.bind(this);
        this.loadFactors = this.loadFactors.bind(this);
        this.clearOtherBalanceSelect = this.clearOtherBalanceSelect.bind(this);
        this.resortRows = this.resortRows.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      if (!this.props.skipFactorLoad) {
        this.loadFactorsFromServer();
      }
    }

    loadFactorsFromServer() {
      fetch ("/api/model/" + this.state.model_id + "/?format=json", {
        method: "GET",
        headers: {"Content-Type": "application/json;charset=UTF-8"},
      }).then(res => res.json()).then(data => {
        this.loadModel(data);
        return fetch ("/api/factors/?model_id=" + data.id + "&format=json", {
          method: "GET",
          headers: {"Content-Type" : "application/json;charset=UTF-8"},
        });
      }).then(res => res.json()).then(data => {
        this.loadFactors(data);
        let rows = this.updateGraphSizes();
        this.resortRows(rows);
      }).catch(error => console.error("Request failed", error));
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
        if ('all' in this.state.confusionMatrices) {
          const matrix = this.state.confusionMatrices['all'];
          const maxSize = Math.max(...matrix.reduce((acc, val) => acc.concat(val), []));
          const headerText = 'Predictions for all'
          confusionMatrices = [
            <ConfusionMatrix 
              key='all' 
              headerText={headerText} 
              matrix={confusionMatrices.all} 
              maxSize={maxSize} />
          ]
        } else if ('positive_class' in this.state.confusionMatrices && 'negative_class' in this.state.confusionMatrices) {
          confusionMatrices = Object.entries(confusionMatrices).map(([key, matrix]) => {
            const maxSize = Math.max(...matrix.reduce((acc, val) => acc.concat(val), []));
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
                <h1>Model #{this.state.model_id}: {this.state.model_name}</h1>
                <h3>Description</h3>
                <textarea value={this.state.description} name="description" onChange={this.handleChange}/>
                <p>Accuracy: {(this.state.accuracy * 100).toFixed(2)}%</p>
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
      rows.sort((a, b) => { return Math.abs(a.weight) < Math.abs(b.weight) });
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

    saveFactor(model_id, factor, isUpdate)
    {
        var requestType, requestURL;
        if (isUpdate === true)
        {
            requestType = "PUT";
            requestURL = "/api/factor/"+factor.id+"/";
            //console.log("Update a factor:");
        }
        else
        {
            requestType = "POST";
            requestURL = "/api/factor/";
            factor.model_id = model_id
            //console.log("Add a new factor:");
        }
        var factorJson = JSON.stringify(factor);
        console.log(factorJson);
        fetch (requestURL,
        {
            method: requestType,
            headers: {"Content-Type" : "application/json;charset=UTF-8"},
            body: factorJson
        }).then( res => res.json()).then(data =>
        {
            //console.log("Response: ", data);
        }).catch(error =>
        {
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
        if (isUpdate === true)
        {
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
        else
        {
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
        //console.log(modelJson);
        fetch (requestURL,
        {
            method: requestType,
            headers: {"Content-Type" : "application/json;charset=UTF-8"},
            body: modelJson
        }).then( res => res.json()).then(data =>
        {
            //console.log("Response: ", data);
            var factors = this.state.rows;
            var count = 0;
            for (var i=0; i<factors.length; i++)
            {
                if (this.saveFactor(data.id, factors[i], isUpdate) === true) {count++;}
            }
            console.log("%d/%d factors saved.", factors.length, count);
            alert("Successfully Saved: \n" + saveName);
        }).catch(error =>
        {
            console.log("Request failed: ", error);
            alert("Save Failure: \n" + error);
        });
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

    loadModel (data) {
        this.setState({
            model_name: data.name,
            description: data.description,
            accuracy: parseFloat(data.accuracy),
            intercept: parseFloat(data.intercept),
            modified: data.modified,
            parent_id: data.parent_id
        });
    }

    loadFactors(data) {
        this.setState({rows: []});
        for (var i=0; i<data.length; i++) {
            data[i].model_id = this.state.model_id;
            this.setState({rows:this.state.rows.concat(data[i])});
        }
    }

    handleChange(event) {
      const property = event.target.name;
      this.setState({[property]: event.target.value});
    }
}


export default ModelView;
