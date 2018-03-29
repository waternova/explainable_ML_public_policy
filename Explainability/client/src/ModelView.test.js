import React from 'react';
import ReactDOM from 'react-dom';
import ModelView from './ModelView';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('should render without error', () => {
  const match = {params: {id: 4}};
  const div = document.createElement('div');
  const modelView = ReactDOM.render(
    (<ModelView 
      match={match} 
      skipFactorLoad={true} />
    ), div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('bar graph updates', () => {
  let modelView, div;
  beforeEach(done => {
    div = document.createElement('div');
    const match = {params: {id: 4}};
    modelView = shallow(
      (<ModelView 
        match={match} 
        skipFactorLoad={true} />
      ), div);
    const rows = [{id: 3, weight: 1.2}, {id: 2, weight: -4.3}];
    modelView.setState({rows: rows}, done);
  });

  it('should have updateWeight method that updates the weight of a single factor', () => {
    modelView.instance().updateWeight(1, 2.1);
    expect(modelView.state().rows[1].weight).toEqual(2.1);
  });

  it('should have updateGraphSizes method that resets the largest weight to be 100px wide', () => {
    modelView.instance().updateGraphSizes();
    expect(modelView.state().rows[1].graphSize).toEqual(-100);
  });
});