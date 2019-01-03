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
      currentPage: 5,
      formData: {
        email: null,
        password: null,
        name: null,
        role: null,
        restaurantName: null,
        restaurantType: null,
        phoneNumber: null,
        companyAddress: null,
        deliveriesFrom: null,
        deliveriesTo: null,
        specialInstructions: null,
        paymentMethod: null,
        requestedTerms: null,
        accountingEmail: null,
        financialInstituionName: null,
        bankBranchAddress: null,
        bankAccountNumber: null,
        bankTransitNumber: null,
        inviteEmails: [],
      }
    }
    // give state access to these functions
    this.nextPage = this.nextPage.bind(this)
    this.prevPage = this.prevPage.bind(this)
  }

  nextPage(submittedPageValues) {
    this.setState({
      formData: merge(this.state.formData, submittedPageValues),
      currentPage: this.state.currentPage + 1
    }, () => console.log(this.state.formData))
  }

  prevPage(submittedPageValues) {
    this.setState({
      formData: merge(this.state.formData, submittedPageValues),
      currentPage: this.state.currentPage - 1
    }, () => console.log(this.state.formData))
  }

  render() {
    const { currentPage } = this.state

    return(
      <div className="container-fluid">
        <div class="row">
          <div className="col-md-6 offset-3">
            <div className="card">
              { currentPage === 1 &&
                <UserReg nextPage={this.nextPage}/>
              }
              { currentPage === 2 &&
                <UserInfo formData={this.state.formData} prevPage={this.prevPage} nextPage={this.nextPage}/>
              }
              { currentPage === 3 &&
                <UserDeliveryInfo formData={this.state.formData} prevPage={this.prevPage} nextPage={this.nextPage}/>
              }
              { currentPage === 4 &&
                <UserPaymentInfo formData={this.state.formData} prevPage={this.prevPage} nextPage={this.nextPage}/>
              }
              { currentPage === 5 &&
                <UserInvites formData={this.state.formData} prevPage={this.prevPage} nextPage={this.nextPage}/>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
