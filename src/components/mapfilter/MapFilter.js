import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';

import Loader from '../common/Loader';
import MapComponent from './MapComponent';
import MapLeftTools from './MapLeftTools';
import ModalSettings from './ModalSettings';
import {
  getPrimaryMarkerGeojson,
  getSecondaryMarkerGeojson,
  getProjectsList,
  getProjectsRegionTypes,
  getFilteredPrimaryGeojson,
} from '../../actions/mapFilterActions';
import MainSidebarTab from './SidebarTabsComponents/MainSidebarTab';

const INITIAL_STATE = {
  height: 0,
  activeTab: 'filters',
  activeLayers: 'main_layers',
  searchDropdown: false,
  modalSetting: false,
  checkedRegionItems: [],
  checkedSiteItems: [],
  checkedProgressItems: [],
  checkedStatusItem: [],
  checkedProjectItems: [],
  isfiltered: false,
  isLoading: true,
};
class MapFilter extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.mapRef = createRef();
    this.groupRef = createRef();
  }

  updateDimensions() {
    const height =
      window.innerWidth >= 992 ? window.innerHeight : 400;
    this.setState({ height: height - 32 });
  }

  componentWillMount() {
    this.updateDimensions();
    this.props.getPrimaryMarkerGeojson();
    this.props.getProjectsList();
    this.props.getProjectsRegionTypes();
    // console.log(this.props, 'willmount');
  }

  componentDidMount() {
    window.addEventListener(
      'resize',
      this.updateDimensions.bind(this),
    );
  }

  toggleLoader = () => {
    this.setState({ isLoading: false });
  };

  toggleZoomforFilter = () => {
    this.mapRef.current.leafletElement.setZoom(7);
  };

  insertProjectNameInState = () => {
    const {
      mapFilterReducer: { projectsList },
    } = this.props;
    const { checkedProjectItems } = this.state;
    if (projectsList) {
      if (projectsList.length >= 1) {
        projectsList.map((data, key) => {
          return this.setState({
            checkedProjectItems: checkedProjectItems.concat(
              data.name,
            ),
          });
        });
      }
    }
    // projectList &&
    //   projectList.map(data => {
    //     console.log(data, 'data');
    //     // this.setState({
    //     //   checkedProjectItems: checkedProjectItems.push(data.project),
    //     // });
    //   });
  };

  componentDidUpdate(prevProps) {
    const {
      mapFilterReducer: { clonePrimaryGeojson, projectsList },
    } = this.props;

    if (
      prevProps.mapFilterReducer.clonePrimaryGeojson !==
      clonePrimaryGeojson
    ) {
      this.toggleLoader();
    }
    // console.log(clonePrimaryGeojson, 'clo');
    if (clonePrimaryGeojson.length === 0) {
      this.toggleZoomforFilter();
    }
    if (prevProps.mapFilterReducer.projectsList !== projectsList) {
      this.insertProjectNameInState();
    }
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize',
      this.updateDimensions.bind(this),
    );
  }

  scaleClick = () => {
    const leafletdrawIcon = document.getElementsByClassName(
      'js-start',
    )[0];
    document.getElementsByClassName(
      'js-interaction',
    )[0].style.display = 'block';

    document.getElementsByClassName('js-toggle')[0].style.display =
      'none';

    leafletdrawIcon.click();
    leafletdrawIcon.style.display = 'none';
  };

  exportClick = () => {
    document.getElementsByClassName(
      'leaflet-control-easyPrint-button-export',
    )[0].style.display = 'none';
    const exportLeafletIcon = document.getElementsByClassName(
      'A4Landscape',
    )[0];
    exportLeafletIcon.click();
  };

  exportLandscapeClick = () => {
    document.getElementsByClassName(
      'leaflet-control-easyPrint-button-export',
    )[0].style.display = 'none';
    const exportLeafletIcon = document.getElementsByClassName(
      'A4Landscape',
    )[0];
    exportLeafletIcon.click();
  };

  exportPortraitClick = () => {
    document.getElementsByClassName(
      'leaflet-control-easyPrint-button-export',
    )[0].style.display = 'none';
    const exportLeafletIcon = document.getElementsByClassName(
      'A4Portrait',
    )[0];
    exportLeafletIcon.click();
  };

  zoomInClick = () => {
    // this.map.zoomIn();
    document.getElementsByClassName(
      'leaflet-control-zoom-in',
    )[0].style.display = 'none';
    const zoominclick = document.getElementsByClassName(
      'leaflet-control-zoom-in',
    )[0];
    zoominclick.click();
  };

  zoomOutClick = () => {
    document.getElementsByClassName(
      'leaflet-control-zoom-out',
    )[0].style.display = 'none';
    const zoomoutclick = document.getElementsByClassName(
      'leaflet-control-zoom-out',
    )[0];
    zoomoutclick.click();
  };

  searchDropdownClick = () => {
    // this.setState({ searchDropdown: !this.state.searchDropdown });
    this.setState(prevState => ({
      searchDropdown: !prevState.searchDropdown,
    }));
  };

  openModalSetting = () => {
    this.setState(prevState => ({
      modalSetting: !prevState.modalSetting,
    }));
  };

  refreshClick = () => {
    const map = this.mapRef.current.leafletElement;
    const featuregroup = this.groupRef.current.leafletElement;
    map.fitBounds(featuregroup.getBounds());
  };

  handleRegionChange = e => {
    const item = e.target.name;
    const isRegionChecked = e.target.checked;
    const { checkedRegionItems } = this.state;
    if (isRegionChecked === true) {
      const joined = checkedRegionItems.concat(item);
      this.setState({ checkedRegionItems: joined });
    } else {
      const filteredData = checkedRegionItems.filter(
        data => data !== item,
      );
      this.setState({ checkedRegionItems: filteredData });
    }
    // this.setState({ isfiltered: true });
    // this.setState({
    //   isfiltered: true,
    // });
  };

  handleSiteChange = e => {
    const item = e.target.name;
    const isSiteChecked = e.target.checked;
    const { checkedSiteItems } = this.state;
    if (isSiteChecked === true) {
      const joined = checkedSiteItems.concat(item);
      this.setState({ checkedSiteItems: joined });
    } else {
      const filteredData = checkedSiteItems.filter(
        data => data !== item,
      );
      this.setState({ checkedSiteItems: filteredData });
    }
  };

  handleStatusChange = e => {
    const {
      target: { value, checked },
    } = e;
    this.setState({ checkedStatusItem: [parseInt(value, 10)] });
  };

  handleProjectChange = e => {
    // const {
    //   target: { value, checked },
    // } = e;
    // this.setState({ checkedProjectItems: [value] });
    const item = e.target.name;
    const isProjectChecked = e.target.checked;
    const { checkedProjectItems } = this.state;
    if (isProjectChecked === true) {
      this.setState({ checkedProjectItems: [item] });
    } else {
      const filteredData = checkedProjectItems.filter(
        data => data !== item,
      );
      this.setState({ checkedProjectItems: filteredData });
    }
  };

  // handleProgressChange = e => {
  //   const {
  //     state: { checkedProgressItems },
  //   } = this;
  //   const {
  //     target: { name, checked },
  //   } = e;
  //   console.log(name, 'name');
  //   console.log(checked, 'checked');
  //   this.setState(preState => {
  //     if (checked) {
  //       return {
  //         checkedProgressItems: [
  //           ...preState.checkedProgressItems,
  //           name,
  //         ],
  //       };
  //     }
  //     if (!checked) {
  //       const newArr = checkedProgressItems.filter(
  //         daily => daily[name] !== name,
  //       );
  //       return { checkedProgressItems: newArr };
  //     }
  //     return null;
  //   });
  // };
  handleProgressChange = e => {
    const item = e.target.name;
    const isProgressChecked = e.target.checked;
    const { checkedProgressItems } = this.state;
    if (isProgressChecked === true) {
      const joined = checkedProgressItems.concat(item);
      this.setState({ checkedProgressItems: joined });
    } else {
      const filteredData = checkedProgressItems.filter(
        data => data !== item,
      );
      this.setState({ checkedProgressItems: filteredData });
    }
  };

  applyFilter = () => {
    this.props.getFilteredPrimaryGeojson({
      filterByType: {
        project: this.state.checkedProjectItems,
        progress: this.state.checkedProgressItems,
        status: this.state.checkedStatusItem,
        site_type: this.state.checkedSiteItems,
        region: this.state.checkedRegionItems,
      },
    });
    this.toggleZoomforFilter();
    // const { mapFilterReducer: clonePrimaryGeojson } = this.props;
  };

  render() {
    const {
      props: {
        mapFilterReducer: {
          primaryGeojson,
          projectsList,
          projectsRegionTypes,
          clonePrimaryGeojson,
        },
        // match: {
        //   params: { id: siteId },
        // },
      },
      state: {
        isLoading,
        height,
        zoom,
        searchDropdown,
        modalSetting,
        isfiltered,
      },
    } = this;
    return (
      <div className="card">
        {isLoading && <Loader loaded={isLoading} />}
        <div className="card-body map-wrapper">
          <div id="map" style={{ height }} className="map">
            <MapComponent
              zoom={zoom}
              height={height}
              geojson={primaryGeojson}
              clonePrimaryGeojson={clonePrimaryGeojson}
              mapRef={this.mapRef}
              groupRef={this.groupRef}
              isfiltered={isfiltered}
            />
          </div>
          <div className="map-sidebar left-map-sidebar">
            {/* <Scrollbars
              style={{
                position: 'relative',
                overflow: 'hidden',
                width: 'auto',
                height: '100%',
              }}
            > */}
            <div className="sidebar-wrapper">
              <form>
                <div className="form-group search">
                  <div className="input-group">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search By site Name"
                    />
                    <span
                      className={`input-group-append ${
                        searchDropdown ? 'open' : ''
                      }`}
                      onClick={this.searchDropdownClick}
                      onKeyPress={this.searchDropdownClick}
                      role="link"
                      tabIndex={-1}
                    >
                      <span className="input-group-text">
                        <i className="la la-angle-down" />
                      </span>
                      <ul>
                        <li>
                          <a>Search by Name</a>
                        </li>
                        <li>
                          <a>Search by Address</a>
                        </li>
                      </ul>
                    </span>
                  </div>
                </div>
              </form>
              <div className="sidebar-title flex-between">
                <h4>Map</h4>
                <span className="filters flex-end">
                  <i
                    className="la la-cogs setting"
                    data-toggle="tooltip"
                    title="Setting"
                    aria-label="Setting"
                    data-tab="site-info-popup"
                    onClick={this.openModalSetting}
                    onKeyPress={this.handleKeyPress}
                    role="tab"
                    tabIndex={0}
                  />
                </span>
              </div>
              <MainSidebarTab
                projectsList={projectsList}
                projectsRegionTypes={projectsRegionTypes}
                applyFilter={this.applyFilter}
                handleRegionChange={this.handleRegionChange}
                handleSiteChange={this.handleSiteChange}
                handleProgressChange={this.handleProgressChange}
                handleCheckbox={this.handleCheckbox}
                handleStatusChange={this.handleStatusChange}
                handleProjectChange={this.handleProjectChange}
              />
            </div>
            {/* </Scrollbars> */}
          </div>
          <MapLeftTools
            scaleClick={this.scaleClick}
            zoomInClick={this.zoomInClick}
            zoomOutClick={this.zoomOutClick}
            exportPortraitClick={this.exportPortraitClick}
            exportLandscapeClick={this.exportLandscapeClick}
            refreshClick={this.refreshClick}
          />
          <ModalSettings
            openModalSetting={this.openModalSetting}
            modalSetting={modalSetting}
          />
          <div
            className="fieldsight-popup dark"
            id="share-popup"
            tabIndex="-1"
          >
            <div className="popup-body md-body">
              <div className="card">
                <div className="card-header main-card-header">
                  <h5>share map</h5>
                  <span className="popup-close">
                    <i className="la la-close" />
                  </span>
                </div>
                <div className="card-body">
                  <ul
                    className="nav nav-tabs"
                    id="myTab"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        id="general_tab"
                        data-toggle="tab"
                        href="#my-forms"
                        role="tab"
                        aria-controls="my-forms"
                        aria-selected="false"
                      >
                        share with
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        id="shared-forms_tab"
                        data-toggle="tab"
                        href="#shared-forms"
                        role="tab"
                        aria-controls="shared-forms"
                        aria-selected="true"
                      >
                        shared map
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content" id="choose-forms">
                    <div
                      className="tab-pane fade show active"
                      id="my-forms"
                      role="tabpanel"
                      aria-labelledby="my-forms_tab"
                    >
                      <form className="floating-form">
                        <div className="form-group">
                          <input
                            type="search"
                            className="form-control"
                            required=""
                          />
                          <label htmlFor="input">Search</label>
                          <i className="la la-search" />
                        </div>
                        <div className="form-group">
                          <div className="radiobox">
                            <label>
                              <input type="radio" name="radiobox" />
                              <i className="helper" />
                              Skills for Tourism Assessment Form -
                              Test
                            </label>
                          </div>
                          <div className="select-form-info">
                            <span className="form-owner">
                              Arun Bhandari
                            </span>
                            <time>
                              <i className="la la-clock-o" />
                              2019-07-30
                            </time>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="radiobox ">
                            <label>
                              <input type="radio" name="radiobox" />
                              <i className="helper" />
                              Certificado de Comercializacioón 9
                            </label>
                          </div>
                          <div className="select-form-info">
                            <span className="form-owner">
                              Santosh kshetri Bhandari
                            </span>
                            <time>
                              <i className="la la-clock-o" />
                              2019-07-30
                            </time>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="radiobox ">
                            <label>
                              <input type="radio" name="radiobox" />
                              <i className="helper" />
                              Skills for Tourism Assessment Form -
                              Test
                            </label>
                          </div>
                          <div className="select-form-info">
                            <span className="form-owner">
                              Arun Bhandari
                            </span>
                            <time>
                              <i className="la la-clock-o" />
                              2019-07-30
                            </time>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="radiobox ">
                            <label>
                              <input type="radio" name="radiobox" />
                              <i className="helper" />
                              Certificado de Comercializacioón 9
                            </label>
                          </div>
                          <div className="select-form-info">
                            <span className="form-owner">
                              Santosh kshetri Bhandari
                            </span>
                            <time>
                              <i className="la la-clock-o" />
                              2019-07-30
                            </time>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="radiobox ">
                            <label>
                              <input type="radio" name="radiobox" />
                              <i className="helper" />
                              Certificado de Comercializacioón 9
                            </label>
                          </div>
                          <div className="select-form-info">
                            <span className="form-owner">
                              Santosh kshetri Bhandari
                            </span>
                            <time>
                              <i className="la la-clock-o" />
                              2019-07-30
                            </time>
                          </div>
                        </div>
                        <div className="form-group pull-right no-margin">
                          <button
                            type="submit"
                            className="fieldsight-btn"
                          >
                            share
                          </button>
                        </div>
                      </form>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="shared-forms"
                      role="tabpanel"
                      aria-labelledby="shared-forms_tab"
                    >
                      <form className="floating-form">
                        <div className="form-group">
                          <input
                            type="search"
                            className="form-control"
                            required=""
                          />
                          <label htmlFor="input">Search</label>
                          <i className="la la-search" />
                        </div>
                        <div className="form-group">
                          <div className="radiobox">
                            <label>
                              <input type="radio" name="radiobox" />
                              <i className="helper" />
                              Skills for Tourism Assessment Form -
                              Test
                            </label>
                          </div>
                          <div className="select-form-info">
                            <span className="form-owner">
                              Arun Bhandari
                            </span>
                            <time>
                              <i className="la la-clock-o" />
                              2019-07-30
                            </time>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="radiobox ">
                            <label>
                              <input type="radio" name="radiobox" />
                              <i className="helper" />
                              Certificado de Comercializacioón 9
                            </label>
                          </div>
                          <div className="select-form-info">
                            <span className="form-owner">
                              Santosh kshetri Bhandari
                            </span>
                            <time>
                              <i className="la la-clock-o" />
                              2019-07-30
                            </time>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="radiobox ">
                            <label>
                              <input type="radio" name="radiobox" />
                              <i className="helper" />
                              Skills for Tourism Assessment Form -
                              Test
                            </label>
                          </div>
                          <div className="select-form-info">
                            <span className="form-owner">
                              Arun Bhandari
                            </span>
                            <time>
                              <i className="la la-clock-o" />
                              2019-07-30
                            </time>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="radiobox ">
                            <label>
                              <input type="radio" name="radiobox" />
                              <i className="helper" />
                              Certificado de Comercializacioón 9
                            </label>
                          </div>
                          <div className="select-form-info">
                            <span className="form-owner">
                              Santosh kshetri Bhandari
                            </span>
                            <time>
                              <i className="la la-clock-o" />
                              2019-07-30
                            </time>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="radiobox ">
                            <label>
                              <input type="radio" name="radiobox" />
                              <i className="helper" />
                              Certificado de Comercializacioón 9
                            </label>
                          </div>
                          <div className="select-form-info">
                            <span className="form-owner">
                              Santosh kshetri Bhandari
                            </span>
                            <time>
                              <i className="la la-clock-o" />
                              2019-07-30
                            </time>
                          </div>
                        </div>
                        <div className="form-group pull-right no-margin">
                          <button
                            type="submit"
                            className="fieldsight-btn"
                          >
                            share
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="fieldsight-popup"
            id="map-style"
            tabIndex="-1"
          >
            <div className="popup-body md-body">
              <div className="card">
                <div className="card-header main-card-header">
                  <h5>Map style</h5>
                  <span className="popup-close">
                    <i className="la la-close" />
                  </span>
                </div>
                <div className="card-body">
                  <form className="floating-form">
                    <div className="line-color">
                      <h6>Line color</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group inline-form-group">
                            <label htmlFor="input">line color</label>
                            <input
                              type="text"
                              className="form-control jscolor"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group inline-form-group">
                            <label>line opacity</label>
                            <input
                              type="nubmer"
                              className="form-control "
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group inline-form-group">
                            <label>line thickness</label>
                            <input
                              type="number"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group inline-form-group">
                            <label> Dash line</label>
                            <input
                              type="number"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="fill-color">
                      <h6>Fill color</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group inline-form-group">
                            <label htmlFor="input">fill color</label>
                            <input
                              type="text"
                              className="form-control jscolor"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group inline-form-group">
                            <label>fill opacity</label>
                            <input
                              type="nubmer"
                              className="form-control "
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group pull-right no-margin">
                      <button
                        type="submit"
                        className="fieldsight-btn"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div
            className="fieldsight-popup dark"
            id="map-list"
            tabIndex="-1"
          >
            <div className="popup-body md-body">
              <div className="card">
                <div className="card-header main-card-header">
                  <h5>map</h5>
                  <span className="popup-close">
                    <i className="la la-close" />
                  </span>
                </div>
                <div className="card-body">
                  <div className="tab-content">
                    <form className="floating-form">
                      <div className="form-group">
                        <input
                          type="search"
                          className="form-control"
                          required=""
                        />
                        <label htmlFor="input">Search</label>
                        <i className="la la-search" />
                      </div>
                      <div className="form-group">
                        <div className="radiobox">
                          <label>
                            <input type="radio" name="radiobox" />
                            <i className="helper" />
                            Skills for Tourism Assessment Form - Test
                          </label>
                        </div>
                        <div className="select-form-info">
                          <span className="form-owner">
                            Arun Bhandari
                          </span>
                          <time>
                            <i className="la la-clock-o" />
                            2019-07-30
                          </time>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="radiobox ">
                          <label>
                            <input type="radio" name="radiobox" />
                            <i className="helper" />
                            Certificado de Comercializacioón 9
                          </label>
                        </div>
                        <div className="select-form-info">
                          <span className="form-owner">
                            Santosh kshetri Bhandari
                          </span>
                          <time>
                            <i className="la la-clock-o" />
                            2019-07-30
                          </time>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="radiobox ">
                          <label>
                            <input type="radio" name="radiobox" />
                            <i className="helper" />
                            Skills for Tourism Assessment Form - Test
                          </label>
                        </div>
                        <div className="select-form-info">
                          <span className="form-owner">
                            Arun Bhandari
                          </span>
                          <time>
                            <i className="la la-clock-o" />
                            2019-07-30
                          </time>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="radiobox ">
                          <label>
                            <input type="radio" name="radiobox" />
                            <i className="helper" />
                            Certificado de Comercializacioón 9
                          </label>
                        </div>
                        <div className="select-form-info">
                          <span className="form-owner">
                            Santosh kshetri Bhandari
                          </span>
                          <time>
                            <i className="la la-clock-o" />
                            2019-07-30
                          </time>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="radiobox ">
                          <label>
                            <input type="radio" name="radiobox" />
                            <i className="helper" />
                            Certificado de Comercializacioón 9
                          </label>
                        </div>
                        <div className="select-form-info">
                          <span className="form-owner">
                            Santosh kshetri Bhandari
                          </span>
                          <time>
                            <i className="la la-clock-o" />
                            2019-07-30
                          </time>
                        </div>
                      </div>
                      <div className="form-group pull-right no-margin">
                        <button
                          type="submit"
                          className="fieldsight-btn"
                        >
                          share
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mapFilterReducer }) => ({
  mapFilterReducer,
});
// const mapDispatchToProps = dispatch => {
//   return {
//     getPrimaryGeojson: () =>
//       dispatch({ type: 'GET_PRIMARY_MARKER_GEOJSON' }),
//   };
// };

export default connect(mapStateToProps, {
  getPrimaryMarkerGeojson,
  getSecondaryMarkerGeojson,
  getProjectsList,
  getProjectsRegionTypes,
  getFilteredPrimaryGeojson,
})(MapFilter);
