import React, { Component } from 'react';
import './common.css';
import './Links.css';


class Links extends Component {
  render() {
    return (
      <div className="links_main">
        <div className="page_title">Related Links</div>
        <table>
          <tr><td className="link_table_row">
            <img src="link.svg" className="link_icon icon_blue" alt="icon"/>
            <a className="link_item" href = "https://www.ischool.berkeley.edu/projects/2018/explainable-machine-learning-public-policy">MIMS 2018 Final Project</a>
          </td></tr>
          <tr><td className="link_table_row">
            <img src="link.svg" className="link_icon icon_blue" alt="icon"/>
            <a className="link_item" href = "https://www.fatml.org">Fairness, Accountability, and Transparency in Machine Learning</a>
          </td></tr>
        </table>
      </div>
    );
  }
}
export default Links;