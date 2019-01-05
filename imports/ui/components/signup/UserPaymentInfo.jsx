import React from 'react';
import PropTypes from 'prop-types';
import { Logthis } from '../../../../lib/helpers/signup.js'
import moment from 'moment';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete'


export default class UserPaymentInfo extends React.Component {

    constructor(props) {
        super(props)
        console.log(props)
        const { paymentMethod, requestedTerms, accountingEmail, financialInstituionName,
            bankBranchAddress, bankAccountNumber, bankTransitNumber, gMapsBankBranchAddress,
            creditCardNumber, creditCardName, creditCardExpiryMonth, creditCardExpiryYear, creditCardCVC } = this.props.formData
        this.state = {
            // basic info
            paymentMethod: paymentMethod ? paymentMethod : "creditCard",
            requestedTerms: requestedTerms ? requestedTerms : "chargeOnDelivery",
            accountingEmail,
            isEmailValid: null,
            emailErrorText: null,
            // eft info
            financialInstituionName: financialInstituionName ? financialInstituionName : "BANK OF NOVA SCOTIA",
            bankBranchAddress,
            isBranchAddressValid: !!bankBranchAddress,
            gMapsBankBranchAddress,
            bankAccountNumber,
            bankTransitNumber,
            isBankAccountNumberValid: !!bankAccountNumber,
            isBankTransitNumberValid: !!bankTransitNumber,
            accountNumberHelpText: null,
            transitNumberHelpText: null,
            // credit card info
            creditCardNumber,
            creditCardName,
            creditCardExpiryMonth: creditCardExpiryMonth ? creditCardExpiryMonth : 1,
            creditCardExpiryYear,
            creditCardCVC,
            isCreditCardNumberValid: !!creditCardNumber,
            isCreditCardExpiryValid: !!creditCardExpiryMonth && !!creditCardExpiryYear,
            isCreditCardCVCValid: !!creditCardCVC,
            creditCardNumberHelpText: null,
            creditCardExpiryMonthHelpText: null,
            creditCardExpiryYearHelpText: null,
            creditCardCVCHelpText: null,
        }
        // bind states to func
        this.checkEmail = this.checkEmail.bind(this)
        this.displayEFTInfo = this.displayEFTInfo.bind(this)
        this.displayCreditCardInfo = this.displayCreditCardInfo.bind(this)
        this.submitPage = this.submitPage.bind(this)
        this.goBack = this.goBack.bind(this)
        this.handleBankAddressChange = this.handleBankAddressChange.bind(this)
        this.handleBankBranchAddressSelect = this.handleBankBranchAddressSelect.bind(this)

        this.checkTransitNumber = this.checkTransitNumber.bind(this)
        this.checkAccountNumber = this.checkAccountNumber.bind(this)

        this.checkCreditCardNumber = this.checkCreditCardNumber.bind(this)
        this.checkCreditCardExpiry = this.checkCreditCardExpiry.bind(this)
        this.checkCreditCardCVC = this.checkCreditCardCVC.bind(this)
    }

    handleBankAddressChange(bankBranchAddress) {
        this.setState({
            bankBranchAddress
        })
    }

    handleBankBranchAddressSelect(bankBranchAddress) {
        geocodeByAddress(bankBranchAddress)
            .then(results => this.setState({
                gMapsBankBranchAddress: results,
                bankBranchAddress: results[0].formatted_address
            }))
            .then(() => this.setState({
                isBranchAddressValid: true
            }))
            .catch(error => console.error('Error', error))
    }

    renderGmapAutocomplete() {
        const { bankBranchAddress } = this.state
        return (
            <PlacesAutocomplete
                value={bankBranchAddress}
                onChange={this.handleBankAddressChange}
                onSelect={this.handleBankBranchAddressSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: 'Search Places ...',
                                className: 'location-search-input form-control',
                                autoComplete: "off"
                            })}
                        />
                        <div className="autocomplete-dropdown-container">
                            {suggestions.map(
                                suggestion => {
                                    const className = suggestion.active ? 'suggestion-item-active' : 'suggestion-item';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                        ? { backgroundColor: '#00A0DC', cursor: 'pointer' }
                                        : { backgroundColor: '#86888A', cursor: 'pointer' };
                                    return (
                                        <div {...getSuggestionItemProps(suggestion, { className, style })}>
                                            <span>{suggestion.description}</span>
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
        );
    }

    checkEmail() {
        const { accountingEmail, emailErrorText } = this.state
        Meteor.call('user.checkAvailableEmail', accountingEmail, (err, resp) => {
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
    // if validated, sends all values to parent.
    submitPage() {
        console.log("submitting")
        const { paymentMethod, requestedTerms, accountingEmail } = this.state
        const { nextPage } = this.props
        let submittedValues = {}
        if (paymentMethod == "creditCard") {
            const { creditCardName, creditCardNumber, creditCardExpiryMonth, creditCardExpiryYear, creditCardCVC,
                isCreditCardNumberValid, isCreditCardExpiryValid, isCreditCardCVCValid } = this.state

            if (creditCardName &&
                creditCardNumber && isCreditCardNumberValid &&
                creditCardExpiryMonth && creditCardExpiryYear && isCreditCardExpiryValid &&
                creditCardCVC && isCreditCardCVCValid &&
                requestedTerms && accountingEmail) {
                submittedValues = {
                    paymentMethod,
                    requestedTerms,
                    accountingEmail,
                    creditCardName,
                    creditCardNumber,
                    creditCardExpiryMonth,
                    creditCardExpiryYear,
                    creditCardCVC,
                }
                console.log(submittedValues)
                nextPage(submittedValues)
            }
            else {
                // something missing or not valid, show submit error
                this.setState({ submitErrorMessage: true }, () => {
                    setTimeout(() => {
                        this.setState({ submitErrorMessage: false })
                    }, 3000)
                })
            }
        } else if (paymentMethod == "EFT") {
            const { financialInstituionName, bankBranchAddress, gMapsBankBranchAddress, bankAccountNumber, bankTransitNumber,
                isBankAccountNumberValid, isBankTransitNumberValid, isBranchAddressValid } = this.state
            if (financialInstituionName &&
                bankBranchAddress && isBranchAddressValid && gMapsBankBranchAddress
                && bankAccountNumber && isBankAccountNumberValid &&
                bankTransitNumber && isBankTransitNumberValid &&
                requestedTerms && accountingEmail) {
                // eft info options
                submittedValues = {
                    paymentMethod,
                    requestedTerms,
                    accountingEmail,
                    financialInstituionName,
                    bankBranchAddress,
                    gMapsBankBranchAddress,
                    bankAccountNumber,
                    bankTransitNumber
                }
                console.log(submittedValues)
                nextPage(submittedValues)
            }
            else {
                // something missing or not valid, show submit error
                this.setState({ submitErrorMessage: true }, () => {
                    setTimeout(() => {
                        this.setState({ submitErrorMessage: false })
                    }, 3000)
                })
            }
        }
    }

    goBack() {
        let submittedValues = {}
        for (let key in this.state) {
            if (this.state[key] !== null && this.state[key] != "")
                submittedValues[key] = this.state[key]
        }
        console.log(submittedValues)
        this.props.prevPage(submittedValues)
    }

    // shows an alert box if all the fields are not valid on this page
    displaySubmitError() {
        return (
            <div className="alert alert-danger" role="alert">
                <strong>Oh snap!</strong> Please fix the invalid fields.<br />
            </div>
        )
    }

    checkTransitNumber() {
        const transitNumberRegex = /^[0-9]{5}$/
        if (this.state.bankTransitNumber.match(transitNumberRegex)) {
            this.setState({
                isBankTransitNumberValid: true,
                transitNumberHelpText: null
            })
        } else {
            this.setState({
                isBankTransitNumberValid: false,
                transitNumberHelpText: "Your transit number should be 5 digits long."
            })
        }
    }
    checkAccountNumber() {
        const { bankAccountNumber } = this.state
        const accountNumberRegex = /^[0-9]{5,12}$/
        if (bankAccountNumber.match(accountNumberRegex)) {
            this.setState({
                isBankAccountNumberValid: true,
                accountNumberHelpText: null
            })
        } else {
            this.setState({
                isBankAccountNumberValid: false,
                accountNumberHelpText: "Your account number should be between 5 and 12 digits long."
            })
        }
    }

    displayEFTInfo() {
        const { financialInstituionName, bankBranchAddress, bankAccountNumber, bankTransitNumber,
            isBranchAddressValid, isBankAccountNumberValid, isBankTransitNumberValid, accountNumberHelpText, transitNumberHelpText } = this.state
        return (
            <div className="row mb-2">
                <div className="col-12">
                    <h4 className="card-title">EFT Credit Information</h4>
                    <label> Financial Institution Name {financialInstituionName ? <span className="badge badge-success">Success</span> : null} </label>
                    <div className="input-group">
                        <select defaultValue={financialInstituionName} onChange={(event) => this.setState({ financialInstituionName: event.target.value })} className="custom-select">
                            <option value="scotiabank">Scotiabank</option>
                            <option value="cibc">CIBC</option>
                        </select>
                    </div>
                </div>
                <div className="col-12">
                    <label> Branch Address {isBranchAddressValid ? <span className="badge badge-success">Success</span> : null} </label><br />
                    <small> Must select an address from the list. </small>
                    {this.renderGmapAutocomplete()}
                </div>
                <div className="col-6">
                    <label> Account Number {isBankAccountNumberValid ? <span className="badge badge-success">Success</span> : null} </label>
                    <input defaultValue={bankAccountNumber} onChange={(event) => this.setState({ bankAccountNumber: event.target.value })} onBlur={this.checkAccountNumber} type="text" name="accountNumber" id="" className="form-control" placeholder="345879" />
                    <small> {accountNumberHelpText ? accountNumberHelpText : null} </small>
                </div>
                <div className="col-6">
                    <label> Transit Number {isBankTransitNumberValid ? <span className="badge badge-success">Success</span> : null} </label>
                    <input type="text" maxLength="5" defaultValue={bankTransitNumber} onChange={(event) => this.setState({ bankTransitNumber: event.target.value })} onBlur={this.checkTransitNumber} name="transitNumber" id="" className="form-control" placeholder="12345" />
                    <small> {transitNumberHelpText ? transitNumberHelpText : null} </small>
                </div>
            </div>
        )
    }

    checkCreditCardNumber() {
        let { creditCardNumber } = this.state
        if (creditCardNumber) {
            creditCardNumber = creditCardNumber.match(/\d/g)
            creditCardNumber = creditCardNumber.join("")
            const creditCardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
            if (creditCardNumber.match(creditCardRegex)) {
                this.setState({
                    isCreditCardNumberValid: true,
                    creditCardNumberHelpText: null
                })
            } else {
                this.setState({
                    isCreditCardNumberValid: false,
                    creditCardNumberHelpText: "Your credit card doesn't seem to match any valid formats."
                })
            }
        }
    }
    checkCreditCardExpiry() {
        const { creditCardExpiryMonth, creditCardExpiryYear } = this.state
        const currentYear = moment().year()
        const currentMonth = moment().month()
        if (creditCardExpiryYear <= currentYear && creditCardExpiryMonth && creditCardExpiryYear) {
            if (creditCardExpiryYear == currentYear) {
                if (creditCardExpiryMonth <= currentMonth) {
                    this.setState({
                        creditCardExpiryHelpText: "Invalid Expiry Date",
                        isCreditCardExpiryValid: false,
                    })
                } else {
                    this.setState({
                        creditCardExpiryHelpText: null,
                        isCreditCardExpiryValid: true,
                    })
                }
            } else {
                this.setState({
                    creditCardExpiryHelpText: "Invalid Expiry Date",
                    isCreditCardExpiryValid: false,
                })
            }
        } else if (creditCardExpiryMonth && creditCardExpiryYear && creditCardExpiryYear <= 2040) {
            this.setState({
                creditCardExpiryHelpText: null,
                isCreditCardExpiryValid: true,
            })
        } else if (creditCardExpiryMonth && creditCardExpiryYear && creditCardExpiryYear > 2040) {
            this.setState({
                creditCardExpiryHelpText: "Invalid Expiry Date",
                isCreditCardExpiryValid: false,
            })
        }
    }
    checkCreditCardCVC() {
        const { creditCardCVC } = this.state
        if (creditCardCVC.length == 3) {
            this.setState({
                isCreditCardCVCValid: true,
                creditCardCVCHelpText: null
            })
        } else {
            this.setState({
                isCreditCardCVCValid: false,
                creditCardCVCHelpText: "CVC should be 3 digits."
            })
        }

    }
    displayCreditCardInfo() {
        const { creditCardNumber, creditCardName, creditCardExpiry, creditCardCVC, creditCardExpiryMonth, creditCardExpiryYear,
            isCreditCardNumberValid, isCreditCardExpiryValid, isCreditCardCVCValid, isCreditCardVerified,
            creditCardNumberHelpText, creditCardExpiryHelpText, creditCardCVCHelpText } = this.state
        return (
            <div className="row mb-2">
                <h4 className="card-title">Credit Card Information </h4>
                <div className="col-12">
                    <label>Credit Card Number {isCreditCardNumberValid ? <span className="badge badge-success">Success</span> : null} </label>
                    <input defaultValue={creditCardNumber} onChange={(event) => this.setState({ creditCardNumber: event.target.value })} onBlur={this.checkCreditCardNumber} type="text" name="" id="" className="form-control" placeholder="5500-0000-0000-0004" />
                    <small> {creditCardNumberHelpText ? creditCardNumberHelpText : null} </small>
                </div>
                <div className="col-12">
                    <label>Name on Credit Card {creditCardName ? <span className="badge badge-success">Success</span> : null} </label>
                    <input defaultValue={creditCardName} onBlur={(event) => this.setState({ creditCardName: event.target.value })} type="text" name="" id="" className="form-control" placeholder="Your Name" />
                </div>
                <div className="col-4">
                    <label>Expiry Month {isCreditCardExpiryValid ? <span className="badge badge-success">Success</span> : null} </label>
                    <div className="input-group">
                        <select defaultValue={creditCardExpiryMonth} onChange={(event) => this.setState({ creditCardExpiryMonth: event.target.value })} onBlur={this.checkCreditCardExpiry} className="custom-select">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </div>
                    <small> {creditCardExpiryHelpText ? creditCardExpiryHelpText : null} </small>
                </div>
                <div className="col-4">
                    <label>Expiry Year {isCreditCardExpiryValid ? <span className="badge badge-success">Success</span> : null} </label>
                    <input defaultValue={creditCardExpiryYear} onChange={(event) => this.setState({ creditCardExpiryYear: event.target.value })} onBlur={this.checkCreditCardExpiry} type="text" pattern="\d*" maxLength="4" name="" id="" className="form-control" placeholder="Year" />
                    <small> {creditCardExpiryHelpText ? creditCardExpiryHelpText : null} </small>
                </div>
                <div className="col-4">
                    <label>CVC {isCreditCardCVCValid ? <span className="badge badge-success">Success</span> : null} </label>
                    <input defaultValue={creditCardCVC} onChange={(event) => this.setState({ creditCardCVC: event.target.value })} onBlur={this.checkCreditCardCVC} type="text" pattern="\d*" maxLength="3" name="" id="" className="form-control" placeholder="CVC" />
                    <small> {creditCardCVCHelpText ? creditCardCVCHelpText : null} </small>
                </div>

            </div>
        )
    }
    render() {
        const { paymentMethod, requestedTerms, isEmailValid, accountingEmail } = this.state
        return (
            <div className="card-body">
                <h4 className="card-title">Accounting Setup</h4>
                {this.state.submitErrorMessage ? this.displaySubmitError() : null}
                <div className="form-group row">
                    <div className="col-sm-6 col-12">
                        <label>Payment Method {<span className="badge badge-success">Success</span>} </label>
                        <div className="input-group">
                            <select defaultValue={paymentMethod} onChange={(event) => this.setState({ paymentMethod: event.target.value })} className="custom-select">
                                <option value="EFT">EFT (Direct Debit)</option>
                                <option value="creditCard">Credit Card</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-6 col-12">
                        <label> Requested Terms {<span className="badge badge-success">Success</span>} </label>
                        <div className="input-group">
                            <select defaultValue={requestedTerms ? requestedTerms : "chargeOnDelivery"} onChange={(event) => this.setState({ requestedTerms: event.target.value })} className="custom-select">
                                <option value="chargeOnDelivery">Charge on Delivery</option>
                                <option value="net7">NET 7</option>
                                <option value="net14">NET 14</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12">
                        <label>Accounting Email {isEmailValid ? <span className="badge badge-success">Success</span> : null} </label>
                        <input defaultValue={accountingEmail} onChange={(event) => this.setState({ accountingEmail: event.target.value })} onBlur={this.checkEmail} type="text" name="" id="" className="form-control" placeholder="Your Name" />
                        <small> {this.state.emailErrorText ? this.state.emailErrorText : null} </small>
                    </div>
                </div>
                {paymentMethod == "EFT" ? this.displayEFTInfo() : this.displayCreditCardInfo()}
                <div className="col-12 my-5">
                    <small className="my-5">
                        Completing the above form serves as a digital signature, representing the account holder. You, the Payor, authorize COASTLINE MARKETING INC.
                        to debit the bank account identified above, for the value of the services you have purchased. You, the Payor, may revoke your authorization,
                        at any time, subject to providing notice of 30 days. To obtain a sample cancellation form, or for more information on your right to cancel a
                        PAD Agreement, contact your financial institution or visit www.cdnpay.ca.
                    </small>
                </div>
                <button onClick={this.submitPage} type="button" className="btn btn-primary btn-lg btn-block"> Next !! </button>
                <button onClick={this.goBack} type="button" className="btn btn-primary btn-lg btn-block"> Prev !! </button>
            </div>
        );
    }
}

UserPaymentInfo.propTypes = {
    nextPage: PropTypes.func,
    prevPage: PropTypes.func,
    formData: PropTypes.object
};