import React from 'react';
import PropTypes from 'prop-types';


export default class UserInvites extends React.Component {

    constructor(props) {
        super(props)
        console.log(this.props)
        const { inviteEmails } = this.props.formData
        console.log(inviteEmails)
        const email1 = inviteEmails.length >= 1? inviteEmails[0] : null
        const email2 = inviteEmails.length >= 2? inviteEmails[1] : null
        const email3 = inviteEmails.length >= 3? inviteEmails[2] : null
        
        this.state = {
            inviteEmails,
            email1,
            isEmail1Valid: !!email1,
            email1ErrorText: null,
            email2,
            email2ErrorText: null,
            isEmail2Valid: !!email2,
            email3,
            isEmail3Valid: !!email3,
            email3ErrorText: null,
            submitError: null,
        }
        this.checkEmails = this.checkEmails.bind(this)
        this.submitPage = this.submitPage.bind(this)
        this.goBack = this.goBack.bind(this)
    }

    checkEmails() {
        const { email1, email2, email3 } = this.state
        const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
        const errorText = "Please provide a valid email"
        if (email1 && email1.match(emailRegex))
            this.setState({
                isEmail1Valid: true,
                email1ErrorText: false
            })
        else if(email1 && !email1.match(emailRegex))
            this.setState({
                isEmail1Valid: false,
                email1ErrorText: errorText
            })
        if (email2 && email2.match(emailRegex))
            this.setState({
                isEmail2Valid: true,
                email2ErrorText: false
            })
        else if(email2 && !email2.match(emailRegex))
            this.setState({
                isEmail2Valid: false,
                email2ErrorText: errorText
            })
        if (email3 && email3.match(emailRegex))
            this.setState({
                isEmail3Valid: true,
                email3ErrorText: false
            })
        else if(email3 && !email3.match(emailRegex))
            this.setState({
                isEmail3Valid: false,
                email3ErrorText: errorText
            })
        if(email1 == "")
            this.setState({
                email1ErrorText: null
            })
        if(email2 == "")
            this.setState({
                email2ErrorText: null
            })
        if(email3 == "")
            this.setState({
                email3ErrorText: null
            })
    }

    displaySubmitError() {
        return (
            <div className="alert alert-danger" role="alert">
                <strong>Oh snap!</strong> Please fix the invalid fields.<br />
            </div>
        )
    }

    submitPage() {
        const { email1, email2, email3, isEmail1Valid, isEmail2Valid, isEmail3Valid } = this.state
        const { nextPage } = this.props
        let inviteEmails = []
        if (!isEmail1Valid && email1.length || !isEmail2Valid && email2.length || !isEmail3Valid && email3.length) {
            this.setState({
                submitError: true,
            })
            return
        }
        // these are the required fields that must be validated prior to continuing
        if (email1 && isEmail1Valid)
            inviteEmails.push(email1)
        if (email2 && isEmail2Valid)
            inviteEmails.push(email2)
        if (email3 && isEmail3Valid)
            inviteEmails.push(email3)
        
        // everything is good, flip the page
        nextPage({ inviteEmails })
    }
    
    goBack() {
        const { email1, email2, email3, isEmail1Valid, isEmail2Valid, isEmail3Valid, inviteEmails } = this.state
        const { prevPage } = this.props
        for (let key in this.state) {
            if (this.state[key] !== null && this.state[key] != "")
                // skip any keys that are filled but not valid
                if(key == "email1" && isEmail1Valid)
                    inviteEmails.push(email1)
                if(key == "email2" && isEmail2Valid)
                    inviteEmails.push(email2)
                if(key == "email3" && isEmail3Valid)
                    inviteEmails.push(email3)
        }
        console.log(inviteEmails)
        prevPage({ inviteEmails })
    }
    render() {
        const { email1, email2, email3, isEmail1Valid, isEmail2Valid, isEmail3Valid, email1ErrorText, email2ErrorText, email3ErrorText, submitError} = this.state
        return (
            <div className="card-body">
                <h4 className="card-title">All Done!</h4>
                <h6> Thanks for signing up! </h6>
                <h6> Invite other members of your team to join: </h6>
                {submitError ? this.displaySubmitError() : null}
                <div className="form-group">
                    <label>Email # 1 {isEmail1Valid ? <span className="badge badge-success">Success</span> : null} </label>
                    <input defaultValue={email1} onChange={(event) => this.setState({ email1: event.target.value })} onBlur={this.checkEmails} type="text" name="" id="" className="form-control" placeholder="Your Email" />
                    <small> {email1ErrorText ? email1ErrorText : null} </small>
                </div>
                <div className="form-group">
                    <label>Email # 2{isEmail2Valid ? <span className="badge badge-success">Success</span> : null} </label>
                    <input defaultValue={email2}  onChange={(event) => this.setState({ email2: event.target.value })} onBlur={this.checkEmails} type="text" name="" id="" className="form-control" placeholder="Your Email" />
                    <small> {email2ErrorText ? email2ErrorText : null} </small>
                </div>
                <div className="form-group">
                    <label>Email # 3{isEmail3Valid ? <span className="badge badge-success">Success</span> : null} </label>
                    <input defaultValue={email3} onChange={(event) => this.setState({ email3: event.target.value })} onBlur={this.checkEmails} type="text" name="" id="" className="form-control" placeholder="Your Email" />
                    <small> {email3ErrorText ? email3ErrorText : null} </small>
                </div>
                <button onClick={this.submitPage} type="button" className="btn btn-primary btn-lg btn-block"> Next !! </button>
                <button onClick={this.goBack} type="button" className="btn btn-primary btn-lg btn-block"> Prev !! </button>
            </div>
        );
    }
}

UserInvites.propTypes = {
    nextPage: PropTypes.func,
    prevPage: PropTypes.func,
    formData: PropTypes.object
};