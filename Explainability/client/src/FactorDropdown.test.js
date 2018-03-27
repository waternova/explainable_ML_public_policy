import React from 'react';
import ReactDOM from 'react-dom';
import FactorDropdown from './FactorDropdown.js';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('should render without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FactorDropdown />, div);
});
