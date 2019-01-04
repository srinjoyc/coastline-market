import React from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'


export default class UserInfo extends React.Component {

    constructor(props) {
        super(props)
        console.log(this.props)
        const { name, role, restaurantName, restaurantType, phoneNumber, companyAddress, gMapsCompanyAddress } = this.props.formData
        // !! is the boolean value (true if it exists)
        this.state = {
            name,
            role,
            restaurantName,
            restaurantType,
            phoneNumber,
            isValidPhoneNumber: !!phoneNumber,
            phoneNumberHelpText: null,
            companyAddress,
            isCompanyAddressValid: !!companyAddress,
            gMapsCompanyAddress,
        }
        console.log(this.state)
        // bind states to func
        this.submitPage = this.submitPage.bind(this)
        this.goBack = this.goBack.bind(this)

        //helpers
        this.checkPhoneNumber = this.checkPhoneNumber.bind(this)
        this.handleCompanyAddressChange = this.handleCompanyAddressChange.bind(this)
        this.handleCompanyAddressSelect = this.handleCompanyAddressSelect.bind(this)
    }

    handleCompanyAddressChange(companyAddress) {
        this.setState({ 
            companyAddress 
        })
    }

    handleCompanyAddressSelect(companyAddress) {
        geocodeByAddress(companyAddress)
            .then(results => this.setState({
                    gMapsCompanyAddress: results,
                    companyAddress: results[0].formatted_address
                }))
            .then(() => this.setState({
                    isCompanyAddressValid: true
                }))
            .catch(error => console.error('Error', error))
    }

    renderGmapAutocomplete() {
        const { companyAddress  } = this.state
        return (
            <PlacesAutocomplete
                value={companyAddress}
                onChange={this.handleCompanyAddressChange}
                onSelect={this.handleCompanyAddressSelect}
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
    // verifies email w/ server
    checkPhoneNumber() {
        const { phoneNumber } = this.state
        const regexPhoneNumber = /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g
        if (phoneNumber.match(regexPhoneNumber)) {
            this.setState({ 
                isValidPhoneNumber: true, 
                phoneNumberHelpText: null 
            })
        } else {
            this.setState({ 
                phoneNumberHelpText: "Phone number is not valid.", 
                isValidPhoneNumber: false 
            })
        }
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

    // if validated, sends all values to parent.
    submitPage() {
        const { name, role, restaurantName, restaurantType, phoneNumber, companyAddress, gMapsCompanyAddress,
            isValidPhoneNumber, isCompanyAddressValid } = this.state
        const { nextPage } = this.props
        // these are the required fields that must be validated prior to continuing
        if (
            name &&
            role &&
            restaurantName &&
            restaurantType &&
            isValidPhoneNumber &&
            isCompanyAddressValid
        ) {
            const submittedValues = {
                name,
                role,
                restaurantName,
                restaurantType,
                phoneNumber,
                companyAddress,
                gMapsCompanyAddress
            }
            // everything is good, flip the page
            nextPage(submittedValues)
        } else {
            // something missing or not valid, show submit error
            this.setState({ 
                submitErrorMessage: true 
            }, () => {
                setTimeout(() => {
                    this.setState({ submitErrorMessage: false })
                }, 3000)
            })
        }
    }

    goBack() {
        const { isValidPhoneNumber,isCompanyAddressValid} = this.state
        const { prevPage } = this.props
        let submittedValues = {}
        for (let key in this.state) {
            if (this.state[key] !== null && this.state[key] != "")
                // skip any keys that are filled but not valid
                if(key == "phoneNumber" && !isValidPhoneNumber)
                    continue
                if(key == "companyAddress" && !isCompanyAddressValid)
                    continue
                
                submittedValues[key] = this.state[key]
        }
        console.log(submittedValues)
        prevPage(submittedValues)
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
        const { name, role, restaurantName, restaurantType, phoneNumber, companyAddress, gMapsCompanyAddress, 
            phoneNumberHelpText, isValidPhoneNumber, companyAddressHelpText, isCompanyAddressValid } = this.state
        return (
            <div className="card-body">
                <h4 className="card-title">About You</h4>
                {this.state.submitErrorMessage ? this.displaySubmitError() : null}
                <div className="form-group row">
                    <div className="col-sm-6 col-12">
                        <label>Your Name {name? <span className="badge badge-success">Success</span> : null} </label>
                        <input defaultValue={name} onBlur={(event) => this.setState({ name: event.target.value })} type="text" name="" id="" className="form-control" placeholder="Your Name" />
                    </div>
                    <div className="col-sm-6 col-12">
                        <label>Your Role {role? <span className="badge badge-success">Success</span> : null} </label>
                        <div className="input-group">
                            <select defaultValue={role} onChange={(event) => this.setState({ role: event.target.value })} className="custom-select">
                                <option value="Head Chef">Head Chef</option>
                                <option value="Sous Chef">Sous Chef</option>
                                <option value="Purchasing">Purchasing</option>
                                <option value="Owner">Owner</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-6 col-12">
                        <label>Restaurant Name {restaurantName ? <span className="badge badge-success">Success</span> : null} </label>
                        <input defaultValue={restaurantName} onBlur={(event) => this.setState({ restaurantName: event.target.value })} type="text" name="" id="" className="form-control" placeholder="Your Restaurant Name" />
                    </div>
                    <div className="col-sm-6 col-12">
                        <label>Restaurant Type {restaurantType ? <span className="badge badge-success">Success</span> : null} </label>
                        <div className="input-group">
                            <select defaultValue={restaurantType} onChange={(event) => this.setState({ restaurantType: event.target.value })} className="custom-select">
                                <option value="One Location">One Location</option>
                                <option value="Regional">Regional (3-5 locations)</option>
                                <option value="National Chain<">National Chain</option>
                                <option value="Grocery">Grocery</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12">
                        <label>Phone Number {isValidPhoneNumber ? <span className="badge badge-success">Success</span> : null} </label>
                        <input defaultValue={phoneNumber} onChange={(event) => this.setState({ phoneNumber: event.target.value })} onBlur={this.checkPhoneNumber} type="text" name="" id="" className="form-control" placeholder="1-587-9000" />
                        <small> {phoneNumberHelpText ? phoneNumberHelpText : null} </small>
                    </div>
                    <div className="col-12">
                        <label>Company Address {isCompanyAddressValid ? <span className="badge badge-success">Success</span> : null} </label><br/>
                        <small> Must select an address from the list. </small>
                        {this.renderGmapAutocomplete()}
                        <small> {companyAddressHelpText ? companyAddressHelpText : null} </small>
                    </div>
                </div>
                <button onClick={this.submitPage} type="button" className="btn btn-primary btn-lg btn-block"> Next !! </button>
                <button onClick={this.goBack} type="button" className="btn btn-primary btn-lg btn-block"> Prev !! </button>
            </div>
        );
    }
}

UserInfo.propTypes = {
    nextPage: PropTypes.func,
    prevPage: PropTypes.func,
    formData: PropTypes.object
};