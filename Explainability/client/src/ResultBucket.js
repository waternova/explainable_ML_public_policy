import React, { Component } from 'react';
import './ResultBucket.css';

class ResultBucket extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var tnp = Math.round(this.props.matrix.true_negative_count/this.props.totalSize * 100);
    var tpp = Math.round(this.props.matrix.true_positive_count/this.props.totalSize * 100);
    var fnp = Math.round(this.props.matrix.false_negative_count/this.props.totalSize * 100);
    var fpp = Math.round(this.props.matrix.false_positive_count/this.props.totalSize * 100);
    return (
      <table className="result_bucket">
        <tr>
        <td className="positive_bucket">
          <span className="ball_true_positive">{"●".repeat(tpp)}</span>
          <span className="ball_false_positive">{"●".repeat(fpp)}</span>
        </td>
        <td className="center_bucket"></td>
        <td className="negative_bucket">
          <span className="ball_true_negative">{"●".repeat(tnp)}</span>
          <span className="ball_false_negative">{"●".repeat(fnp)}</span>
        </td>
        </tr>
      </table>
    );
  }
}

export default ResultBucket;