import React, { Component } from 'react';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
import GeneralForms from './GeneralForms';
import ScheduleForms from './ScheduleForms';
import StagedForms from './StagedFoms';
import ProjectWideForms from './ProjectWideForms';

/* eslint-disable react/destructuring-assignment */

const urls = [
  'fv3/api/project-regions-types/',
  'fv3/api/myforms/',
  'fv3/api/myprojectforms/',
  'fv3/api/sharedforms/',
];

class SideNav extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      regionOptions: [],
      typeOptions: [],
      myForms: [],
      projectForms: [],
      sharedForms: [],
      orgLibraryForms: [],
      loader: false,
      isProjectForm: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const {
      props: {
        match: {
          url,
          params: { id },
        },
      },
    } = this;

    const splitArr = url.split('/');
    const isProjectForm = splitArr.includes('project');
    const isSiteForm = splitArr.includes('site');
    this.setState(
      () => {
        if (isProjectForm) {
          return {
            loader: true,
            isProjectForm,
          };
        }
        if (isSiteForm) {
          return { loader: true, isProjectForm: false };
        }
        return null;
      },
      () => {
        this.requestForms(id);
      },
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  requestForms(id) {
    axios
      .all(
        urls.map((url, i) => {
          if (this.state.isProjectForm) {
            return i === 0
              ? axios.get(`${url}${id}/`)
              : axios.get(url);
          }
          // else {
          return i > 0 && axios.get(url);
          // }
        }),
      )
      .then(
        axios.spread((list, myForms, projectForms, sharedForms) => {
          if (this._isMounted) {
            this.setState(state => {
              if (state.isProjectForm) {
                const { regions } = list.data;
                const types = list.data.site_types;
                if (list.data.has_organization) {
                  this.requestOrgLibraryForms(id);
                }
                return {
                  regionOptions: [
                    {
                      id: 'all',
                      identifier: 'select_all',
                      name: 'select all',
                    },
                    ...regions,
                    {
                      id: 0,
                      identifier: 'unassigned',
                      name: 'unassigned',
                    },
                  ],
                  typeOptions: [
                    {
                      id: 'all',
                      identifier: 'select_all',
                      name: 'select all',
                    },
                    ...types,
                    {
                      id: 0,
                      identifier: 'undefined',
                      name: 'undefined',
                    },
                  ],
                  myForms: myForms.data,
                  projectForms: projectForms.data,
                  sharedForms: sharedForms.data,
                  loader: false,
                };
              }
              // } else {
              return {
                myForms: myForms.data,
                projectForms: projectForms.data,
                sharedForms: sharedForms.data,
                loader: false,
              };
              // }
            });
          }
        }),
      )
      .catch(() => {});
  }

  requestOrgLibraryForms = id => {
    axios
      .get(`/fv3/api/organization-library-forms/${id}/`)
      .then(res => {
        if (res.status === 200) {
          this.setState({ orgLibraryForms: res.data });
        }
      })
      .catch(() => {});
  };

  render() {
    const {
      props: {
        match: { path, url },
        location: { pathname },
        height,
        commonPopupHandler,
        closePopup,
        popupModal,
      },
      state: {
        regionOptions,
        typeOptions,
        myForms,
        projectForms,
        sharedForms,
        loader,
        isProjectForm,
        orgLibraryForms,
      },
    } = this;

    return (
      <>
        <div className="col-xl-3 col-lg-4">
          <div className="left-sidebar new-sidebar sticky-top">
            <div
              className="card no-boxshadow"
              style={{ minHeight: height }}
            >
              <div className="card-header main-card-header">
                <FormattedMessage
                  id="app.manage-forms"
                  defaultMessage="Manage Forms"
                />
              </div>
              <div className="card-body">
                <div className="manage_group">
                  {isProjectForm && (
                    <h5>
                      <FormattedMessage
                        id="app.site-specific-forms"
                        defaultMessage="Site Specific Forms"
                      />
                    </h5>
                  )}
                  <ul className="nav nav-tabs flex-column border-tabs">
                    <li className="nav-item">
                      <Link
                        to={`${url}/generalform`}
                        className={
                          pathname === `${url}/generalform`
                            ? 'nav-link active'
                            : 'nav-link'
                        }
                      >
                        <FormattedMessage
                          id="app.general-forms"
                          defaultMessage="General forms"
                        />
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={`${url}/scheduleform`}
                        className={
                          pathname === `${url}/scheduleform`
                            ? 'nav-link active'
                            : 'nav-link'
                        }
                      >
                        <FormattedMessage
                          id="app.scheduled-form"
                          defaultMessage="Scheduled forms"
                        />
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={`${url}/stageform`}
                        className={
                          pathname === `${url}/stageform`
                            ? 'nav-link active'
                            : 'nav-link'
                        }
                      >
                        <FormattedMessage
                          id="app.staged-form"
                          defaultMessage="Staged Forms"
                        />
                      </Link>
                    </li>
                  </ul>
                </div>
                {isProjectForm && (
                  <div className="manage_group mrt-15">
                    <h5>
                      <FormattedMessage
                        id="app.project-wide-forms"
                        defaultMessage="Project-Wide Forms"
                      />
                    </h5>
                    <ul
                      className="nav nav-tabs flex-column border-tabs"
                      id="myTab"
                      role="tablist"
                    >
                      <li className="nav-item">
                        <Link
                          to={`${url}/wide/generalform`}
                          className={
                            pathname === `${url}/wide/generalform`
                              ? 'nav-link active'
                              : 'nav-link'
                          }
                        >
                          <FormattedMessage
                            id="app.general-forms"
                            defaultMessage="General forms"
                          />
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Switch>
          <Route
            exact
            path={`${path}/generalform`}
            render={props => (
              <GeneralForms
                {...props}
                title="GeneralForms"
                // OpenTabHandler={this.props.OpenTabHandler}
                commonPopupHandler={commonPopupHandler}
                closePopup={closePopup}
                popupModal={popupModal}
                // formResponse={formProps}
                typeOptions={typeOptions}
                regionOptions={regionOptions}
                myForms={myForms}
                projectForms={projectForms}
                sharedForms={sharedForms}
                formLoader={loader}
                orgLibraryForms={orgLibraryForms}
              />
            )}
          />

          <Route
            exact
            path={`${path}/scheduleform`}
            render={props => (
              <ScheduleForms
                {...props}
                title="ScheduleForms"
                // OpenTabHandler={this.props.OpenTabHandler}
                commonPopupHandler={commonPopupHandler}
                closePopup={closePopup}
                popupModal={popupModal}
                typeOptions={typeOptions}
                regionOptions={regionOptions}
                myForms={myForms}
                projectForms={projectForms}
                sharedForms={sharedForms}
                formLoader={loader}
                orgLibraryForms={orgLibraryForms}
              />
            )}
          />

          <Route
            exact
            path={`${path}/stageform`}
            render={props => (
              <StagedForms
                {...props}
                title="StagedForms"
                // OpenTabHandler={this.props.OpenTabHandler}
                commonPopupHandler={commonPopupHandler}
                closePopup={closePopup}
                popupModal={popupModal}
                typeOptions={typeOptions}
                regionOptions={regionOptions}
                myForms={myForms}
                projectForms={projectForms}
                sharedForms={sharedForms}
                formLoader={loader}
                orgLibraryForms={orgLibraryForms}
              />
            )}
          />

          <Route
            exact
            path={`${path}/wide/generalform`}
            render={props => (
              <ProjectWideForms
                {...props}
                title="ProjectWideForms"
                // OpenTabHandler={this.props.OpenTabHandler}
                commonPopupHandler={commonPopupHandler}
                closePopup={closePopup}
                popupModal={popupModal}
                myForms={myForms}
                projectForms={projectForms}
                sharedForms={sharedForms}
                formLoader={loader}
                orgLibraryForms={orgLibraryForms}
              />
            )}
          />
        </Switch>
      </>
    );
  }
}

export default withRouter(SideNav);
