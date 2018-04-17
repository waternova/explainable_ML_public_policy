import React, { Component } from 'react';
import './common.css';
import './header.css';
import { Link } from 'react-router-dom';
import HomeImg from './images/home.svg';
import ModelsImg from './images/models.svg';
import DatasetsImg from './images/datasets.svg';
import LinksImg from './images/links.svg';
import IconImg from './images/MLE_icon.png';

const MenuItem = ({children, to}) => (
    <Link to={to} className="menu-item">
            {children}
    </Link>
)

class Header extends Component {
  render () {
    return (
      <div>
        <table className="header_table"><tbody>
          <tr>
            <td className="header_title_td">
              <img src={IconImg} className="header_title_icon" alt="icon"/>
              <div className="header_title_div">
                <span className="header_title_text">
                  <span className="header_title_text_big">M</span>achine
                  <span className="header_title_text_big">&nbsp;L</span>earning
                  <span className="header_title_text_big">&nbsp;E</span>xplorer
                </span>
              </div>
            </td>
            <td className="header_table_menu">
              <MenuItem to={'/'}>
                <img src={HomeImg} className="icon_small icon_red" alt="icon"/>Home
              </MenuItem>
              <MenuItem to={'/ModelList'}>
                <img src={ModelsImg} className="icon_small icon_purple" alt="icon"/>Models
              </MenuItem>
              <MenuItem to={'/DataSetList'}>
                <img src={DatasetsImg} className="icon_small icon_blue" alt="icon"/>Datasets
              </MenuItem>
              <MenuItem to={'/Links'}>
                <img src={LinksImg} className="icon_small icon_green" alt="icon"/>Links
              </MenuItem>
            </td>
         </tr>
        </tbody></table>
      </div>
    );
  }
};

export default Header;