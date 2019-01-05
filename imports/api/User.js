import { Customers } from '../collections/Customer.js'
import { Meteor } from 'meteor/meteor'
import { Accounts } from "meteor/accounts-base"
import { Email } from 'meteor/email'

Meteor.methods({

  /**
   * @description Checks if the user's email exists.
   * @param {String} email 
   * @returns {Boolean} If the user's email is available or not.
   */
  'user.checkAvailableEmail'(email) {
    console.log(email)
    if(email == undefined) {
      return false
    }
    if(!!email.length) {
      var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
      if(email.match(pattern) == null) {
        throw new Meteor.Error('Email', 'Email is not valid.');
      } else {
        return true
      }
    }
  },
  /**
   * @description Checks if password meets criteria.
   * @param {String} password 
   * @returns {Boolean} If password is valid or not.
   */
  'user.checkPassword'(password) {
    console.log(password)
    if(password == undefined) {
      return false
    }
    if(password.length >= 8) {
      return true
    } else {
      throw new Meteor.Error('Password', 'Password needs to be more than 8 characters long.');
    }
  },
  'user.submitRegistrationData'(formData) {
    console.log(formData)
    const { email, password } = formData
    if (email && password){
      delete formData.password
      const userId = Accounts.createUser({ username: email, email, password, profile: formData })
      console.log(userId)
      return userId
    } else {
      throw new Meteor.Error('User Creation', 'Email or Password are incorrect.');
    }
  },
  'user.sendInviteEmails'(inviteEmails, userId) {
    Meteor.users.update({_id: userId}, {$set: {"profile.inviteEmails": inviteEmails }});
    this.unblock();
    if (inviteEmails.length > 0){
      inviteEmails.forEach(email => {
        Email.send({ to: email, from: "srinjoycal@gmail.com", subject: "hello", text: "this is a test" })
      });
    }
    return true
  },
  'users.getUsers'() {
    return Meteor.users.find({}).fetch()
  }
})