import React from 'react';
import './ConfusionMatrix.css';

const ConfusionMatrix = props => (
  <table className="confusion-matrix">
    <thead>
      <tr>
        <th>For class {props.index}</th>
        <th>Predicted negative</th>
        <th>Predicted positive</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Actually negative</td>
        <td>True negative: {props.matrix[0][0]}</td>
        <td>False positive: {props.matrix[0][1]}</td>
      </tr>
      <tr>
        <td>Actually positive</td>
        <td>False negative: {props.matrix[1][0]}</td>
        <td>True positive: {props.matrix[1][1]}</td>
      </tr>
    </tbody>
  </table>
);

export default ConfusionMatrix;
