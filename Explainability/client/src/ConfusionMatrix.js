import React from 'react';
import './ConfusionMatrix.css';

const ConfusionMatrix = props => (
  <div className="confusion-matrix">
  <h4>{props.headerText}</h4>
  {props.threshold ? <div>Threshold is {props.threshold.toFixed(2)}</div> : null}
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Predicted negative</th>
        <th>Predicted positive</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="left-border">Actually negative</td>
        <td style={{backgroundColor: 'rgb(0, 255, 0,' + props.matrix[0][0]/props.maxSize +')'}}>True negative: {props.matrix[0][0]}</td>
        <td style={{backgroundColor: 'rgb(255, 0, 0,' + props.matrix[0][1]/props.maxSize +')'}}>False positive: {props.matrix[0][1]}</td>
      </tr>
      <tr>
        <td className="left-border">Actually positive</td>
        <td style={{backgroundColor: 'rgb(255, 0, 0,' + props.matrix[1][0]/props.maxSize +')'}}>False negative: {props.matrix[1][0]}</td>
        <td style={{backgroundColor: 'rgb(0, 255, 0,' + props.matrix[1][1]/props.maxSize +')'}}>True positive: {props.matrix[1][1]}</td>
      </tr>
    </tbody>
  </table>
  </div>
);

export default ConfusionMatrix;
