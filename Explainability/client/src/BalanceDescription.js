import React, { Component } from 'react';
import Popover from 'react-simple-popover';

class BalanceDescription extends Component {
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
          placement='top'
          container={this}
          target={this.refs.target}
          show={this.state.open}
          onHide={this.handleClose.bind(this)} >
          <div>
            <h4>Balance<br /> (Equal Opportunity)</h4>
            <p>
              If a factor is selected to be balanced, individuals within groups 
              where that factor is true or false will have an equal change of 
              having been properly classified if they are predicted to meet the conditions.
              See <a 
                href='https://research.google.com/bigpicture/attacking-discrimination-in-ml/'
                target='_blank'>
              A longer summary from Google</a>.
            </p>
          </div>
        </Popover>
      </div>
    );
  }
}

export default BalanceDescription;