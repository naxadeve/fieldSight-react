import React, { Component } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { IntlProvider } from 'react-intl';

import setDefault from '../config';
import Settings from './settings/Settings';
import MyForm from './myForm/MyformMain';
import SiteDashboard from './siteDashboard';
import SiteList from './projectSiteList/SiteList';
import SubmissionDetails from './submissionDetails';
import MyrolesMain from './myRoles/MyrolesMain';
import RegionSite from './regionalSite/RegionSite';
import SiteDocument from './siteDocument/siteDocument';
import SiteUsers from './userDocument';
import TeamUser from './teamUsers/teamUsers';
import ProjectUser from './projectUsers/projectUsers';
import ProjectList from './projectList/projectList';
import ProjectDashboard from './projectDashboard';
import ProjectLog from './projectLogs/projectLogs';
import Teams from './team';
import SiteLog from './siteLogs';
import ProjectAdd from './projectAdd';
import TeamAdd from './teamAdd';
import SiteAdd from './siteAdd';
import EditSite from './SiteEdit';

import SiteSubmissionData from './viewDataComponents/siteViewData/FormSubmission';
import VersionSubmissionData from './viewDataComponents/projectViewData/VersionTable';
import VersionSiteSubmission from './viewDataComponents/siteViewData/VersionTable';
import SubmissionData from './viewDataComponents/projectViewData/SubmissionTable';

import SpecificViewData from './viewDataComponents/projectViewData/SiteSpecificForm';
import SubmissionForm from './viewDataComponents/projectViewData/SubmissionForm';
import SiteViewData from './viewDataComponents/siteViewData/SiteResponses';
import SiteSubmissionForm from './viewDataComponents/siteViewData/SubmissionForm';
import MapFilter from './mapfilter/MapFilter';
import TeamDashboard from './teamDashboard';
import TeamSetting from './settings/TeamSettings';
import ManageForms from './manageForms';
import Mapparent from './team/Mapparent';
import ResetPassword from './ResetPassword';
import UpdateProfile from './updateProject';
import CreateProfile from './ProfileAdd';

// import Header from "./headers";
// import SideNav from "./sideNav";
import ChangePassword from './changePassword';

import SyncSchedule from './syncSchedule';
// import SelectElement from "../components/common/SelectElement";

import AdminDashboard from './adminDashboard';
import SuperAdminFormEdit from './superAdminEdit';
import SuperAdminForm from './superAdminForm';
import SuperAdminSetting from './adminDashboard/organizationSettings/settings';

import FilterDataFilter from './reports/FormDataFilter';
import ExportDataFilter from './reports/ExportDataFilter';
import UserList from './reports/users/usersTable';
import UserProfile from './reports/users/userProfile/index';
import RegionDashboard from './reports/regionDashboard/index';
import UserManage from './reports/users/userManage';
import MyFormTable from './reports/myForm';
import Submission from './reports/submission';

// import AddNewReport from './reports/addNewReport';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'cropperjs/dist/cropper.css';
import '../css/line-awesome.min.css';
import '../scss/style.scss';
import '../css/custom.css';

import English from '../translations/en.json';
import Nepali from '../translations/ne.json';

/* eslint-disable react/jsx-no-undef */

const messages = {
  ne: Nepali,
  en: English,
};
// const language = navigator.language.split(/[-_]/)[0];
// language without region code

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      // region: false,
      // selectedLanguage: language,
      toggleClass: false,
    };
  }

  componentWillMount() {
    setDefault();
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.state.height = window.innerHeight - 181;
  };

  handleToggle = () => {
    return this.setState(state => ({
      toggleClass: !state.toggleClass,
    }));
  };

  render() {
    const { selected } = this.props;
    const { toggleClass, height } = this.state;
    return (
      <IntlProvider locale={selected} messages={messages[selected]}>
        <div id="fieldsight-new" className="fieldsight-new">
          {/* <Header
            toggleClass={this.state.toggleClass}
            handleToggle={this.handleToggle}
          /> */}
          {/* <div
            id="main-container"
<<<<<<< HEAD
            className={`${!this.state.toggleClass ? "minified" : ""}`}
          > */}
          {/* <SideNav handleToggle={this.handleToggle} /> */}
          {/* <div id="main-container" class="minified"> */}
          ======= className={`${!toggleClass ? 'minified' : ''}`}>
          {/* <SideNav handleToggle={this.handleToggle} /> */}
          >>>>>>> 53162957a88fafb66b23a2bef59fd759dc7dd233
          {/* <div className="container-fluid"> */}
          <main id="main-content" className="main-content">
            <Router>
              <Switch>
                <Route
                  path="/project-settings"
                  render={props => <Settings {...props} />}
                />
                <Route
                  path="/team-settings/:id"
                  render={props => (
                    <TeamSetting {...props} height={height} />
                  )}
                />
                <Route
                  path="/forms"
                  render={props => <MyForm {...props} />}
                />
                <Route
                  path="/project-sitelist"
                  render={props => <SiteList {...props} />}
                />

                <Route
                  path="/submission-details"
                  render={props => <SubmissionDetails {...props} />}
                />

                <Route
                  path="/site-dashboard/:id"
                  render={props => <SiteDashboard {...props} />}
                />

                <Route
                  path="/my-roles"
                  render={props => <MyrolesMain {...props} />}
                />

                <Route
                  path="/profile/:profileId"
                  render={props => <MyrolesMain {...props} />}
                />

                <Route
                  path="/regional-site/:id"
                  render={props => <RegionSite {...props} />}
                />
                <Route
                  path="/site-documents/:id"
                  render={props => <SiteDocument {...props} />}
                />

                <Route
                  path="/project-dashboard/:id"
                  render={props => <ProjectDashboard {...props} />}
                />
                <Route
                  path="/team-dashboard/:id"
                  render={props => <TeamDashboard {...props} />}
                />
                <Route
                  path="/site-users/:id"
                  render={props => <SiteUsers {...props} />}
                />

                <Route
                  path="/project-users/:id"
                  render={props => <ProjectUser {...props} />}
                />

                <Route
                  path="/team-users/:id"
                  render={props => <TeamUser {...props} />}
                />

                <Route
                  path="/team-projects/:id"
                  render={props => <ProjectList {...props} />}
                />
                <Route
                  path="/teams"
                  render={props => <Teams {...props} />}
                />

                <Route
                  path="/map"
                  render={props => <Mapparent {...props} />}
                />

                <Route
                  path="/project_logs/:id"
                  render={props => <ProjectLog {...props} />}
                />
                <Route
                  path="/site_logs/:id"
                  render={props => <SiteLog {...props} />}
                />
                <Route
                  path="/project/manage-forms/1/:id"
                  render={props => <ManageForms {...props} />}
                />
                <Route
                  path="/site/manage-forms/0/:id"
                  render={props => <ManageForms {...props} />}
                />
                <Route
                  path="/project-add/:id"
                  render={props => <ProjectAdd {...props} />}
                />
                {/* <Route
                  path="/create-team"
                  render={props => <TeamAdd {...props} />}
                />

                <Route
                  path="/create-team/:id"
                  render={props => <TeamAdd {...props} />}
                /> */}

                <Route
                  path="/create-team"
                  render={({ match: { url } }) => (
                    <>
                      <Route
                        path={`${url}/`}
                        component={TeamAdd}
                        exact
                      />
                      <Route
                        path={`${url}/:id`}
                        component={TeamAdd}
                      />
                    </>
                  )}
                />

                <Route
                  path="/create-site/:id"
                  render={props => (
                    <SiteAdd {...props} page="CreateSite" />
                  )}
                />
                <Route
                  path="/regional-site-add/:id/:regionalId"
                  render={props => (
                    <SiteAdd {...props} page="regionalSite" />
                  )}
                />
                <Route
                  path="/sub-site-add/:id/:siteId"
                  render={props => (
                    <SiteAdd {...props} page="subSite" />
                  )}
                />
                <Route
                  path="/site-edit/:id"
                  render={props => (
                    <EditSite {...props} page="subSite" />
                  )}
                />

                <Route
                  path="/submission-data/:id/:fid"
                  render={props => <SubmissionData {...props} />}
                />
                <Route
                  path="/site-submission-data/:id/:fid"
                  render={props => <SiteSubmissionData {...props} />}
                />
                <Route
                  path="/site-version-submission/:id/:fid"
                  render={props => (
                    <VersionSiteSubmission {...props} />
                  )}
                />
                <Route
                  path="/project-version-submission/:id/:fid"
                  render={props => (
                    <VersionSubmissionData {...props} />
                  )}
                />
                <Route
                  path="/change-password"
                  render={props => <ChangePassword {...props} />}
                />
                <Route
                  path="/sync-schedule/:projectId"
                  render={props => <SyncSchedule {...props} />}
                />
                <Route
                  path="/reset-password"
                  render={props => <ResetPassword {...props} />}
                />

                <Route
                  path="/update-profile/:id"
                  render={props => <UpdateProfile {...props} />}
                />

                <Route
                  path="/create-profile/:id"
                  render={props => <CreateProfile {...props} />}
                />
                <Route
                  path="/mapfilter"
                  render={props => <MapFilter {...props} />}
                />

                <Route
                  path="/project-responses/:id"
                  render={props => <SpecificViewData {...props} />}
                />
                <Route
                  path="/project-submission-responses/:id"
                  render={props => <SubmissionForm {...props} />}
                />
                <Route
                  path="/site-responses/:id"
                  render={props => <SiteViewData {...props} />}
                />
                <Route
                  path="/site-submission-responses/:id"
                  render={props => <SiteSubmissionForm {...props} />}
                />

                <Route
                  path="/form-data"
                  render={props => <ExportDataFilter {...props} />}
                />

                <Route
                  path="/organization-dashboard/:id"
                  render={props => <AdminDashboard {...props} />}
                />

                <Route
                  path="/create-super-admin"
                  render={props => <SuperAdminForm {...props} />}
                />

                <Route
                  path="/edit-admin/:id"
                  render={props => <SuperAdminFormEdit {...props} />}
                />
                <Route
                  path="/organization-settings/:id"
                  render={props => <SuperAdminSetting {...props} />}
                />
                <Route
                  path="/userLists"
                  render={props => <UserList {...props} />}
                />

                <Route
                  path="/userProfile"
                  render={props => <UserProfile {...props} />}
                />

                <Route
                  path="/region-dashboard"
                  render={props => <RegionDashboard {...props} />}
                />

                <Route
                  path="/user-manage"
                  render={props => <UserManage {...props} />}
                />

                <Route
                  path="/myFormtable"
                  render={props => <MyFormTable {...props} />}
                />

                <Route
                  path="/form-submission"
                  render={props => <Submission {...props} />}
                />
                <Route
                  path="/super-organization-dashboard/:id"
                  render={props => <AdminDashboard {...props} />}
                />

                <Route
                  path="/create-super-admin"
                  render={props => <SuperAdminForm {...props} />}
                />

                <Route
                  path="/edit-super-admin/:id"
                  render={props => <SuperAdminFormEdit {...props} />}
                />
                <Route
                  path="/super-admin-settings/:id"
                  render={props => <SuperAdminSetting {...props} />}
                />
              </Switch>
              <ToastContainer />
            </Router>
          </main>
          {/* </div> */}
        </div>
      </IntlProvider>
    );
  }
}

const mapStateToProps = ({ teams }) => {
  const { selected } = teams;

  return {
    selected,
  };
};
export default compose(connect(mapStateToProps))(App);
