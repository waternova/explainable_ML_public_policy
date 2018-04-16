import React, { Component } from 'react';
import './common.css';
import './header.css';
import { Link } from 'react-router-dom';

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
            <td className="header_table_title">
              <img src="/MLE_icon.png" className="header_table_title_icon" alt="icon"/>
              <br/>
              <span className="header_big">M</span>achine
              <span className="header_big">&nbsp;L</span>earning
              <span className="header_big">&nbsp;E</span>xplorer
            </td>
            <td className="header_table_menu">
              <MenuItem to={'/'}>
                <img src="/home.svg" className="icon_small icon_red" alt="icon"/>Home
              </MenuItem>
              <MenuItem to={'/ModelList'}>
                <img src="/models.svg" className="icon_small icon_purple" alt="icon"/>Models
              </MenuItem>
              <MenuItem to={'/DataSetList'}>
                <img src="/datasets.svg" className="icon_small icon_blue" alt="icon"/>Datasets
              </MenuItem>
              <MenuItem to={'/Links'}>
                <img src="/links.svg" className="icon_small icon_green" alt="icon"/>Links
              </MenuItem>
            </td>
         </tr>
        </tbody></table>
      </div>
    );
  }
};

export default Header;