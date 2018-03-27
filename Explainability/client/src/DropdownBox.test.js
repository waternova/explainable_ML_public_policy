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

it('should show the label added in the props', () => {
  const wrapper = mount(
    <DropdownBox labelValue="Stuff">
      <p>Hello World</p>
    </DropdownBox>
  );
  const label = wrapper.find('.Dropdown-label');
  expect(label.text()).toBe("Stuff");
});
