import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Header from '../components/Header.jsx';
import Signup from '../pages/Signup.jsx';
import UserList from '../pages/UsersList.jsx';
import StatsPage from '../pages/Stats.jsx';
import NotFound from '../pages/NotFound.jsx';
import Login from '../pages/Login.jsx';
import { Meteor } from 'meteor/meteor';

export default class MainLayout extends React.Component {
  requireAuth(nextState, replaceState){
    if(!Meteor.userId())
      return false
  }
  render() {
    return (
        <Router>
          <div>
            <Header />
              <Switch>
                <Route exact path='/' component={Login} />
                <Route path = '/users-list' component={UserList} />
                <Route path = '/stats' component={StatsPage} onEnter={this.requireAuth}/>
                <Route component={NotFound} />
              </Switch>
          </div>
        </Router>
    );
  }
}
