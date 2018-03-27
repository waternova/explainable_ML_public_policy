import React from 'react';
import ReactDOM from 'react-dom';
import DropdownBox from './DropdownBox.js';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('should render without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DropdownBox />, div);
});

it('should not show interior menu default render', () => {
  const wrapper = mount(
    <DropdownBox>
      <form></form>
    </DropdownBox>
  );
  const form = wrapper.find('form');
  expect(form.length).toEqual(0);
});
