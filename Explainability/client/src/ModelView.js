import React, { Component } from 'react';
import './ModelView.css';
import './Dropdown.css';
import CommentDropdown from './CommentDropdown.js';
import FactorDropdown from './FactorDropdown.js';

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
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateFactorDescription = this.updateFactorDescription.bind(this);
    this.saveNewDescription = this.saveNewDescription.bind(this);
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
      marginLeft: String(leftMargin) + 'px'
    }
    return (
      <tr>
        <td>{this.state.alias}
          <FactorDropdown
            className="factor-detail"
            placeholder="..."
            originalName={this.state.name}
            description={this.state.newDescription}
            handleNewDescriptionUpdate={this.updateFactorDescription}
            saveNewDescription={this.saveNewDescription} />
        </td>
        <td><div className="chart-bar" style={barChartStyle}></div></td>
        <td><CommentDropdown /><input type="submit" value="Balance Model" className="balance-button" /></td>
        <td><input defaultValue={this.state.weight} onChange={this.handleChange}></input></td>
      </tr>
    );
  }

  handleChange(event) {
    this.setState({weight: event.target.value});
    this.props.onChange({index: this.state.index, value: event.target.value});
  }

  updateFactorDescription(event) {
    this.setState({
      newDescription: event.target.value
    });
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
            model_id: 0,
            model_name: "",
            description: "",
            accuracy: 0.0,
            parent_id: null,
            rows: []
            };

        fetch ("/api/model/1/?format=json",
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
                    parent_id: data.parent_id
                });
                console.log("Model Loaded:", data);
            }).catch(error => console.log('Request failed', error));
        fetch ("/api/getfactors/?model_id=1&format=json",
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
                console.log("Factors Loaded:", data);
            }).catch(error => console.log('Request failed', error));

        this.testModel = this.testModel.bind(this);
        this.retrainModel = this.retrainModel.bind(this);
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
            <p>
                 <button onClick={this.retrainModel}>Re-Fit</button>
            </p>
            <p>
                <button onClick={this.testModel}>Test Model</button>
            </p>
        </div>
        );
    }
    //Handler for Weight modification
    updateWeight(event) {
        let copyRows = [...this.state.rows];
        console.log("Weight of factor["+event.index+"] is changed from "
            + copyRows[event.index].weight + " to "+ event.value);
        copyRows[event.index].weight = event.value;
        this.setState({rows: copyRows});
    }
    //Handler for Retrain Button
    retrainModel ()
    {
    }

  //Handler for Test Button
    testModel ()
    {
        var factors = JSON.stringify(this.state.rows)
        console.log("Test request:", this.state.model_name);
        console.log("Accuracy before test:", this.state.accuracy);
        fetch ("/api/post/testmodel/",
            {
                method: "POST",
                headers: {"Content-Type" : "application/json;charset=UTF-8"},
                body: factors
            }).then( res => res.json()).then(data =>
            {
                this.setState({accuracy: parseFloat(data.accuracy)});
                console.log("Accuracy after test:", this.state.accuracy);
            }).catch(error => console.log('Request failed', error));
    }

}

export default ModelView;