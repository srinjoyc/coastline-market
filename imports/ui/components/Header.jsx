import React from 'react';
import { NavLink } from 'react-router-dom';

export default class Header extends React.Component {
  render() {
    return (
      <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
        <h5 className="my-0 mr-md-auto font-weight-normal"><NavLink activeClassName="active" exact to="/">Coastline Market Registration</NavLink></h5>
        <nav className="my-2 my-md-0 mr-md-3">
          <NavLink activeClassName="active" to="/about">Admin Page</NavLink>
        </nav>
      </div>
    );
    // return (
    //   <header className='nav'>
    //     <NavLink activeClassName="active" exact to="/">Home</NavLink>
    //     <NavLink activeClassName="active" to="/about">Admin Page</NavLink>
    //   </header>
    // );
  }
}
