import React from 'react';
import ReactDOM from 'react-dom';
import ModelView from './ModelView';

it('should render without error', () => {
  const match = {params: {id: 4}};
  const div = document.createElement('div');
  const modelView = ReactDOM.render(
    (<ModelView 
      match={match} 
      skipFactorLoad={true} />
    ), div);
});

// it('should have updateWeight method that updates the weight of a single factor', () => {
//   const div = document.createElement('div');
//   const modelView = ReactDOM.render(<ModelView />, div);
// });
