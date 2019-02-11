import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor'
import { Redirect } from 'react-router'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: null,
            success: false,
        }
        // all the fields needed to create a new user
        this.login = this.login.bind(this)
    }
    login(){
        const { username, password, error} = this.state
        Meteor.loginWithPassword(username, password, (err, resp) => {
            if(err){
                console.log(err)
                this.setState({ error: err.reason })
                setTimeout(() => {
                    this.setState({ error: null })
                }, 2000)
            } else {
                console.log(resp)
                this.setState({ success: true })
            }
        })
    }
    render(){
        return(
            <div className="container">
                {this.state.error ?
                <div className="alert alert-danger" role="alert">
                  <h4 className="alert-heading">{this.state.error}</h4>
                  <p></p>
                  <p className="mb-0"></p>
                </div>
                : null}
                <form>
                    <div className="form-group row">
                        <label for="inputName" className="col-8 offset-2 col-form-label"> Username </label>
                        <div className="col-8 offset-2">
                            <input type="text" className="form-control" name="email" id="inputName" onChange={(e) => this.setState({username: e.target.value })} placeholder=""/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label for="inputName" className="col-8 offset-2 col-form-label"> Password </label>
                        <div className="col-8 offset-2">
                            <input type="text" className="form-control" name="password" id="inputName" onChange={(e) => this.setState({password: e.target.value })} placeholder=""/>
                        </div>
                    </div>
                    <div className="col-4 offset-4">
                        <button type="button" className="btn btn-block btn-primary" onClick={this.login}>Login</button>
                    </div>
                </form>
                {this.state.success? <Redirect to="/stats" push={true} /> : null }
            </div>
        )
    }
}