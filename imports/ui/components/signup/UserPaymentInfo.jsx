import React from 'react';
import PropTypes from 'prop-types';


export default class UserPaymentInfo extends React.Component {

    constructor(props) {
        super(props)
        console.log(props)
        const { paymentMethod, requestedTerms, accountingEmail, financialInstituionName, 
            bankBranchAddress, bankAccountNumber, bankTransitNumber,
            creditCardNumber, creditCardName, creditCardExpiry, creditCardCVC } = this.props.formData
        this.state = {
            paymentMethod: paymentMethod? paymentMethod : "EFT (Direct Debit)",
            requestedTerms: requestedTerms? requestedTerms : "NET 14",
            accountingEmail,
            financialInstituionName: financialInstituionName? financialInstituionName : "BANK OF NOVA SCOTIA",
            bankBranchAddress,
            isBranchAddressValid: !!bankBranchAddress,
            bankAccountNumber,
            bankTransitNumber,
            creditCardNumber,
            creditCardName,
            creditCardExpiry,
            creditCardCVC,
        }
        // bind states to func
        this.submitPage = this.submitPage.bind(this)
        this.goBack = this.goBack.bind(this)
    }

    // if validated, sends all values to parent.
    submitPage() {
        const {isEmailValid, isPasswordValid, isPasswordConfirmed} =  this.state
        // these are the required fields that must be validated prior to continuing
        if(isEmailValid && isPasswordValid && isPasswordConfirmed) {
            const submittedValues = {
                email: this.state.email,
                password: this.state.password
            }
            // everything is good, flip the page
            this.props.nextPage(submittedValues)
        } else {
            // something missing or not valid, show submit error
            this.setState({ submitErrorMessage: true }, () => {
                setTimeout(() => {
                  this.setState({ submitErrorMessage: false })
                }, 3000)
            })
        }
    }

    goBack() {
        this.props.prevPage(this.state)
    }

    // shows an alert box if all the fields are not valid on this page
    displaySubmitError() {
        return (
          <div className="alert alert-danger" role="alert">
            <strong>Oh snap!</strong> Please fix the invalid fields.<br/>
          </div>
        )
    }

    render() {
        return (
            <div className="card-body">
                <h4 className="card-title">Accounting Setup</h4>
                {this.state.submitErrorMessage? this.displaySubmitError() : null }
                <div className="form-group row">
                    <div className="col-sm-6 col-12">
                        <label>Deliveries From {this.state.isEmailValid? <span className="badge badge-success">Success</span> : null } </label>
                        <input onChange={(event)=> this.setState({ name: event.target.value}) } onBlur={this.checkName} type="text" name="" id="" className="form-control" placeholder="Your Name"/>
                        <small> {this.state.emailErrorText? this.state.emailErrorText : null } </small>
                    </div>
                    <div className="col-sm-6 col-12">
                        <label>Deliveries To {this.state.isEmailValid? <span className="badge badge-success">Success</span> : null } </label>
                        <input onChange={(event)=> this.setState({ name: event.target.value}) } onBlur={this.checkName} type="text" name="" id="" className="form-control" placeholder="Your Name"/>
                        <small> {this.state.emailErrorText? this.state.emailErrorText : null } </small>
                    </div>
                    <div className="col-12">
                        <label>Special Instructions {this.state.isEmailValid? <span className="badge badge-success">Success</span> : null } </label>
                        <input onChange={(event)=> this.setState({ name: event.target.value}) } onBlur={this.checkName} type="text" name="" id="" className="form-control" placeholder="Your Name"/>
                        <small> {this.state.emailErrorText? this.state.emailErrorText : null } </small>
                    </div>
                </div>
                <button onClick={this.submitPage} type="button"className="btn btn-primary btn-lg btn-block"> Next !! </button>
                <button onClick={this.goBack} type="button"className="btn btn-primary btn-lg btn-block"> Prev !! </button>
            </div>
        );
    }
}

UserPaymentInfo.propTypes = {
    nextPage: PropTypes.func,
    prevPage: PropTypes.func,
    formData: PropTypes.object
};