import React, { Component } from 'react';
import './ResultBucket.css';

class ResultBucket extends Component {
  render() {
    const matrix = this.props.matrix;
    const tnp = Math.round(matrix.true_negative_count/this.props.totalSize * 100);
    const tpp = Math.round(matrix.true_positive_count/this.props.totalSize * 100);
    const fnp = Math.round(matrix.false_negative_count/this.props.totalSize * 100);
    const fpp = Math.round(matrix.false_positive_count/this.props.totalSize * 100);
    const target = this.props.target;
    const totalPositive = matrix.true_positive_count + matrix.false_positive_count;
    const totalNegative = matrix.true_negative_count + matrix.false_negative_count;
    return (
      <div>
        <p>{this.props.totalSize} Test Cases Tested</p>
        <p>Of those, {totalPositive} were classified as '{target}' and {totalNegative} were not.</p>
        <table className="result_bucket">
          <tr>
            <td className="positive_bucket">
              <span className="ball_true_positive">{"●".repeat(tpp)}</span>
              <span className="ball_false_positive">{"●".repeat(fpp)}</span>
            </td>
            <td className="negative_bucket">
              <span className="ball_true_negative">{"●".repeat(tnp)}</span>
              <span className="ball_false_negative">{"●".repeat(fnp)}</span>
            </td>
          </tr>
          <tr>
            <td className="label_bucket">
              {target}:<br/>
              Correctly predicted - {matrix.true_positive_count} / {totalPositive}  <br/>
              Incorrectly predicted - {matrix.false_positive_count} / {totalPositive} <br/>
            </td>
            <td className="label_bucket">
              Not {target}:<br/>
              Correctly predicted - {matrix.true_negative_count} / {totalNegative}  <br/>
              Incorrectly predicted - {matrix.false_negative_count} / {totalNegative} <br/>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export default ResultBucket;