import React from 'react';
import PropTypes from 'prop-types';


export default class UserCompletedRegistration extends React.Component {

    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="card-body registration-card">
                <div className="row mb-md-5">
                <div className="d-none d-md-block col-md-2 col-12"><i className="fas fa-4x fa-pencil-alt pencil-icon"></i></div>
                    <div className="col-md-8 col-12"><h4 className="card-title">All Done!</h4></div>
                </div>
                <div className="row text-center">
                    <div className="col-md-4 offset-md-4 col-8 offset-2">
                        <i className="ml-md-4 far fa-9x fa-sun primary-color"></i>
                    </div>
                </div>
                <div className="row text-center mt-5 mb-5">
                    <div className="col-10 offset-1">
                        <h4 className="text-muted primary-font"> Thanks for signing up!</h4>
                        <h4 className="text-muted primary-font"> A dedicted rep will review the data and get back to you within 1 hour.</h4>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-12 btn-cols text-center">
                        <button type="button" className="btn btn-primary btn-lg btn-block btn-link"> <a className="sales-rep-link primary-font" href={"mailto:sales@coastlinemarket.com"}> CONTACT SALES REP </a> </button>
                    </div>
                </div>
            </div>
        );
    }
}

UserCompletedRegistration.propTypes = {
    nextPage: PropTypes.func,
    prevPage: PropTypes.func,
    formData: PropTypes.object
};