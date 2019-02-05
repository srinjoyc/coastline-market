import {
  Meteor
} from 'meteor/meteor'
import {
  Accounts
} from "meteor/accounts-base"
import {
  Email
} from 'meteor/email'


Meteor.methods({

  /**
   * @description Checks if the user's email exists.
   * @param {String} email
   * @returns {Boolean} If the user's email is available or not.
   */
  'user.checkAvailableEmail'(email) {
    if (email == undefined) {
      return false
    }
    if (!!email.length) {
      var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
      if (email.match(pattern) == null) {
        throw new Meteor.Error('Email', 'Email is not valid.');
      } else {
        // check if any other user has the same email
        const emailAlreadyExist = Meteor.users.find({
          "emails.address": email
        }, {
          limit: 1
        }).count() > 0;
        console.log(emailAlreadyExist)
        if (emailAlreadyExist)
          throw new Meteor.Error('Email', 'Email is already registered.');
        // return true if userid was null and thus email is not taken.
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
    if (password == undefined) {
      return false
    }
    if (password.length >= 8) {
      return true
    } else {
      throw new Meteor.Error('Password', 'Password needs to be more than 8 characters long.');
    }
  },
  /**
   * @description Creates a new user acccount and associates the formdata to that account.
   * @param {Object} formData - Check Signup.jsx for all values.
   * @returns Error if problem, the userID if a new user was succesfully created.
   */
  'user.submitRegistrationData'(formData) {
    const {
      email,
      password
    } = formData
    if (email && password) {
      delete formData.password
      const userId = Accounts.createUser({
        username: email,
        email,
        password,
        profile: formData
      })
      return userId
    } else {
      throw new Meteor.Error('User Creation', 'Email or Password are incorrect.');
    }
  },
  /**
   * @description Associates the invite emails to the user and emails them.
   * @param {Array} inviteEmails - Any referral emails the user has typed in via an array.
   * @param {String} userId - The id of the user to associate the invites to.
   * @returns Error if problem, the userID if a new user was succesfully created.
   */
  'user.sendInviteEmails'(inviteEmails, userId) {
    Meteor.users.update({
      _id: userId
    }, {
      $set: {
        "profile.inviteEmails": inviteEmails
      }
    });
    this.unblock();
    if (inviteEmails.length > 0) {
      inviteEmails.forEach(email => {
        Email.send({
          to: email,
          from: "srinjoycal@gmail.com",
          subject: "hello",
          html: `
          <html>
            <head>
            </head>
            <body>
                <img style="display:none" src="https://cansbridge-db.herokuapp.com/cansbridge_logo.png"/>
            </body>
          </html>
          `
        })
      });
    }
    return true
  },
  /**
   * @description Gets all users in the db.
   * @returns {[Objects]} - An array of user objects.
   */
  'users.getUsers'() {
    return Meteor.users.find({}).fetch()
  }
})
