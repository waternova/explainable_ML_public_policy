import React, { Component } from 'react';
import './common.css';
import './ModelView.css';
import './Dropdown.css';
import Modal from 'react-modal';
import ConfusionMatrix from './ConfusionMatrix';
import ModelRow from './ModelRow';
import ModelTypeDescription from './ModelTypeDescription';
import OddsRatioDescription from './OddsRatioDescription';
import FileSaver from 'file-saver';
import SaveModelImg from './images/save_model.svg';
import SaveAsModelImg from './images/saveas_model.svg';
import ExportModelImg from './images/export_model.svg';
import RetrainImg from './images/retrain_model.svg';
import TestModelImg from './images/test_model.svg';
import BalanceDescription from './BalanceDescription';
import ResultBucket from './ResultBucket.js';

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
      target_var_alias: "",
      maxGraphSize: 1,
      untestedModel: false,
      isShowModal: false,
      isModalButton: false,
      modalMessage: "",
      modalTitle: 'Machine Learning Explorer',
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
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateGraphSizes = this.updateGraphSizes.bind(this);
  }

  componentDidMount() {
    if (!this.props.skipFactorLoad) {
      this.loadModelFromServer();
    }
  }

  getModifiedText() {
    return this.state.untestedModel ? ' (values not valid until "Test" run again)' : '';
  }

  openModal(message, title, isShowCloseButton = false) {
    this.setState({
      isShowModal: true,
      isModalButton: isShowCloseButton,
      modalMessage: message,
      modalTitle: title,
    });
  }

  closeModal() {
    this.setState({isShowModal: false});
  }

  render() {
    const modalStyles = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(169, 169, 169, 0.7)'
      }, 
      content: {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        border: '1px solid rgba(0,0,0,0.2)',
        backgroundColor: '#fff',
        padding: '0'
      },
    };

    const rows = this.state.rows.map((entry, number) => {
      return (<ModelRow
        key={entry.id}
        index={number}
        value={entry}
        onChange={this.updateFactor}
        clearOtherBalanceSelect={this.clearOtherBalanceSelect}
        resortRows={this.resortRows}
        maxGraphSize={this.state.maxGraphSize}
        updateGraphSizes={this.updateGraphSizes}
      />);
    });
    const balancedFactor = this.state.rows.find(x => x.is_balanced);
    const factorName = balancedFactor ? balancedFactor.alias : null;
    let confusionMatrices;
    const stateCmxs = this.state.confusionMatrices;
    const opacity = this.state.untestedModel ? 0.4 : 1;
    if ('all' in stateCmxs) {
      const matrix = stateCmxs['all'];
      const maxSize = Math.max(...Object.values(matrix));
      const totalSize = Object.values(matrix).reduce((a, b) => a + b, 0);
      const headerText = 'Predictions for all' + this.getModifiedText();
      confusionMatrices = [
        <ConfusionMatrix
          key='all'
          headerText={headerText}
          matrix={matrix}
          maxSize={maxSize}
          totalSize={totalSize}
          tableOpacity={opacity}/>
      ]
    } else if ('positive_class' in stateCmxs && 'negative_class' in stateCmxs) {
      confusionMatrices = Object.entries(stateCmxs).map(([key, matrix]) => {
        const maxSize = Math.max(...Object.values(matrix));
        const totalSize = Object.values(matrix).reduce((a, b) => a + b, 0);
        const isPositiveClass = key === 'positive_class';
        const headerText = `Predictions for cases where "${factorName}" is ${(isPositiveClass ? 'true' : 'false')}`;
        const threshold = isPositiveClass ? this.state.positiveThreshold : this.state.negativeThreshold;
        const thresholdText = `Threshold is ${threshold.toFixed(2)}${this.getModifiedText()}`;
        return (
          <ConfusionMatrix
            key={key}
            headerText={headerText}
            matrix={matrix}
            maxSize={maxSize}
            totalSize={totalSize}
            thresholdText={thresholdText}
            tableOpacity={opacity}/>
        );
      });
    } else {
      confusionMatrices =  "Not ready / Retrain and test required";
    }
    return (
      <div className="wrapper">
        <Modal
          isOpen={this.state.isShowModal}
          style={modalStyles}
          ariaHideApp={false}
          contentLabel="Message">
            <div className="modal_label">{this.state.modalTitle}</div>
            <div className="msg_dialog">{this.state.modalMessage}</div>
            <button onClick={this.closeModal} className={this.state.isModalButton ? "msg_close_btn" : "hidden"}>Close</button>
        </Modal>
        <div className="page_title">
          Model #{this.state.model_id}: {this.state.model_name}
        </div>
        <div className="toolbar_frame">
          <div id="save" className="toolbar" onClick={this.saveModel}>
            <img src={SaveModelImg} className="icon_btn" alt="icon"/>
            Save
          </div>
          <div id="saveas" className="toolbar" onClick={this.saveModel}>
            <img src={SaveAsModelImg} className="icon_btn" alt="icon"/>
            Save as...
          </div>
          <div className="toolbar" onClick={this.exportModel}>
            <img src={ExportModelImg} className="icon_btn" alt="icon"/>
            Export...
          </div>
        </div>
        <ModelTypeDescription />
        <div className="div_model_attribute">
          <span className="value_label">Predicted Variable:</span>
          <input value={this.state.target_var_alias} name="target_var_alias" onChange={this.handleChange}/>
          <br/>
          <span>(called "{this.state.targetVariable}" in the original dataset)</span>
        </div>
        <div className="div_description">
          <div className="value_label">Description:</div>
          <textarea className="model_description" value={this.state.description} name="description" onChange={this.handleChange}/>
        </div>
        <div className="div_model_attribute">
          <span className="value_label">Accuracy:</span> {this.state.accuracy ? (this.state.accuracy * 100).toFixed(2) + "%" : "Not ready / Test required"}
        </div>
        <div className="div_model_attribute">
          <div className="value_label">
            {'all' in stateCmxs ? "Confusion Matrix:" : "Confusion Matrices:"}
          </div>
          {confusionMatrices}
        </div>
        <div className="toolbar_frame_2">
          <div className="toolbar" onClick={this.retrainModel}>
            <img src={RetrainImg} className="icon_btn_2" alt="icon"/>
            Retrain
          </div>
          <div className="toolbar" onClick={this.testModel}>
            <img src={TestModelImg} className="icon_btn_2" alt="icon"/>
            Test
          </div>
        </div>
        <div className="table_wrapper">
          <table className="table_list" id="modelViewTable">
            <thead>
              <tr>
                <th className="factor_header_name">Factor</th>
                <th className="factor_header_slider">
                  <div>
                    If factor is true, <em>{this.state.target_var_alias!=="" ? this.state.target_var_alias : "["+this.state.targetVariable+"]" }</em> is
                  </div>
                  <span className="header_likely_left">Less likely &larr;</span>
                  <span className="header_likely_center">&nbsp;|</span>
                  <span className="header_likely_right">&rarr; More likely</span>
                </th>
                <th className="factor_header_odds_ratio">Odds Ratio <OddsRatioDescription /></th>
                <th className="factor_header_comment">Comment</th>
                <th className="factor_header_balance">Balance <BalanceDescription /></th>
                <th className="factor_header_weight">Weight</th>
              </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  //Handler for Factor modification
  updateFactor(index, field, value) {
    let newRows = this.state.rows.slice();
    newRows[index][field] = value;
    if (field === 'is_enabled' && !value) {
      newRows[index]['is_balanced'] = false;
    }
    this.setState({rows: newRows});
    this.setState({untestedModel: true});
    return(newRows);
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
    this.setState({rows: rows, maxGraphSize: maxSize});
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

  getNewIntercept() {
    const interceptRowIndex = this.state.rows.map(x=>x.name).indexOf("Intercept");
    return this.state.rows[interceptRowIndex].weight;
  }

  //Handler for Save Button
  saveModel (event) {
    const isUpdate = event.target.id === "save";
    var popup_title = isUpdate ? "Overwrite existing model:" : "Save as a new model:";
    var saveName = prompt(popup_title, this.state.model_name);
    if (saveName === null || saveName.length === 0 ) return;
    var requestType, requestURL;
    var currentModel = {
      name: saveName,
      description: this.state.description,
      accuracy: this.state.accuracy,
      intercept: this.getNewIntercept(),
      modified: new Date(),
      dataset_id: this.state.datasetId,
      non_categorical_columns: this.state.nonCategoricalColumns,
      target_variable: this.state.targetVariable,
      target_var_alias: this.state.target_var_alias,
      positive_threshold: this.state.positiveThreshold,
      negative_threshold: this.state.negativeThreshold,
    }
    if (isUpdate === true) {
      //Overwrite the model
      currentModel.parent_id = this.state.parent_id;
      requestType = "PUT";
      requestURL = "/api/model/"+this.state.model_id+"/";
      console.log("Overwriting model: ", this.state.model_id );
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
    this.openModal("Saving a Model...", "Machine Learning Explorer");
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
        return res.json();
      }
    }).then(data => {
      if (!isUpdate) {
        // Note: there is probably a cleaner way to do this with react-router,
        // but making the back button work correctly was too hard
        window.location.replace('/ModelView/' + data.model_id);
      }
      this.openModal("Successfully Saved: \n\n" + saveName, 'Machine Learning Explorer', true);
    }).catch(error => {
        console.log("Request failed: ", error);
        this.openModal("Save Failure: \n\n" + error, 'Machine Learning Explorer', true);
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
      intercept: this.getNewIntercept(),
      positive_threshold: this.state.positiveThreshold,
      negative_threshold: this.state.negativeThreshold,
      model_id: this.state.model_id,
    };
    var data_json = JSON.stringify(data);
    var msgs = [];
    const balancedFactor = this.state.rows.find(x => x.is_balanced);
    const factorName = balancedFactor ? balancedFactor.alias : null;
    this.openModal("Testing a Model...", 'Machine Learning Explorer');
    fetch ("/api/testmodel/", {
      method: "POST",
      headers: {"Content-Type" : "application/json;charset=UTF-8"},
      body: data_json
    }).then( res => {
      if(res.ok) return res.json(); else return res.text();
    }).then(data => {
      if (typeof data === 'string') throw data;
      const prevCmxs = this.state.confusionMatrices;
      const stateCmxs = data.confusion_matrices;
      this.setState({
        accuracy: parseFloat(data.accuracy),
        confusionMatrices: stateCmxs,
        untestedModel: false,
      });
      let matrix, totalSize, prevMatrix;
      if ('all' in stateCmxs) {
        matrix = stateCmxs['all'];
        if ('all' in prevCmxs) {
          prevMatrix = prevCmxs['all'];
        } else {
          const tnc = 'true_negative_count';
          const tpc = 'true_positive_count';
          const fnc = 'false_negative_count';
          const fpc = 'false_positive_count';
          const prevPosMatrix = prevMatrix['positive_class'];
          const prevNegMatrix = prevMatrix['negative_class'];
          prevMatrix = {
            [tnc]: prevPosMatrix[tnc] + prevNegMatrix[tnc],
            [tpc]: prevPosMatrix[tpc] + prevNegMatrix[tpc],
            [fnc]: prevPosMatrix[fnc] + prevNegMatrix[fnc],
            [fpc]: prevPosMatrix[fpc] + prevNegMatrix[fpc],
          }
        }
        totalSize = Object.values(matrix).reduce((a, b) => a + b, 0);
        msgs.push(
          <ResultBucket 
            matrix={matrix} 
            totalSize={totalSize} 
            target={this.state.target_var_alias}
            prevMatrix={prevMatrix}
          />);
      } else if ('positive_class' in stateCmxs && 'negative_class' in stateCmxs) {
        matrix = stateCmxs['positive_class'];
        prevMatrix = 'positive_class' in prevCmxs ? prevCmxs['positive_class'] : prevCmxs['all'];
        totalSize = Object.values(matrix).reduce((a, b) => a + b, 0);
        msgs.push(
          <h4>Predictions for cases where <em>{factorName}</em> is true</h4> );
        msgs.push(
          <ResultBucket 
            matrix={matrix} 
            totalSize={totalSize} 
            target={this.state.target_var_alias}
            prevMatrix={prevMatrix}
          />);
        matrix = stateCmxs['negative_class'];
        prevMatrix = 'negative_class' in prevCmxs ? prevCmxs['negative_class'] : prevCmxs['all'];
        totalSize = Object.values(matrix).reduce((a, b) => a + b, 0);
        msgs.push(
          <h4><br/>Predictions for cases where <em>{factorName}</em> is false</h4> );
        msgs.push(
          <ResultBucket 
            matrix={matrix} 
            totalSize={totalSize} 
            target={this.state.target_var_alias}
            prevMatrix={prevMatrix}
          />);
      }
      this.openModal(msgs, 'Test Result', true);
    }).catch(error => {
      this.openModal("Request failed: \n" + error, 'Test Result', true);
    });
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
    this.openModal("Retraining a Model...", 'Machine Learning Explorer');
    fetch ("/api/retrainmodel/", {
      method: "POST",
      headers: {"Content-Type" : "application/json;charset=UTF-8"},
      body: data_json
    }).then(res => {
      if(res.ok) return res.json(); else return res.text();
    }).then(data => {
      if (typeof data === 'string') throw data;
      this.setState({
        rows: data.factors,
        positiveThreshold: data.positive_threshold,
        negativeThreshold: data.negative_threshold,
        accuracy: data.accuracy,
        confusionMatrices: data.confusion_matrices,
        untestedModel: false,
      });
      this.updateGraphSizes(data.factors);
      this.resortRows(data.factors);
      for (let factor of data.factors) {
        if (factor.name === 'Intercept') {
          this.setState({intercept: factor.weight})
        }
      }
      this.openModal("Finished Retraining.", 'Machine Learning Explorer', true);
    }).catch(error => {
      this.openModal("Request failed: \n"+ error, 'Machine Learning Explorer', true);
    });
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
    var isAlreadyWaiting = this.state.isShowModal;
    if (!isAlreadyWaiting) this.openModal("Loading a Model...", 'Machine Learning Explorer');
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
        target_var_alias: (data_model.target_var_alias ? data_model.target_var_alias : ""),
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
      if (!isAlreadyWaiting) this.closeModal();
    }).catch(error => {
      this.openModal("Request failed: \n" + error, 'Machine Learning Explorer', true);
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
