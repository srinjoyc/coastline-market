/** Helper Functions for Sign up */
const Logthis = (value) => {
    console.log(value)
}
const CheckEmail = () => {
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
const Writethis = (value) => {
    console.log(value + ": hi.")
}

module.exports = {
    Logthis,
    Writethis,
    CheckEmail,
}