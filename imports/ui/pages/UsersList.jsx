import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';


export default class Registration extends Component {

  constructor(props) {
    super(props);
    this.state = {
        users: null,
    }
    // all the fields needed to create a new user
  }
  componentDidMount() {
    Meteor.call("users.getUsers", (err, users) => {
        if(err)
            console.log(err)
        if(users)
            this.setState({
                users,
            })
    })
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 offset-3">
            <h1> Users List </h1>
          </div>
        </div>
      </div>
    )
  }
}
