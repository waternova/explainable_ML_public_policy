import React, { Component } from 'react';
import Popover from 'react-simple-popover';

class OddsRatioDescription extends Component {
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
      <div style={{position: 'relative', display: 'inline'}}>
        <button
          className="button"
          ref="target"
          onClick={this.handleClick.bind(this)}>?</button>
        <Popover
          placement='right'
          container={this}
          target={this.refs.target}
          show={this.state.open}
          onHide={this.handleClose.bind(this)}
          containerStyle={{zIndex: 1000}} >
          <div>
            <h4>Odds Ratio</h4>
            <p>
              If the factor is at its maximum, the predicted variable will be that many times more likely.
              For example, if the odds ratio is 2, the predicted variable is twice as likely when 
              the factor is at its maximum.
            </p>
          </div>
        </Popover>
      </div>
    );
  }
}

export default OddsRatioDescription;