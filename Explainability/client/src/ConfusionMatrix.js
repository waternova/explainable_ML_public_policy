import React from 'react';
import './ConfusionMatrix.css';

const ConfusionMatrix = props => (
  <div className="confusion-matrix">
  <span>{props.headerText}</span>
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
        <td style={{backgroundColor: 'rgb(124, 255, 124,' + props.matrix.true_negative_count/props.maxSize +')'}}>
          <div className="matrix_item">
            <div className="matrix_item_label">True negative</div>
            <div className="matrix_item_value">{props.matrix.true_negative_count}%</div>
          </div>
        </td>
        <td style={{backgroundColor: 'rgb(255, 132, 132,' + props.matrix.false_positive_count/props.maxSize +')'}}>
          <div className="matrix_item">
            <div className="matrix_item_label">False positive</div>
            <div className="matrix_item_value">{props.matrix.false_positive_count}%</div>
          </div>
        </td>
      </tr>
      <tr>
        <td className="left-border">Actually positive</td>
        <td style={{backgroundColor: 'rgb(255, 132, 132,' + props.matrix.false_negative_count/props.maxSize +')'}}>
          <div className="matrix_item">
            <div className="matrix_item_label">False negative</div>
            <div className="matrix_item_value">{props.matrix.false_negative_count}%</div>
          </div>
        </td>
        <td style={{backgroundColor: 'rgb(124, 255, 124,' + props.matrix.true_positive_count/props.maxSize +')'}}>
          <div className="matrix_item">
            <div className="matrix_item_label">True positive</div>
            <div className="matrix_item_value">{props.matrix.true_positive_count}%</div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
);

export default ConfusionMatrix;
