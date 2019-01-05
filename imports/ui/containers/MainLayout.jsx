import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Header from '../components/Header.jsx';
import Signup from '../pages/Signup.jsx';
import UserList from '../pages/UsersList.jsx';
import NotFound from '../pages/NotFound.jsx';

export default class MainLayout extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Header />
            <Switch>
              <Route exact path='/' component={Signup} />
              <Route path = '/users-list' component={UserList} />
              <Route component={NotFound} />
            </Switch>
        </div>
      </Router>
    );
  }
}
