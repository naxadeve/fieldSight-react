import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';

import ResponseTable from '../../responded/SurveyFormResponseTable';
import DeleteTable from '../deleteTable';
import { getProjectViewData } from '../../../../actions/viewDataActions';
/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */

class ManageSurveyForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hide: true,
    };
  }

  componentDidMount() {
    if (this.props.id !== '') {
      this.props.getProjectViewData(this.props.id, 'survey');
    }
  }

  toggleHide = () => {
    this.setState(state => ({
      hide: !state.hide,
    }));
  };

  render() {
    const {
      props: {
        survey_forms,
        deleted_forms,
        survey_forms_loader,

        id,
      },
    } = this;
    return (
      <>
        <div className="card-header main-card-header sub-card-header">
          <h5>
            <FormattedMessage
              id="app.generate-form"
              defaultMessage="General Forms"
            />
          </h5>
          <Link to={`/project-submission-responses/${id}/rejected`}>
            <button type="button" className="fieldsight-btn">
              <FormattedMessage
                id="app.view-by-form"
                defaultMessage="View By Form"
              />
            </button>
          </Link>
        </div>
        <div className="card-body">
          {/* {!data && ( */}
          <ResponseTable
            survey_forms={survey_forms}
            id={id}
            loader={survey_forms_loader}
          />
          {/* )} */}
        </div>
        {deleted_forms.length > 0 && (
          <div className="card no-boxshadow">
            <div className="card-header main-card-header sub-card-header">
              <h5>
                <FormattedMessage
                  id="app.deleted-forms"
                  defaultMessage="Deleted Forms"
                />
              </h5>
              <div className="dash-btn">
                {this.state.hide ? (
                  <button
                    type="button"
                    className="btn-toggle"
                    onClick={this.toggleHide}
                    style={{ width: '97px' }}
                  >
                    <FormattedMessage
                      id="app.show"
                      defaultMessage="Show"
                    />
                    <div className="handle" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-toggle"
                    onClick={this.toggleHide}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      textAlign: 'left',
                      width: '97px',
                    }}
                  >
                    <FormattedMessage
                      id="app.hide"
                      defaultMessage="Hide"
                    />
                    <div
                      className="handle"
                      style={{ left: 'auto', right: '0.1875rem' }}
                    />
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              {!this.state.hide && (
                <DeleteTable
                  id={id}
                  deleted_forms={deleted_forms}
                  loader={survey_forms_loader}
                />
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}
const mapStateToProps = ({ projectViewData }) => {
  const {
    survey_forms,
    deleted_forms,
    survey_forms_loader,
  } = projectViewData;

  return {
    survey_forms,
    deleted_forms,
    survey_forms_loader,
  };
};

export default compose(
  connect(mapStateToProps, {
    getProjectViewData,
  }),
)(ManageSurveyForm);
