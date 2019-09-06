import React, { Component } from "react";

class PricingStepThree extends Component {
  render() {
    const {
      props: { packageDetails, handleSubmit }
    } = this;
    return (
      <div className="fieldsight-new">
        <div className="bg-primary p-4">
          <div className="bg-light p-4 m-4">
            <div className="pb-2"></div>
            <h6 className="text-center mt-4">
              <strong>Thank you for signing up with FieldSight!</strong>
            </h6>
            <h5 className="text-center mt-2 mb-3">
              <strong>You have selected the Free Plan</strong>
            </h5>
            <p className="text-center mb-4 text-xlight">
              FieldSight subscription fees are charged at the start of
              delivering service and renew automatically.
            </p>
            <div className="row">
              <div className="col-md-4">
                <h6 className="mt-4">
                  <strong>Plan Detail :</strong>
                </h6>
                <ul className="list-icon mt-4 mb-4">
                  <li>
                    <i className="la la-chevron-circle-right"></i>
                    <strong>250</strong> Submissions
                  </li>
                  <li>
                    <i className="la la-chevron-circle-right"></i>
                    <strong>15</strong> Users, <strong>2</strong>
                    Projects, <strong>10</strong> Sites
                  </li>
                  <li>
                    <i className="la la-chevron-circle-right"></i>
                    <strong>Unlimited</strong> Forms, Stages & Schedules
                  </li>
                  <li>
                    <i className="la la-chevron-circle-right"></i>
                    <strong>Unlimited</strong> Reports, Dashboards & Maps
                  </li>
                  <li>
                    <i className="la la-chevron-circle-right"></i>
                    <strong>Access</strong> to our Android App
                  </li>
                </ul>
              </div>
              <div className="col-md-4">
                <h6 className="mt-4">
                  <strong>Plan Period :</strong>
                </h6>
                <ul className="list-icon mt-4 mb-4">
                  <li>
                    <i className="la la-calendar-check-o"></i>
                    <strong>Starting Date</strong>
                    <p>Sunday, March 24, 2019</p>
                  </li>
                  <li>
                    <i className="la la-calendar-minus-o"></i>
                    <strong>Ending Date</strong>
                    <p>Sunday, March 24, 2020</p>
                  </li>
                </ul>
              </div>
              <div className="col-md-4">
                <h6 className="mt-4">
                  <strong>Payment Detail :</strong>
                </h6>
                <ul className="list-icon mt-4 mb-4">
                  <li>
                    <i className="la la-money"></i>
                    <strong>Amount Paid</strong>
                    <p>$3,000</p>
                  </li>
                  <li>
                    <i className="la la-cc-mastercard"></i>
                    <strong>Payment Method</strong>
                    <p>Card: xxx xxx xxx 1234</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <a
                title=""
                className="btn btn-primary"
                onClick={() => {
                  handleSubmit("finish");
                }}
              >
                Finish <i className="la la-check-circle"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PricingStepThree;
