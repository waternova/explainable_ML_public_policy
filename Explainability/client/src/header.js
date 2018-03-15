import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';

const MenuItem = ({active, children, to}) => (
    <Link to={to} className="menu-item">
            {children}
    </Link>
)

const Header = () => {
    return (
        <div>
            <div className="logo">
                Explainable Machine Learning
            </div>
            <div className="menu">
                <MenuItem to={'/'}>Home</MenuItem>
                <MenuItem to={'/ModelList'}>Model List</MenuItem>
                <MenuItem to={'/ModelView'}>Model View</MenuItem>
            </div>
        </div>
    );
};

export default Header;