import React, { Component } from 'react';
import { merge } from 'lodash'
import UserReg from '../components/signup/UserReg';
import UserInfo from '../components/signup/UserInfo';
import UserDeliveryInfo from '../components/signup/UserDeliveryInfo';
import UserPaymentInfo from '../components/signup/UserPaymentInfo';
import UserInvites from '../components/signup/UserInvites';
import UserCompletedRegistration from '../components/signup/UserCompletedRegistration';

export default class Registration extends Component {

  constructor(props) {
    super(props);
    // all the fields needed to create a new user
    this.state = {
      currentPage: 1,
      completed: false,
      userId: null,
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
        creditCardExpiryYear: null,
        creditCardExpiryMonth: null,
        creditCardCVC: null,
        completed: false,
        emailed: false,
        inviteEmails: [],
      }
    }

    this.nextPage = this.nextPage.bind(this)
    this.prevPage = this.prevPage.bind(this)
  }

  // saves data and moves to next page
  nextPage(submittedPageValues) {
    const { formData, currentPage } = this.state
    let createdUserId;
    console.log(submittedPageValues)
    // merge the submitted values into the state before moving forward
    this.setState({
      formData: merge(formData, submittedPageValues),
      currentPage: currentPage + 1
    }, () => {
      console.log(currentPage)
      console.log(formData)
      if (currentPage == 4) {
        Meteor.call('user.submitRegistrationData', formData, (err, userId) => {
          if(err) {
            console.log(err)
          }
          if(userId) {
            console.log(userId)
            this.setState({
              formData: merge(formData, { completed: true, userId }),
            })
          }
        })
      }
      if (currentPage == 5) {
        console.log("sending inivte emails...")
        console.log(formData.userId)
        Meteor.call('user.sendInviteEmails', formData.inviteEmails, formData.userId, (err, resp) => {
          if(err) {
            console.log(err)
          }
          if(resp) {
            console.log("sent!!!! inivte emails...")
            this.setState({
              formData: merge(formData, { emailed: true }),
            })
          }
        })
      }
    })
  }

  // saves any filled values on current page and moves to previous page
  prevPage(submittedPageValues) {
    const { formData, currentPage } = this.state
    // merge the (not null) submitted values into the state before going back
    this.setState({
      formData: merge(formData, submittedPageValues),
      currentPage: currentPage - 1
    }, () => console.log("done"))
  }

  render() {
    const { currentPage, formData } = this.state
    console.log(formData)
    return (
      <div className="container-fluid registration-container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div id="card-container" className="card">
              {currentPage === 1 &&
                <UserReg currentPage={currentPage} formData={formData} nextPage={this.nextPage} />
              }
              {currentPage === 2 &&
                <UserInfo currentPage={currentPage} formData={formData} prevPage={this.prevPage} nextPage={this.nextPage} />
              }
              {currentPage === 3 &&
                <UserDeliveryInfo currentPage={currentPage} formData={formData} prevPage={this.prevPage} nextPage={this.nextPage} />
              }
              {currentPage === 4 &&
                <UserPaymentInfo currentPage={currentPage} formData={formData} prevPage={this.prevPage} nextPage={this.nextPage} />
              }
              {currentPage === 5 &&
                <UserInvites currentPage={currentPage} formData={formData} prevPage={this.prevPage} nextPage={this.nextPage} />
              }
              {currentPage === 6 &&
                <UserCompletedRegistration currentPage={currentPage} formData={formData} />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
