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
  }
})