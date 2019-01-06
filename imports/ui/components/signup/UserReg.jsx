import React from 'react';
import PropTypes from 'prop-types';


export default class UserReg extends React.Component {

    constructor(props) {
        super(props)
        const { email, password, confirmPassword } = this.props.formData
        this.state = {
            email,
            emailErrorText: null,
            isEmailValid: !!email,
            password,
            confirmPassword,
            isPasswordConfirmed: !!password,
            passwordHelpText: null,
            confirmPasswordHelpText: null,
            isPasswordValid: !!password,
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
        const { email, password, confirmPassword, isEmailValid, isPasswordValid, isPasswordConfirmed, submitErrorMessage, emailErrorText, confirmPasswordHelpText, passwordHelpText } = this.state
        return (
            <div className="card-body registration-card">
                <div className="row mb-md-5">
                    <div className="d-none d-md-block col-md-2 col-12"><i className="fas fa-4x fa-pencil-alt pencil-icon"></i></div>
                    <div className="col-md-8 col-12"><h4 className="card-title">Registration</h4></div>
                </div>
                {submitErrorMessage ? this.displaySubmitError() : null}
                <div className="form-group">
                    <label>Email {isEmailValid ? <span className="badge badge-success">Success</span> : null} </label>
                    <input defaultValue={email} onChange={(event) => this.setState({ email: event.target.value })} onBlur={this.checkEmail} type="text" name="" id="" className="form-control" />
                    <small> {emailErrorText ? emailErrorText : null} </small>
                </div>
                <div className="form-group">
                    <label>Password {isPasswordValid ? <span className="badge badge-success">Success</span> : null} </label>
                    <input defaultValue={password} onChange={(event) => this.setState({ password: event.target.value })} onBlur={this.checkPassword} type="password" name="" id="" className="form-control" />
                    <small> {passwordHelpText ? passwordHelpText : null} </small>
                </div>
                <div className="form-group">
                    <label>Confirm Password {isPasswordConfirmed ? <span className="badge badge-success">Success</span> : null} </label>
                    <input defaultValue={password} onChange={(event) => this.setState({ confirmPassword: event.target.value })} onBlur={this.checkConfirmPassword} type="password" name="" id="" className="form-control" />
                    <small> {confirmPasswordHelpText ? confirmPasswordHelpText : null} </small>
                </div>
                <div className="row mt-5">
                    <div className="col-md-6 offset-md-6 col-12 text-center">
                        <button onClick={this.submitPage} type="button" className="btn btn-primary btn-lg btn-block"> {this.props.currentPage} of 5 </button>
                    </div>
                </div>
            </div>
        );
    }
}

UserReg.propTypes = {
    nextPage: PropTypes.func,
    formData: PropTypes.object
};