import React from 'react';
import ReactDOM from 'react-dom';
import CommentDropdown from './CommentDropdown.js';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('should render without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CommentDropdown />, div);
});

it('should not show a form on default render', () => {
  const wrapper = mount(
    <CommentDropdown />
  );
  const form = wrapper.find('form');
  expect(form.length).toEqual(0);
});
