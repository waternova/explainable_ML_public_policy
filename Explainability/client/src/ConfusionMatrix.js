import React from 'react';
import './ConfusionMatrix.css';

const ConfusionMatrix = props => (
  <div className="confusion-matrix">
  <h4>{props.headerText}</h4>
  {props.thresholdText ? <div>{props.thresholdText}</div> : null}
  <table style={{opacity: props.tableOpacity}}>
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
        <td style={{backgroundColor: 'rgb(0, 255, 0,' + props.matrix.true_negative_count/props.maxSize +')'}}>
          True negative: {props.matrix.true_negative_count}
        </td>
        <td style={{backgroundColor: 'rgb(255, 0, 0,' + props.matrix.false_positive_count/props.maxSize +')'}}>
          False positive: {props.matrix.false_positive_count}
        </td>
      </tr>
      <tr>
        <td className="left-border">Actually positive</td>
        <td style={{backgroundColor: 'rgb(255, 0, 0,' + props.matrix.false_negative_count/props.maxSize +')'}}>
          False negative: {props.matrix.false_negative_count}
        </td>
        <td style={{backgroundColor: 'rgb(0, 255, 0,' + props.matrix.true_positive_count/props.maxSize +')'}}>
          True positive: {props.matrix.true_positive_count}
        </td>
      </tr>
    </tbody>
  </table>
  </div>
);

export default ConfusionMatrix;
