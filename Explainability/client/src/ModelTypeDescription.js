import React, { Component } from 'react';
import Popover from 'react-simple-popover';

class ModelTypeDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
 
  handleClick(e) {
    this.setState({open: !this.state.open});
  }
 
  handleClose(e) {
    this.setState({open: false});
  }
 
  render() {
    return (
      <div className="div_model_attribute" style={{position: 'relative', }}>
        <span className='value_label'>Model Type: </span><span>Logistic Regression</span>
        <button
          className="button"
          ref="target"
          onClick={this.handleClick.bind(this)}>?</button>
        <Popover
          placement='right'
          container={this}
          target={this.refs.target}
          show={this.state.open}
          onHide={this.handleClose.bind(this)} >
          <div>
            <h4>Logistic Regression</h4>
            <p>Logistic Regression finds the best fit for each factor. It's like a linear regression (y = mx + b), but a bit more complicated.</p>
            <p>Learn more from <a href='https://en.wikipedia.org/wiki/Logistic_regression'>Wikipedia's article on logistic regression</a>.</p>
          </div>
        </Popover>
      </div>
    );
  }
}

export default ModelTypeDescription;