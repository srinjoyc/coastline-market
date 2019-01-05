import React from 'react';
import PropTypes from 'prop-types';


export default class UserInvites extends React.Component {

    constructor(props) {
        super(props)
        console.log(this.props)
        console.log("here")
    }
    render() {
        return (
            <div className="card-body">
                <h4 className="card-title">All Done!</h4>
                {this.state.submitErrorMessage? this.displaySubmitError() : null }
                <div className="form-group row">
                    <div className="col-sm-6 col-12">
                        <label>Deliveries From {this.state.isEmailValid? <span className="badge badge-success">Success</span> : null } </label>
                        <input onChange={(event)=> this.setState({ name: event.target.value}) } onBlur={this.checkName} type="text" name="" id="" className="form-control" placeholder="Your Name"/>
                        <small> {this.state.emailErrorText? this.state.emailErrorText : null } </small>
                    </div>
                    <div className="col-sm-6 col-12">
                        <label>Deliveries To {this.state.isEmailValid? <span className="badge badge-success">Success</span> : null } </label>
                        <input onChange={(event)=> this.setState({ name: event.target.value}) } onBlur={this.checkName} type="text" name="" id="" className="form-control" placeholder="Your Name"/>
                        <small> {this.state.emailErrorText? this.state.emailErrorText : null } </small>
                    </div>
                    <div className="col-12">
                        <label>Special Instructions {this.state.isEmailValid? <span className="badge badge-success">Success</span> : null } </label>
                        <input onChange={(event)=> this.setState({ name: event.target.value}) } onBlur={this.checkName} type="text" name="" id="" className="form-control" placeholder="Your Name"/>
                        <small> {this.state.emailErrorText? this.state.emailErrorText : null } </small>
                    </div>
                </div>
                <button onClick={this.showProps} type="button"className="btn btn-primary btn-lg btn-block"> Next !! </button>
                <button onClick={this.goBack} type="button"className="btn btn-primary btn-lg btn-block"> Prev !! </button>
            </div>
        );
    }
}

UserInvites.propTypes = {
    nextPage: PropTypes.func,
    prevPage: PropTypes.func,
    formData: PropTypes.object
};