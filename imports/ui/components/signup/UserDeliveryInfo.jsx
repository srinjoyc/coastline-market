import React from 'react';
import PropTypes from 'prop-types';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import 'rc-time-picker/assets/index.css';

const timeFormat = 'h a';
const defaultDeliveryStart = moment().hour(8)
const defaultDeliveryEnd = moment().hour(17)

export default class UserDeliveryInfo extends React.Component {

    constructor(props) {
        super(props)
        console.log(this.props)
        const { deliveriesFrom, deliveriesTo, specialInstructions } = this.props.formData
        this.state = {
            deliveriesFrom: deliveriesFrom ? deliveriesFrom : 8,
            deliveriesTo: deliveriesTo ? deliveriesTo : 17,
            specialInstructions: specialInstructions ? specialInstructions : null,
            isTimesValid: true,
            invalidTimeHelpText: null,
        }
        // bind states to func
        this.onDeliveryFromTimeChange = this.onDeliveryFromTimeChange.bind(this)
        this.onDeliveryToTimeChange = this.onDeliveryToTimeChange.bind(this)
        this.submitPage = this.submitPage.bind(this)
        this.goBack = this.goBack.bind(this)
    }

    // verifies password is valid w/ server
    checkPassword() {
        Meteor.call('user.checkPassword', this.state.password, (err, resp) => {
            // email did not pass regex or is empty or already registered
            if (err) {
                // display err msg
                console.log(err)
                this.setState({ passwordHelpText: err.reason, isPasswordValid: false })
            } else if (resp) {
                // email is good, remove err msg & display success
                if (this.state.passwordHelpText) {
                    this.setState({ passwordHelpText: null })
                }
                // displays the success badge
                this.setState({ isPasswordValid: true })
            }
        })
    }

    // if validated, sends all values to parent.
    submitPage() {
        const { isTimesValid } = this.state
        // these are the required fields that must be validated prior to continuing
        if (isTimesValid) {
            const { deliveriesFrom, deliveriesTo, specialInstructions } = this.props.formData
            const submittedValues = {
                deliveriesFrom: this.state.deliveriesFrom,
                deliveriesTo: this.state.deliveriesTo,
                specialInstructions: this.state.specialInstructions
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
        let submittedValues = {}
        for (let key in obj) {
            if (obj[key] !== null && obj[key] != "")
                submittedValues[key] = obj
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

    onDeliveryFromTimeChange(value) {
        const deliveryHour = value.hour()
        this.setState({ deliveriesFrom: value ? value.hour() : now.format(timeFormat) })
        if (deliveryHour < this.state.deliveriesTo) {
            console.log("corrected 1")
            this.setState({ isTimesValid: true })
        } else {
            this.setState({ invalidTimeHelpText: "Delivery From time must be earlier than the Delivery To time.", isTimesValid: false })
        }
        console.log(value && value.format('h a'));
    }
    onDeliveryToTimeChange(value) {
        const deliveryHour = value.hour()
        this.setState({ deliveriesTo: value ? value.hour() : now.format(timeFormat) })
        if (deliveryHour > this.state.deliveriesFrom) {
            console.log("corrected 2")
            this.setState({ isTimesValid: true })
        } else {
            this.setState({ invalidTimeHelpText: "Delivery From time must be earlier than the Delivery To time.", isTimesValid: false })
        }
        console.log(value && value.format('h a'));
    }
    render() {
        return (
            <div className="card-body">
                <h4 className="card-title">Delivery Schedule</h4>
                {this.state.submitErrorMessage ? this.displaySubmitError() : null}
                <div className="form-group row">
                    <div className="col-sm-6 col-12">
                        <label>Deliveries From {this.state.isTimesValid ? <span className="badge badge-success">Success</span> : null} </label>
                        <div>
                            <TimePicker
                                showSecond={false}
                                defaultValue={moment().hour(this.state.deliveriesFrom)}
                                allowEmpty={false}
                                className="xxx"
                                onChange={(value) => this.onDeliveryFromTimeChange(value)}
                                onAmPmChange={(value) => console.log(value)}
                                showMinute={false}
                                format={timeFormat}
                                use12Hours
                            />
                        </div>
                    </div>
                    <div className="col-sm-6 col-12">
                        <label>Deliveries To {this.state.isTimesValid ? <span className="badge badge-success">Success</span> : null} </label>
                        <div>
                            <TimePicker
                                showSecond={false}
                                defaultValue={moment().hour(this.state.deliveriesTo)}
                                allowEmpty={false}
                                className="xxx"
                                onChange={(value) => this.onDeliveryToTimeChange(value)}
                                showMinute={false}
                                format={timeFormat}
                                use12Hours
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <small> {this.state.invalidTimeHelpText ? this.state.invalidTimeHelpText : null} </small>
                    </div>
                    <div className="col-12">
                        <label>Special Instructions (optional) {this.state.specialInstructions ? <span className="badge badge-success">Success</span> : null} </label>
                        <input defaultValue={this.state.specialInstructions ? this.state.specialInstructions : ""} onBlur={(event) => this.setState({ specialInstructions: event.target.value })} type="text" name="" id="" className="form-control" placeholder="Your Name" />
                    </div>
                </div>
                <button onClick={this.submitPage} type="button" className="btn btn-primary btn-lg btn-block"> Next !! </button>
                <button onClick={this.goBack} type="button" className="btn btn-primary btn-lg btn-block"> Prev !! </button>
            </div>
        );
    }
}

UserDeliveryInfo.propTypes = {
    nextPage: PropTypes.func,
    prevPage: PropTypes.func,
    formData: PropTypes.object
};