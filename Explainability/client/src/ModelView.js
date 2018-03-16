import React, { Component } from 'react';
import './ModelView.css';
import './Dropdown.css';
import CommentDropdown from './CommentDropdown.js';
import FactorDropdown from './FactorDropdown.js';
import classNames from 'classnames';

class Row extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.value.id,
      weight: this.props.value.weight,
      alias: this.props.value.alias,
      name: this.props.value.name,
      index: this.props.index,
      description: this.props.value.description,
      newDescription: this.props.value.description,
      isBinary: false,
      isBalanced: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateFactorDescription = this.updateFactorDescription.bind(this);
    this.saveNewDescription = this.saveNewDescription.bind(this);
    this.onNewNameUpdate = this.onNewNameUpdate.bind(this);
    this.onBinaryVarUpdate = this.onBinaryVarUpdate.bind(this);
    this.handleBalanceSelect = this.handleBalanceSelect.bind(this);
  }

  render() {
    const positiveColor = "#75acff";
    const negativeColor = "#aa6bf9";
    const width = 100 * Math.abs(this.state.weight);
    let leftMargin = 150;
    if (this.state.weight < 0) {
      leftMargin = 150 - width;
    }
    const barChartStyle = {
      backgroundColor: this.state.weight > 0 ? positiveColor:negativeColor,
      width: String(width) + 'px',
      marginLeft: String(leftMargin) + 'px',
    }
    const description = this.state.newDescription || "";
    const visibleName = this.state.alias;
    const balanceButtonClassNames = classNames({
        'balance-button': true,
        'selected': this.state.isBalanced,
    });
    return (
      <tr>
        <td>{this.state.alias}
          <FactorDropdown
            className="factor-detail"
            placeholder="..."
            originalName={this.state.name}
            description={description}
            handleNewDescriptionUpdate={this.updateFactorDescription}
            saveNewDescription={this.saveNewDescription}
            visibleName={visibleName}
            isBinary={this.state.isBinary}
            handleNewNameUpdate={this.onNewNameUpdate}
            handleBinaryVarUpdate={this.onBinaryVarUpdate} />
        </td>
        <td><div className="chart-bar" style={barChartStyle}></div></td>
        <td>
            <CommentDropdown />
            <input 
                type="submit" 
                value="Balance Model" 
                className={balanceButtonClassNames} 
                disabled={!this.state.isBinary} 
                onClick={this.handleBalanceSelect} />
        </td>
        <td><input defaultValue={this.state.weight} onChange={this.handleChange}></input></td>
      </tr>
    );
  }

  handleChange(event) {
    var newWeight = parseFloat(event.target.value);
    if (isNaN (newWeight) === false)
    {
        this.setState({weight: newWeight} );
        this.props.onChange({index: this.state.index, value: newWeight});
    }
  }

  handleBalanceSelect(event) {
    this.setState({isBalanced: !this.state.isBalanced});
  }

  updateFactorDescription(event) {
    this.setState({newDescription: event.target.value});
  }

  onNewNameUpdate(event) {
    this.setState({alias: event.target.value});
  }

  onBinaryVarUpdate(event) {
    this.setState({isBinary: event.target.checked})
  }

  saveNewDescription(event) {
    event.preventDefault();
    // TODO: make UI update to make clear when it has saved
    fetch('/api/factor/' + this.state.id + '/', {
      method: 'PATCH',
      body: JSON.stringify({'description': this.state.newDescription}),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(response => this.setState({description: this.state.newDescription}))
    .catch(error => console.error('Error:', error));
  }
}

class ModelView extends Component {
    constructor (props)
    {
        super(props);
        this.state = {
            model_id: props.match.params.id,
            model_name: "",
            description: "",
            accuracy: 0.0,
            intercept: 0.0,
            modified: "",
            parent_id: null,
            rows: []
            };

        fetch ("/api/model/" + this.state.model_id + "/?format=json",
            {
                method: "GET",
                headers: {"Content-Type" : "application/json;charset=UTF-8"},
            }).then( res => res.json()).then(data =>
            {
                this.setState({
                    model_id: data.id,
                    model_name: data.name,
                    description: data.description,
                    accuracy: parseFloat(data.accuracy),
                    intercept: parseFloat(data.accuracy),
                    modified: data.modified,
                    parent_id: data.parent_id
                });
                console.log("Model Loaded: ", data.name);
            }).catch(error => console.log("Request failed", error));
        fetch ("/api/getfactors/?model_id=" + this.state.model_id +"&format=json",
            {
                method: "GET",
                headers: {"Content-Type" : "application/json;charset=UTF-8"},
            }).then( res => res.json()).then(data =>
            {
                this.setState({rows: []});
                for (var i=0; i<data.factors.length; i++)
                {
                    this.setState({rows:this.state.rows.concat(data.factors[i])});
                }
                console.log("%d factors loaded.", data.factors.length);
            }).catch(error => console.log('Request failed', error));

        this.testModel = this.testModel.bind(this);
        this.retrainModel = this.retrainModel.bind(this);
        this.SaveModel = this.SaveModel.bind(this);
        this.SaveFactor = this.SaveFactor.bind(this);
        this.updateWeight = this.updateWeight.bind(this);
    }

    render() {
        const rows = this.state.rows.map((entry, number) => {
        return (<Row key={entry.id} index={number} value={entry} onChange={this.updateWeight}/>);
        })

    return (
        <div className="wrapper">
            <h1>Model #{this.state.model_id} : {this.state.model_name}</h1>
            <h3> {this.state.description}</h3>
            <h2>Accuracy: {(this.state.accuracy * 100).toFixed(2)}%</h2>
            <p>
                <button className="toolbar" onClick={this.retrainModel}>Re-Fit</button> &nbsp;
                <button className="toolbar" onClick={this.testModel}>Test Model</button> &nbsp;
                <button className="toolbar" onClick={this.SaveModel}>Save Model...</button>
            </p>

            <table id="myTable" className="myTable">
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
    //Handler for Weight modification
    updateWeight(event) {
        let copyRows = [...this.state.rows];
        var newWeight = parseFloat(event.value);
        if (isNaN(newWeight) === false)
        {
            console.log("Weight of factor[%d] is changed from %f to %f", event.index
                ,copyRows[event.index].weight, newWeight);
            copyRows[event.index].weight = newWeight;
            this.setState({rows: copyRows});
        }
    }
    //Handler for Retrain Button
    retrainModel ()
    {

    }

    SaveFactor(model_id, factor, isUpdate)
    {
        var requestType, requestURL;
        if (isUpdate === true)
        {
            requestType = "PUT";
            requestURL = "/api/factor/"+factor.id+"/"
            //console.log("Update a factor:");
        }
        else
        {
            requestType = "POST";
            requestURL = "/api/factor/"
            factor.model_id = model_id
            //console.log("Add a new factor:");
        }
        var factorJson = JSON.stringify(factor);
        //console.log(factorJson);
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
    SaveModel ()
    {
        var saveName = prompt("Save As:", this.state.model_name);
        if (saveName == null ) return;
        var currentModel, requestType, requestURL
        var isUpdate = false;
        if (this.state.model_name === saveName)
        {
           isUpdate = window.confirm("Do you want to overwrite the current model?");
           if (isUpdate === false) return;
        }
        if (isUpdate === true)
        {
            //Overwrite the model
            currentModel = {
                name: this.state.model_name,
                description: this.state.description,
                accuracy: this.state.accuracy,
                intercept: this.state.intercept,
                modified: new Date(),
                parent_id: this.state.parent_id
                };
            requestType = "PUT";
            requestURL = "/api/model/"+this.state.model_id+"/"
            console.log("Overwriting a model: %d", this.state.model_id );
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
            //this.setState({model_id: data.id});
            //this.setState({model_name: saveName});
            var factors = this.state.rows;
            var count = 0;
            for (var i=0; i<factors.length; i++)
            {
                if (this.SaveFactor(data.id, factors[i], isUpdate) === true) {count++;}
            }
            console.log("%d/%d factors saved.", factors.length, count);
            alert("Successfully Saved: " + saveName);
        }).catch(error =>
        {
            console.log("Request failed: ", error)
            alert("Save Failure: " + error);
        });
    }

    //Handler for Test Button
    testModel ()
    {
        var factors = JSON.stringify(this.state.rows)
        console.log("Test request: %s", factors);
        console.log("Accuracy before test: %f", this.state.accuracy);
        fetch ("/api/testmodel/",
            {
                method: "POST",
                headers: {"Content-Type" : "application/json;charset=UTF-8"},
                body: factors
            }).then( res => res.json()).then(data =>
            {
                this.setState({accuracy: parseFloat(data.accuracy)});
                console.log("Accuracy after test: %f", this.state.accuracy);
            }).catch(error => console.log("Request failed: ", error));
    }

}

export default ModelView;