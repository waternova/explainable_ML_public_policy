import React, { Component } from 'react';
import './ModelList.css';

class ModelListItem extends Component {
    constructor(props)
    {
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

    render()
    {
        var dt = new Date(this.state.modified);
        return (
            <tr>
                <td className="id">{this.state.id}</td>
                <td className="name">{this.state.name}</td>
                <td className="accuracy">{(this.state.accuracy * 100).toFixed(2)}%</td>
                <td className="modified">{dt.toLocaleString()}</td>
                <td className="parent">{this.state.parent_id}</td>
            </tr>
        );
    }
}

class ModelList extends React.Component {
    constructor (props)
    {
		super(props);
        this.state = {
            models: []
            };
        fetch ("/api/getmodels/?format=json",
            {
                method: "GET",
                headers: {"Content-Type" : "application/json;charset=UTF-8"},
            }).then( res => res.json()).then(data =>
            {
                this.setState({models: []});
                for (var i=0; i<data.models.length; i++)
                {
                    this.setState({models:this.state.models.concat(data.models[i])});
                }
                console.log(data.models.length, " Models Loaded");
            }).catch(error => console.log('Request failed', error));

        //this.testModel = this.testModel.bind(this);
        //this.retrainModel = this.retrainModel.bind(this);
        //this.updateWeight = this.updateWeight.bind(this);
	}

    render() {
        const ListItems = this.state.models.map((entry, number) => {
        return (<ModelListItem key={entry.id} index={number} value={entry}/>);
        })

    return (
        <div className="wrapper">
            <h1>Model List</h1>
            <table id="myTable" className="myTable">
                <thead>
                    <tr>
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

export default ModelList;