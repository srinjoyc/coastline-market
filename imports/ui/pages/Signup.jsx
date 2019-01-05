import React, { Component } from 'react';
import { merge } from 'lodash'
import UserReg from '../components/signup/UserReg';
import UserInfo from '../components/signup/UserInfo';
import UserDeliveryInfo from '../components/signup/UserDeliveryInfo';
import UserPaymentInfo from '../components/signup/UserPaymentInfo';
import UserInvites from '../components/signup/UserInvites';

export default class Registration extends Component {

  constructor(props) {
    super(props);
    // all the fields needed to create a new user
    this.state = {
      currentPage: 4,
      formData: {
        // User Reg
        email: null,
        password: null,
        // User Info
        name: null,
        role: null,
        restaurantName: null,
        restaurantType: null,
        phoneNumber: null,
        companyAddress: null,
        gMapsCompanyAddress: null,
        // User Delivery Info
        deliveriesFrom: null,
        deliveriesTo: null,
        specialInstructions: null,
        // User Payment Info
        paymentMethod: null,
        requestedTerms: null,
        accountingEmail: null,
        // User Payment Info: if EFT is selected
        financialInstituionName: null,
        bankBranchAddress: null,
        bankAccountNumber: null,
        bankTransitNumber: null,
        gMapsBankBranchAddress: null,
        // User Payment Info: if CC is selected
        creditCardNumber: null,
        creditCardName: null,
        creditCardExpiry: null,
        creditCardCVC: null,
        isCreditCardVerified: null,

        inviteEmails: [],
      }
    }

    this.nextPage = this.nextPage.bind(this)
    this.prevPage = this.prevPage.bind(this)
  }

  // saves data and moves to next page
  nextPage(submittedPageValues) {
    const { formData, currentPage } = this.state
    // merge the submitted values into the state before moving forward
    this.setState({
      formData: merge(formData, submittedPageValues),
      currentPage: currentPage + 1
    }, () => console.log(formData))
  }

  // saves any filled values on current page and moves to previous page
  prevPage(submittedPageValues) {
    const { formData, currentPage } = this.state
    // merge the (not null) submitted values into the state before going back
    this.setState({
      formData: merge(formData, submittedPageValues),
      currentPage: currentPage - 1
    }, () => console.log(formData))
  }

  render() {
    const { currentPage } = this.state
    const { formData } = this.state

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 offset-3">
            <div className="card">
              {currentPage === 1 &&
                <UserReg formData={formData} nextPage={this.nextPage} />
              }
              {currentPage === 2 &&
                <UserInfo formData={formData} prevPage={this.prevPage} nextPage={this.nextPage} />
              }
              {currentPage === 3 &&
                <UserDeliveryInfo formData={formData} prevPage={this.prevPage} nextPage={this.nextPage} />
              }
              {currentPage === 4 &&
                <UserPaymentInfo formData={formData} prevPage={this.prevPage} nextPage={this.nextPage} />
              }
              {currentPage === 5 &&
                <UserInvites formData={formData} prevPage={this.prevPage} nextPage={this.nextPage} />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
