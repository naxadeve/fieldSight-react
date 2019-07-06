import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import uuid from "uuid/v4";
import format from "date-fns/format";

class Submission extends Component {
  handleRepeatedSubmission = submission => {
    return (
      <Accordion key={uuid()} defaultActiveKey={submission.name}>
        <Card>
          <Card.Header>
            <h5>
              <Accordion.Toggle
                as={Button}
                variant="link"
                eventKey={submission.name}
              >
                {submission.label ? submission.label : submission.name}
              </Accordion.Toggle>
            </h5>
          </Card.Header>
          <Accordion.Collapse eventKey={submission.name}>
            <Card.Body>
              {submission.elements &&
                submission.elements.map(sub => {
                  return sub.type === "group" || sub.type === "repeated"
                    ? this.handleRepeatedSubmission(sub)
                    : this.handleUnrepeatedSubmission(sub);
                })}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  };

  handleUnrepeatedSubmission = submission => {
    if (submission.type === "photo") {
      return (
        <div className="submission-list thumb-list" key={uuid()}>
          <ul>
            <li>
              <div className="content">
                <h6>{submission.question}</h6>
              </div>
              <figure>
                <img src={submission.answer} alt="image" />
              </figure>
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="submission-list normal-list" key={uuid()}>
          <ul>
            <li>
              <h6>{submission.question}</h6>
              {submission.type === "start" ||
              submission.type === "end" ||
              submission.type === "datetime" ? (
                <time>
                  <i className="la la-clock-o">
                    {format(submission.answer, ["MMMM Do YYYY,  h:mm:ss a"])}{" "}
                  </i>
                </time>
              ) : (
                <p>{submission.answer}</p>
              )}
            </li>
          </ul>
        </div>
      );
    }
  };

  renderSubmission = submissionData => {
    return submissionData.map((submission, i) => {
      if (submission.type === "group" || submission.type === "repeat") {
        return this.handleRepeatedSubmission(submission);
      } else {
        return this.handleUnrepeatedSubmission(submission);
      }
    });
  };

  render() {
    const { dateCreated, submittedBy, submissionData } = this.props;

    return (
      <div className="group-submission mrt-30">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header main-card-header sticky-top">
                <div className="head-right">
                  <h5>household survey</h5>
                  <div className="submitted-header">
                    <div className="submit-by">
                      <label>by :</label> {submittedBy}
                    </div>
                    <time>
                      <label>on:</label> {format(dateCreated, "MM-DD-YYYY")}
                    </time>
                  </div>
                </div>
              </div>
              <div className="card-body submission-card">
                {submissionData && this.renderSubmission(submissionData)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Submission;
