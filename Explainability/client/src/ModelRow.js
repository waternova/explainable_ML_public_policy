import React, { Component } from 'react';
import classNames from 'classnames';
import CommentDropdown from './CommentDropdown.js';
import FactorDropdown from './FactorDropdown.js';
import Slider from './RangeSlider/RangeSlider';
import BinaryImg from './images/binary.svg';
import EmptyImg from './images/empty.png';
import CommentImg from './images/comment.svg';
import CommentEmptyImg from './images/comment_empty.svg';

class ModelRow extends Component {
  constructor(props) {
    super(props);
    const value = this.props.value;
    this.state = {
      id: value.id,
      sliderWeight: value.weight,
      textWeight: String(value.weight),
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
    this.handleWeightSliderChange = this.handleWeightSliderChange.bind(this);
    this.handleWeightInputChange = this.handleWeightInputChange.bind(this);
    this.handleBalanceSelect = this.handleBalanceSelect.bind(this);
    this.handleFactorFormSubmit = this.handleFactorFormSubmit.bind(this);
    this.handleUpdateComments = this.handleUpdateComments.bind(this);
    this.handleWeightSliderComplete = this.handleWeightSliderComplete.bind(this);
    this.handleWeightInputComplete = this.handleWeightInputComplete.bind(this);
  }

  render() {
    const positiveColor = "#75acff";
    const negativeColor = "#aa6bf9";
    const balanceButtonClassNames = classNames({
        'balance-button': true,
        'selected': this.props.value.is_balanced,
    });
    return (
      <tr>
        <td>
          <img className="icon_list" src={this.state.is_binary ? BinaryImg : EmptyImg}
            title={this.state.is_binary ? "Binary Variable" : "Not Binary Variable"} alt=""/>
          <FactorDropdown
            factor_id={this.state.id}
            model_id={this.state.model_id}
            originalName={this.state.name}
            description={this.state.description === null ? "" : this.state.description }
            alias={this.state.alias}
            weight={this.props.value.weight}
            is_binary={this.state.is_binary}
            is_enabled={this.state.is_enabled}
            handleFactorFormSubmit={this.handleFactorFormSubmit} />
          <span className={this.state.is_enabled ? "factor_enabled" : "factor_disabled"}
            title={this.state.is_enabled ? "Enabled" : "Disabled"}>{this.state.alias}</span>
        </td>
        <td><Slider
          value={this.state.sliderWeight}
          startZero={true}
          min={-this.props.maxGraphSize}
          max={this.props.maxGraphSize}
          step={0.01}
          format={x=>x.toFixed(2)}
          positiveColor={positiveColor}
          negativeColor={negativeColor}
          onChange={this.handleWeightSliderChange}
          onChangeComplete={this.handleWeightSliderComplete}
        /></td>
        <td>
          <div className="factor-odds-ratio">{Math.exp(this.props.value.weight).toFixed(2)}</div>
        </td>
        <td className="comment_column">
          <CommentDropdown className="overlay_img"
            icon_class = {this.state.comments.length > 0 ? "icon_comment" : "icon_comment_empty"}
            icon_url = {this.state.comments.length > 0 ? CommentImg : CommentEmptyImg}
            comments = {this.state.comments}
            handleUpdateComments={this.handleUpdateComments}
            model_id = {this.state.model_id}
            factor_name = {this.state.name} />
        </td>
        <td>
          <input
            type="submit"
            value="Balance Model"
            className={balanceButtonClassNames}
            disabled={!(this.state.is_binary && this.state.is_enabled)}
            onClick={this.handleBalanceSelect} />
        </td>
        <td className="center-contents">
          <input
            pattern='-?[0-9]*\.?[0-9]*'
            className="input_weight"
            value={this.state.textWeight}
            onChange={this.handleWeightInputChange}
            onBlur={this.handleWeightInputComplete}
            />
        </td>
      </tr>
    );
  }

  handleWeightSliderChange(newWeight) {
    this.setState({sliderWeight: newWeight});
  }

  handleWeightSliderComplete(event) {
    const newWeight = parseFloat(this.state.sliderWeight.toFixed(2));
    this.setState({textWeight: newWeight});
    this.props.onChange(this.props.index, "weight", newWeight);
  }

  handleWeightInputChange(event) {
    this.setState({textWeight: event.target.value});
  }

  handleWeightInputComplete(event) {
    if (!isNaN(this.state.textWeight)) {
      const weight = Number(this.state.textWeight);
      this.setState({sliderWeight: weight});
      const newRows = this.props.onChange(this.props.index, "weight", this.state.textWeight);
      if (Math.abs(weight) > this.props.maxGraphSize) {
        this.props.updateGraphSizes(newRows);
      }
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

export default ModelRow;