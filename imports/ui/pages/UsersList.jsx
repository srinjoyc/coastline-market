import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class Registration extends Component {

  constructor(props) {
    super(props);
    this.state = {
        users: null,
    }
    // all the fields needed to create a new user
    this.displayUserList = this.displayUserList.bind(this)
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

  displayUserList(){
    const { users } = this.state
    return users.map((user) => (
        <div key={user.emails[0].address} className="col-12">
            <h4 className="text-muted">{user.emails[0].address}</h4>
            <pre className="border-primary">{JSON.stringify(user, null, 4)}</pre>
        </div>
    ));
  }
  render() {
    const { users } = this.state
    return (
      <div className="container-fluid">
        <div className="row">
            {users? this.displayUserList() : <p> Loading... </p>}
        </div>
      </div>
    )
  }
}
