import React from 'react';
import PropTypes from 'prop-types';


export default class UserReg extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: "",
            emailErrorText: null,
            isEmailValid: false,
            password: "",
            confirmPassword: "",
            isPasswordConfirmed: false,
            passwordHelpText: null,
            confirmPasswordHelpText: null,
            isPasswordValid: false,
            submitErrorMessage: false,
        }
        // bind states to func
        this.checkEmail = this.checkEmail.bind(this)
        this.submitPage = this.submitPage.bind(this)
        this.checkPassword = this.checkPassword.bind(this)
        this.checkConfirmPassword = this.checkConfirmPassword.bind(this)
    }

    // verifies email w/ server
    checkEmail() {
        const { email, emailErrorText } = this.state
        Meteor.call('user.checkAvailableEmail', email, (err, resp) => {
            // email did not pass regex or is empty or already registered
            if (err) {
                // display err msg
                console.log(err)
                this.setState({
                    emailErrorText: err.reason,
                    isEmailValid: false
                })
            } else if (resp) {
                // email is good, remove err msg & display success
                if (emailErrorText) {
                    this.setState({ emailErrorText: null })
                }
                // displays the success badge
                this.setState({ isEmailValid: true })
            }
        })
    }

    // verifies password is valid w/ server
    checkPassword() {
        const { password, passwordHelpText } = this.state
        Meteor.call('user.checkPassword', password, (err, resp) => {
            // email did not pass regex or is empty or already registered
            if (err) {
                // display err msg
                console.log(err)
                this.setState({
                    passwordHelpText: err.reason,
                    isPasswordValid: false
                })
            } else if (resp) {
                // email is good, remove err msg & display success
                if (passwordHelpText) {
                    this.setState({
                        passwordHelpText: null
                    })
                }
                // displays the success badge
                this.setState({
                    isPasswordValid: true
                })
            }
        })
    }

    // checks if passwords match (just on front-end)
    checkConfirmPassword() {
        const { password, confirmPassword, confirmPasswordHelpText } = this.state
        if (password !== confirmPassword) {
            this.setState({ 
                confirmPasswordHelpText: "Passwords do not match.", 
                isPasswordConfirmed: false 
            })
        } else {
            if (confirmPasswordHelpText) {
                this.setState({ 
                    confirmPasswordHelpText: null 
                })
            }
            this.setState({ 
                isPasswordConfirmed: true 
            })
        }
    }

    // if validated, sends all values to parent.
    submitPage() {
        const { email, password, isEmailValid, isPasswordValid, isPasswordConfirmed } = this.state
        const { nextPage } = this.props
        // these are the required fields that must be validated prior to continuing
        if (isEmailValid && isPasswordValid && isPasswordConfirmed) {
            const submittedValues = {
                email,
                password,
            }
            // everything is good, flip the page
            nextPage(submittedValues)
        } else {
            // something missing or not valid, show submit error
            this.setState({ 
                submitErrorMessage: true 
            }, () => {
                setTimeout(() => {
                    this.setState({ 
                        submitErrorMessage: false 
                    })
                }, 3000)
            })
        }
    }

    // shows an alert box if all the fields are not valid on this page
    displaySubmitError() {
        return (
            <div className="alert alert-danger" role="alert">
                <strong>Oh snap!</strong> Please fix the invalid fields.<br />
            </div>
        )
    }

    render() {
        const { isEmailValid, isPasswordValid, isPasswordConfirmed, submitErrorMessage, emailErrorText, confirmPasswordHelpText } = this.state
        return (
            <div className="card-body">
                <h4 className="card-title">Registration</h4>
                {submitErrorMessage ? this.displaySubmitError() : null}
                <div className="form-group">
                    <label>Email {isEmailValid ? <span className="badge badge-success">Success</span> : null} </label>
                    <input onChange={(event) => this.setState({ email: event.target.value })} onBlur={this.checkEmail} type="text" name="" id="" className="form-control" placeholder="Your Email" />
                    <small> {emailErrorText ? emailErrorText : null} </small>
                </div>
                <div className="form-group">
                    <label>Password {isPasswordValid ? <span className="badge badge-success">Success</span> : null} </label>
                    <input onChange={(event) => this.setState({ password: event.target.value })} onBlur={this.checkPassword} type="text" name="" id="" className="form-control" placeholder="Your Password" />
                    <small> {passwordHelpText ? passwordHelpText : null} </small>
                </div>
                <div className="form-group">
                    <label>Confirm Password {isPasswordConfirmed ? <span className="badge badge-success">Success</span> : null} </label>
                    <input onChange={(event) => this.setState({ confirmPassword: event.target.value })} onBlur={this.checkConfirmPassword} type="text" name="" id="" className="form-control" placeholder="Your Email" />
                    <small> {confirmPasswordHelpText ? confirmPasswordHelpText : null} </small>
                </div>
                <button onClick={this.submitPage} type="button" className="btn btn-primary btn-lg btn-block"> Click Me !! </button>
            </div>
        );
    }
}

UserReg.propTypes = {
    nextPage: PropTypes.func
};