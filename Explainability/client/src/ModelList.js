import React, { Component } from 'react';
import './ModelList.css';
import { Link } from 'react-router-dom';

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
                <td className="check"><input id={this.state.id} type="checkbox"/></td>
                <td className="id">{this.state.id}</td>
                <td className="name">
                    <Link to={"/ModelView/"+this.state.id+"/"}>
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
    constructor (props)
    {
		super(props);
        this.deleteModel = this.deleteModel.bind(this);
        this.importModel = this.importModel.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.refreshModel = this.refreshModel.bind(this);

        this.state = {
            models: []
            };
        this.refreshModel();
	}

    refreshModel () {
        fetch ("/api/model/?format=json",
            {
                method: "GET",
                headers: {"Content-Type" : "application/json;charset=UTF-8"},
            }).then( res => res.json()).then(data =>
            {
                this.setState({models: []});
                for (var i=0; i<data.length; i++)
                {
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
            <h1>Model List</h1>
            <p>
            <button className="toolbar" onClick={this.deleteModel}>Delete</button> &nbsp;
            <button className="toolbar" onClick={this.importModel}>Import a model...</button> &nbsp;
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

    async deleteModel() {
        var isDelete = window.confirm("Do you want to delete selected models?");
        if (isDelete === false) return;
        var res;
        for (var i=0; i<this.state.models.length; i++) {
            var model_id = this.state.models[i].id;
            if (document.getElementById(model_id).checked) {
                console.log("Trying to delete model #%d", model_id);
                res = await fetch ("/api/delfactors/?model_id=" + model_id, {method: "GET"},);
                console.log(res.json());
                res = await fetch ("/api/model/" + model_id + "/", {method: "DELETE"},);
                console.log("DELETE status:%d", res.status);
                /*fetch ("/api/delfactors/?model_id=" + model_id, {method: "GET"},
                ).then(res => {console.log(res.status); }
                ).catch(error => console.log("Factor delete request failed:", error));
                fetch ("/api/model/" + model_id + "/", {method: "DELETE"},
                ).then(res => {console.log(res.status); }
                ).catch(error => console.log("Model delete request failed:", error));*/
            }
        }
        this.refreshModel();
    }

    importModel() {
    }

    checkAll(event) {
        for (var i=0; i<this.state.models.length; i++) {
            document.getElementById(this.state.models[i].id).click();
        }
    }
}

export default ModelList;