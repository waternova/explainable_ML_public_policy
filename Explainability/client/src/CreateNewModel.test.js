import React from 'react';
import ReactDOM from 'react-dom';
import CreateNewModel from './CreateNewModel';

it('should render without crashing when using static dataset list', () => {
  const staticDatasetList = [
    {id: 4, name: 'set2'},
    {id: 3, name: 'set1'}
  ]
  const div = document.createElement('div');
  ReactDOM.render(<CreateNewModel staticDatasetList={staticDatasetList} />, div);
});

describe('testing create new model', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should render without crashing when loading from api', () => {
    const staticDatasetList = [
      {id: 4, name: 'set2'},
      {id: 3, name: 'set1'}
    ]
    fetch.mockResponseOnce(JSON.stringify(staticDatasetList));
    const div = document.createElement('div');
    ReactDOM.render(<CreateNewModel />, div);
  });
});
