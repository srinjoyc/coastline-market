import React from 'react';
import PropTypes from 'prop-types';


export default class UserCompletedRegistration extends React.Component {

    constructor(props) {
        super(props)
        console.log(this.props)
        console.log("here")
    }
    render() {
        return (
            <div className="card-body">
                <h4 className="card-title">All Done!</h4>
            </div>
        );
    }
}

UserCompletedRegistration.propTypes = {
    nextPage: PropTypes.func,
    prevPage: PropTypes.func,
    formData: PropTypes.object
};