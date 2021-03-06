import React, { PureComponent, createRef } from 'react';
import { connect } from 'react-redux';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
import Axios from 'axios';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import worker from './webWorker/filterWorker';
import WebWorker from './webWorker/workerSetup';
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
  getSearchPrimaryGeojson,
  refreshGeojsonData,
  getGeolayersList,
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
  colorBySelection: 'project',
  sizeBySelection: '',
  searchText: '',
  isAddressSearched: false,
  addressSearch: [],
  searchByItem: 'address',
  selectedBaseLayer: 'openstreet',
  isProjectSelected: true,
  isProgressSelected: false,
  isStatusSelected: false,
  isSiteTypeSelected: false,
  isRegionSelected: false,
  loadallGeoLayer: false,
  filterLegendSelection: 'project',
  allProjectName: [],
};
class MapFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.mapRef = createRef();
    this.groupRef = createRef();
    this.markerRef = createRef();
  }

  updateDimensions() {
    const height = window.innerHeight;
    this.setState({ height: height - 90 });
  }

  componentWillMount() {
    this.updateDimensions();
    const {
      match: {
        params: { id },
        path,
      },
    } = this.props;
    const urlRole =
      path === '/team-mapfilter/:id' ? 'team' : 'project';
    this.props.getProjectsList(id, urlRole);
    this.props.getProjectsRegionTypes(id, urlRole);
    this.props.getGeolayersList(id, urlRole);
    // console.log(this.props, 'willmount');
  }

  componentDidMount() {
    // this.setState({allSiteName: })
    window.addEventListener(
      'resize',
      this.updateDimensions.bind(this),
    );
    const workers = new WebWorker(worker);
    const provider = new OpenStreetMapProvider();
    const form = document.querySelector('form');
    // console.log(form, 'form');
    const input = form.querySelector('.searchinput');
    const searchselect = form.querySelector(
      '.search-control-info-list',
    );
    this.worker = new WebWorker(worker);
    // const myWorker = new Worker('worker.js');

    // if (window.Worker) {
    //   console.log('worker Running');
    // }
    // console.log(input, 'input');

    // console.log(searchselect, 'searchselect');
    // const { addressSearch } = this.state;

    let results = [];
    searchselect.addEventListener('click', async el => {
      document.getElementsByClassName(
        'search-control-info',
      )[0].style.display = 'none';
      const selectedIndex = el.target.value;
      // console.log(selectedIndex, 'index');
      const bbox = results[selectedIndex].bounds;
      // const first = new L.LatLng(bbox[0], bbox[2]);
      // const second = new L.LatLng(bbox[1], bbox[3]);
      // const bounds = new L.LatLngBounds([first, second]);
      const southWest = L.latLng(bbox[0][0], bbox[0][1]);
      const northEast = L.latLng(bbox[1][0], bbox[1][1]);
      const bounds = L.latLngBounds(southWest, northEast);
      this.mapRef.current.leafletElement.fitBounds(bounds);
      this.mapRef.current.leafletElement.setZoom(12);

      // this.mapRef.current.leafletElement.setZoom(12);
      this.setState({
        isAddressSearched: false,
      });
    });
    input.addEventListener('keyup', async () => {
      // console.log(input.value, 'value');
      // event.preventDefault();
      if (input.value.length < 1) {
        document.getElementsByClassName(
          'search-control-info',
        )[0].style.display = 'none';
      } else {
        document.getElementsByClassName(
          'search-control-info',
        )[0].style.display = 'block';
      }
      results = await provider.search({ query: input.value });
      // console.log(results); // » [{}, {}, {}, ...]
      if (results.length > 0) {
        this.setState({
          isAddressSearched: true,
          addressSearch: results,
        });
      }

      if (results.length <= 0) {
        this.setState({
          isAddressSearched: false,
          addressSearch: results,
        });
      }
    });
    const specifiedElement = document.getElementsByClassName(
      'search-custom',
    );

    // I'm using "click" but it works with any event
    document.addEventListener('click', async event => {
      const isClickInside = specifiedElement[0].contains(
        event.target,
      );

      if (!isClickInside) {
        this.setState({
          isAddressSearched: false,
          searchDropdown: false,
        });
        // the click was outside the specifiedElement, do something
      }
    });
  }

  fetchWebWorker = () => {
    this.worker.postMessage('Fetch Users');

    // this.worker.addEventListener('message', event => {
    // });
  };

  handleBaseLayer = selectedBaseLayer => {
    this.setState({ selectedBaseLayer });
  };

  handleMetricsChange = (e, usedState) => {
    // this.fetchWebWorker();
    // console.log(e.value, usedState);
    if (usedState === 'Color') {
      // this.loaderOn();

      // this.setState({ isLoading: true }, () => {
      this.setState({ colorBySelection: e.value }, () => {
        // this.setState({ isLoading: false });
        // });
      });
    } else if (usedState === 'Size') {
      this.setState({ sizeBySelection: e.value });
    }
  };

  toggleLoader = () => {
    this.setState({ isLoading: false, searchByItem: 'name' });
  };

  loaderOn = () => {
    this.setState({
      isLoading: true,
    });
  };

  loaderOff = () => {
    this.setState({
      isLoading: false,
    });
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
        const projectPush = [];
        projectsList.map(data => {
          return projectPush.push(data.name);
        });
        this.setState({
          checkedProjectItems: projectPush,
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
    document.getElementsByClassName(
      'leaflet-control-layers-toggle',
    )[0].style.display = 'none';

    // if (totalsearchLength === 0) {
    //   this.props.refreshGeojsonData();
    // }
    const filterSetState = filteredName => {
      this.setState({
        allProjectName: filteredName,
      });
    };
    const {
      mapFilterReducer: {
        clonePrimaryGeojson,
        projectsList,
        projectPrimaryGeojsonUrl,
        primaryGeojson,
      },
    } = this.props;

    if (
      prevProps.mapFilterReducer.projectPrimaryGeojsonUrl !==
      projectPrimaryGeojsonUrl
    ) {
      this.props.getPrimaryMarkerGeojson(projectPrimaryGeojsonUrl);
    }
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
    if (
      prevProps.mapFilterReducer.primaryGeojson !== primaryGeojson
    ) {
      const filteredName = primaryGeojson[0].features.map(
        sitename => {
          return sitename.properties.name;
        },
      );
      filterSetState(filteredName);
    }
    // this.props.refreshGeojsonData();
    // if (
    //   prevState.isProgressSelected === this.state.isProgressSelected
    // ) {
    //   this.setProgressParentCheckbox();
    // }
    // if (this.state.checkedProgressItems.length < 1) {
    //   this.setState({ isProgressSelected: false });
    // }
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
    // this.props.refreshGeojsonData();
  };

  onClickClearBtn = () => {
    this.props.refreshGeojsonData();
    this.setState({ colorBySelection: 'project' });
    document.querySelectorAll('.to_reset_checkbox').forEach(el => {
      const element = el;
      element.checked = false;
    });
    // document.querySelectorAll('input[type=radio]').forEach(el => {
    //   const element = el;
    //   element.checked = false;
    // });
  };

  handleRegionChange = e => {
    const item = e.target.name;
    const isRegionChecked = e.target.checked;
    const { checkedRegionItems } = this.state;
    if (isRegionChecked === true) {
      const joined = checkedRegionItems.concat(item);
      this.setState({
        checkedRegionItems: joined,
        isRegionSelected: true,
        filterLegendSelection: 'region',
      });
    } else {
      const filteredData = checkedRegionItems.filter(
        data => data !== item,
      );
      this.setState(
        {
          checkedRegionItems: filteredData,
        },
        () => {
          // console.log(
          //   `Button Name (▶️️ inside callback) = `,
          //   this.state.checkedProgressItems,
          // ),
          if (this.state.checkedRegionItems.length > 0) {
            this.setState({ isRegionSelected: true });
          } else {
            this.setState({ isRegionSelected: false });
          }
        },
      );
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
      this.setState({
        checkedSiteItems: joined,
        isSiteTypeSelected: true,
        filterLegendSelection: 'site_type',
      });
    } else {
      const filteredData = checkedSiteItems.filter(
        data => data !== item,
      );
      this.setState(
        {
          checkedSiteItems: filteredData,
        },
        () => {
          if (this.state.checkedSiteItems.length > 0) {
            this.setState({ isSiteTypeSelected: true });
          } else {
            this.setState({ isSiteTypeSelected: false });
          }
        },
      );
    }
  };

  // handleMetricsChange = e => {
  //   console.log(e.target.value);
  // };

  // handleStatusChange = e => {
  //   const {
  //     target: { value },
  //   } = e;
  //   const { checkedStatusItem } = this.state;
  //   this.setState(
  //     { checkedStatusItem: [parseInt(value, 10)] },
  //     () => {
  //       // console.log(
  //       //   `Button Name (▶️️ inside callback) = `,
  //       //   this.state.checkedProgressItems,
  //       // ),
  //       if (checkedStatusItem) {
  //         this.setState({ isStatusSelected: true });
  //       } else {
  //         this.setState({ isStatusSelected: false });
  //       }
  //     },
  //   );
  // };
  handleStatusChange = e => {
    const item = parseInt(e.target.name, 10);
    const isStatusChecked = e.target.checked;
    const { checkedStatusItem } = this.state;
    if (isStatusChecked === true) {
      const joined = checkedStatusItem.concat(item);
      this.setState({
        checkedStatusItem: joined,
        isStatusSelected: true,
        filterLegendSelection: 'status',
      });
    } else {
      const filteredData = checkedStatusItem.filter(
        data => data !== item,
      );
      this.setState(
        {
          checkedStatusItem: filteredData,
        },
        () => {
          if (this.state.checkedStatusItem.length > 0) {
            this.setState({ isStatusSelected: true });
          } else {
            this.setState({ isStatusSelected: false });
          }
        },
      );
    }
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
      const joined = checkedProjectItems.concat(item);
      this.setState({
        checkedProjectItems: joined,
        isProjectSelected: true,
        filterLegendSelection: 'project',
      });
    } else {
      const filteredData = checkedProjectItems.filter(
        data => data !== item,
      );
      this.setState(
        {
          checkedProjectItems: filteredData,
        },
        () => {
          // console.log(
          //   `Button Name (▶️️ inside callback) = `,
          //   this.state.checkedProgressItems,
          // ),
          if (this.state.checkedProjectItems.length > 0) {
            this.setState({ isProjectSelected: true });
          } else {
            this.setState({ isProjectSelected: false });
          }
        },
      );
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
    // e.persist();
    const item = e.target.name;
    const isProgressChecked = e.target.checked;
    const { checkedProgressItems } = this.state;

    if (isProgressChecked === true) {
      const joined = checkedProgressItems.concat(item);
      this.setState({
        checkedProgressItems: joined,
        isProgressSelected: true,
        filterLegendSelection: 'progress',
      });
    } else {
      const filteredData = checkedProgressItems.filter(
        data => data !== item,
      );

      // this.setState({
      //   checkedProgressItems: filteredData,
      // });
      this.setState(
        {
          checkedProgressItems: filteredData,
        },
        () => {
          // console.log(
          //   `Button Name (▶️️ inside callback) = `,
          //   this.state.checkedProgressItems,
          // ),
          if (this.state.checkedProgressItems.length > 0) {
            this.setState({ isProgressSelected: true });
          } else {
            this.setState({ isProgressSelected: false });
          }
        },
      );
    }
  };

  handleProjectParentCheckbox = e => {
    e.stopPropagation();
    const { checkedProjectItems, isProjectSelected } = this.state;
    if (isProjectSelected) {
      const allProjectElement = document.getElementsByClassName(
        'project_checkbox',
      );

      for (let i = 0; i < allProjectElement.length; i += 1) {
        allProjectElement[i].checked = false;
      }
      this.setState({
        checkedProjectItems: [],
        isProjectSelected: false,
      });
    } else {
      this.setState({
        isProjectSelected: true,
      });
      if (e.target.checked === true) {
        const allProjectElement = document.getElementsByClassName(
          'project_checkbox',
        );

        for (let i = 0; i < allProjectElement.length; i += 1) {
          allProjectElement[i].checked = true;
          checkedProjectItems.push(allProjectElement[i].name);
        }
        this.setState({
          checkedProjectItems,
          filterLegendSelection: 'project',
        });
        // this.setState({
        //   checkedProgressItems: joined,
        // });
      }
    }
  };

  handleProgressParentCheckbox = e => {
    // debugger;
    e.stopPropagation();
    const { checkedProgressItems, isProgressSelected } = this.state;
    if (isProgressSelected) {
      const allProgressElement = document.getElementsByClassName(
        'progress_checkbox',
      );

      for (let i = 0; i < allProgressElement.length; i += 1) {
        allProgressElement[i].checked = false;
      }
      this.setState({
        checkedProgressItems: [],
        isProgressSelected: false,
      });
    } else {
      this.setState({
        isProgressSelected: true,
      });
      if (e.target.checked === true) {
        const allProgressElement = document.getElementsByClassName(
          'progress_checkbox',
        );

        for (let i = 0; i < allProgressElement.length; i += 1) {
          allProgressElement[i].checked = true;
          checkedProgressItems.push(allProgressElement[i].name);
        }
        this.setState({
          checkedProgressItems,
          filterLegendSelection: 'progress',
        });
        // this.setState({
        //   checkedProgressItems: joined,
        // });
      }
    }
  };

  handleStatusParentCheckbox = e => {
    e.stopPropagation();
    const { checkedStatusItem, isStatusSelected } = this.state;
    if (isStatusSelected) {
      this.setState({
        isStatusSelected: false,
        checkedStatusItem: [],
      });
      const allStatusElement = document.getElementsByClassName(
        'status_checkbox',
      );
      for (let i = 0; i < allStatusElement.length; i += 1) {
        allStatusElement[i].checked = false;
      }
    } else {
      this.setState({
        isStatusSelected: true,
        filterLegendSelection: 'status',
      });
      const allStatusElement = document.getElementsByClassName(
        'status_checkbox',
      );
      for (let i = 0; i < allStatusElement.length; i += 1) {
        checkedStatusItem.push(
          parseInt(allStatusElement[i].value, 10),
        );
        allStatusElement[i].checked = true;
      }
    }
  };

  handleSiteTypeParentCheckbox = e => {
    e.stopPropagation();
    const { checkedSiteItems, isSiteTypeSelected } = this.state;
    if (isSiteTypeSelected) {
      const allSiteTypeElement = document.getElementsByClassName(
        'sitetype_checkbox',
      );

      for (let i = 0; i < allSiteTypeElement.length; i += 1) {
        allSiteTypeElement[i].checked = false;
      }
      this.setState({
        checkedSiteItems: [],
        isSiteTypeSelected: false,
      });
    } else {
      this.setState({
        isSiteTypeSelected: true,
        filterLegendSelection: 'site_type',
      });
      if (e.target.checked === true) {
        const allSiteTypeElement = document.getElementsByClassName(
          'sitetype_checkbox',
        );

        for (let i = 0; i < allSiteTypeElement.length; i += 1) {
          allSiteTypeElement[i].checked = true;
          checkedSiteItems.push(allSiteTypeElement[i].name);
        }
        this.setState({
          checkedSiteItems,
        });
        // this.setState({
        //   checkedProgressItems: joined,
        // });
      }
    }
  };

  handleRegionParentCheckbox = e => {
    e.stopPropagation();
    const { checkedRegionItems, isRegionSelected } = this.state;
    if (isRegionSelected) {
      const allRegionElement = document.getElementsByClassName(
        'region_checkbox',
      );

      for (let i = 0; i < allRegionElement.length; i += 1) {
        allRegionElement[i].checked = false;
      }
      this.setState({
        checkedRegionItems: [],
        isRegionSelected: false,
      });
    } else {
      this.setState({
        isRegionSelected: true,
        filterLegendSelection: 'region',
      });
      if (e.target.checked === true) {
        const allRegionElement = document.getElementsByClassName(
          'region_checkbox',
        );

        for (let i = 0; i < allRegionElement.length; i += 1) {
          allRegionElement[i].checked = true;
          checkedRegionItems.push(allRegionElement[i].name);
        }
        this.setState({
          checkedRegionItems,
        });
        // this.setState({
        //   checkedProgressItems: joined,
        // });
      }
    }
  };

  applyFilter = () => {
    // if (
    //   this.state.checkedProgressItems.length === 0 &&
    //   this.state.checkedStatusItem.length === 0 &&
    //   this.state.checkedSiteItems.length === 0 &&
    //   this.state.checkedRegionItems.length === 0
    // ) {
    //   this.setState({ colorBySelection: 'project' });
    // }
    const {
      checkedProjectItems,
      checkedProgressItems,
      checkedStatusItem,
      checkedSiteItems,
      checkedRegionItems,
      filterLegendSelection,
    } = this.state;
    this.props.getFilteredPrimaryGeojson({
      filterByType: {
        project: checkedProjectItems,
        progress: checkedProgressItems,
        status: checkedStatusItem,
        site_type: checkedSiteItems,
        region: checkedRegionItems,
      },
    });
    this.toggleZoomforFilter();

    // if (
    //   checkedProgressItems.length === 0 &&
    //   checkedStatusItem.length === 0 &&
    //   checkedSiteItems.length === 0 &&
    //   checkedRegionItems.length === 0
    // ) {
    //   this.setState({ colorBySelection: 'project' });
    // }
    // if (checkedProgressItems.length > 0) {
    //   this.setState({ colorBySelection: 'progress' });
    // }
    // if (checkedStatusItem.length > 0) {
    //   this.setState({ colorBySelection: 'status' });
    // }
    // if (checkedSiteItems.length > 0) {
    //   this.setState({ colorBySelection: 'site_type' });
    // }
    // if (checkedRegionItems.length > 0) {
    this.setState({ colorBySelection: filterLegendSelection });
    // }
    // const { mapFilterReducer: clonePrimaryGeojson } = this.props;
  };

  handleSearchChange = data => {
    // const typeaheadClass = document.querySelector(
    //   '.custom-css-typeahead',
    // );
    // const a = typeaheadClass.querySelector('input').value;
    // console.log(a);
    if (data.length !== 0) {
      this.setState({ searchText: data[0] }, () => {
        if (this.state.searchText !== undefined) {
          this.handleSearchEnter();
        }
      });
    } else if (data.length === 0) {
      this.props.refreshGeojsonData();
    }
  };

  geolayersOnChange = async e => {
    const {
      target: { name },
    } = e;
    const { loadallGeoLayer } = this.state;
    const {
      props: {
        mapFilterReducer: { geolayersList },
      },
    } = this;
    const mapref = this.mapRef.current.leafletElement;

    if (loadallGeoLayer === false) {
      this.loaderOn();
      geolayersList.forEach(element => {
        Axios.get(element.geo_layer)
          .then(res => {
            const geolayerData = res.data;
            window[`geo_layer${element.id}`] = L.geoJSON(
              geolayerData,
              {
                onEachFeature: function onEachFeature(
                  feature,
                  layer,
                ) {
                  let popUpContent = '';

                  popUpContent +=
                    '<table style="width:100%;" id="District-popup" class="popuptable">';
                  Object.keys(layer.feature.properties).forEach(
                    function mapping(key) {
                      popUpContent += `<tr><td>${key}</td><td>${layer.feature.properties[key]}</td></tr>`;
                    },
                  );
                  popUpContent += '</table>';
                  layer.bindPopup(
                    L.popup({
                      closeOnClick: true,
                      closeButton: true,
                      keepInView: true,
                      autoPan: true,
                      maxHeight: 200,
                      minWidth: 250,
                    }).setContent(popUpContent),
                  );
                  layer.setStyle({
                    fillColor: 'green',
                    weight: 1,
                    opacity: 1,
                    color: 'black',
                    fillOpacity: 0,
                  });
                },
              },
            );
            window[`geo_layer${element.id}`].addTo(mapref);
            mapref.removeLayer(window[`geo_layer${element.id}`]);
            if (!mapref.hasLayer(window[`${name}`])) {
              this.loaderOff();
              mapref.addLayer(window[`${name}`]);
              const addedLayerBound = window[`${name}`].getBounds();
              mapref.fitBounds(addedLayerBound);
            }

            // mapref.addLayer(window[name]);
          })
          .catch({});
      });
    }
    if (loadallGeoLayer === true) {
      if (mapref.hasLayer(window[`${name}`])) {
        mapref.removeLayer(window[`${name}`]);
      } else {
        this.loaderOff();
        mapref.addLayer(window[`${name}`]);
        const nextaddedLayerBound = window[`${name}`].getBounds();
        mapref.fitBounds(nextaddedLayerBound);
      }
    }
    this.setState({ loadallGeoLayer: true });
  };

  handleSearchEnter = () => {
    const { searchText } = this.state;
    this.props.getSearchPrimaryGeojson({
      keyword: searchText,
    });
    // const mapref = this.markerRef.current.leafletElement;
    // mapref.openPopup();
    // console.log(mapref.openPopup());
    // console.log(markerref);
  };

  SearchBy = e => {
    this.setState({ searchByItem: e.target.name });
  };

  render() {
    const {
      props: {
        mapFilterReducer: {
          primaryGeojson,
          projectsList,
          projectsRegionTypes,
          clonePrimaryGeojson,
          geolayersList,
        },
        match: { path },
      },
      state: {
        searchText,
        isLoading,
        height,
        zoom,
        searchDropdown,
        modalSetting,
        isfiltered,
        colorBySelection,
        sizeBySelection,
        isAddressSearched,
        addressSearch,
        searchByItem,
        selectedBaseLayer,
        isProjectSelected,
        isProgressSelected,
        isStatusSelected,
        isSiteTypeSelected,
        isRegionSelected,
        allProjectName,
      },
    } = this;
    return (
      <div className="card">
        {isLoading && <Loader loaded={isLoading} />}
        <div className="card-body map-wrapper">
          <div id="map" style={{ height }} className="map">
            <MapComponent
              selectedBaseLayer={selectedBaseLayer}
              zoom={zoom}
              height={height}
              geojson={primaryGeojson}
              clonePrimaryGeojson={clonePrimaryGeojson}
              mapRef={this.mapRef}
              groupRef={this.groupRef}
              markerRef={this.markerRef}
              isfiltered={isfiltered}
              colorBySelection={colorBySelection}
              sizeBySelection={sizeBySelection}
              projectsList={projectsList}
              projectsRegionTypes={projectsRegionTypes}
              primaryGeojson={primaryGeojson}
              loaderOn={this.loaderOn}
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
              <div className="sidebar-title flex-between">
                <h4>
                  {path === '/team-mapfilter/:id'
                    ? 'Team:'
                    : 'Project:'}
                  &nbsp;
                  {projectsList[0] && projectsList[0].name}
                </h4>
              </div>
              <form className="search-custom">
                <div className="form-group search">
                  <div className="input-group">
                    {/* {searchByItem === 'address' ? ( */}
                    <input
                      style={{
                        display:
                          searchByItem === 'address'
                            ? 'flex'
                            : 'none',
                      }}
                      type="search"
                      // value={searchText}
                      className="form-control searchinput"
                      // onChange={this.handleSearchChange}
                      // onKeyDown={this.handleSearchEnter}
                      placeholder="Search By Address"
                    />
                    <div
                      className={`search-control-info-wrapper ${
                        isAddressSearched
                          ? ''
                          : 'search-control-info-wrapper-close'
                      }`}
                    >
                      <div className="search-control-info">
                        <ul
                          className="search-control-info-list"
                          // style={{ maxHeight: '260px' }}
                          style={{
                            display:
                              isAddressSearched === true
                                ? 'block'
                                : 'none',
                            maxHeight: '260px',
                          }}
                        >
                          {addressSearch &&
                            addressSearch.map((data, key) => {
                              return (
                                <li
                                  key={Math.random()}
                                  value={key}
                                  className="search-control-info-list-item candidate"
                                >
                                  {data.label}
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                    {/* <input
                      style={{
                        display:
                          searchByItem === 'name' ? 'flex' : 'none',
                      }}
                      type="search"
                      value={searchText}
                      className="form-control searchBox"
                      onChange={this.handleSearchChange}
                      onKeyDown={this.handleSearchEnter}
                      placeholder="Search By Site Name"
                    /> */}
                    {/* )} */}
                    {/* isAddressSearched */}

                    <Typeahead
                      style={{ backgroundColor: 'red' }}
                      id="typeahead_custom"
                      className={`custom-css-typeahead ${
                        searchByItem === 'name'
                          ? 'show_typeahead'
                          : 'hide_typeahead'
                      } `}
                      placeholder="Search By Site Name"
                      onChange={selected => {
                        this.handleSearchChange(selected);
                        // Handle selections...
                      }}
                      minLength={2}
                      selectHintOnEnter
                      // onKeyDown={this.handleSearchEnter}
                      // onClick={this.handleSearchEnter}
                      options={allProjectName}
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
                          <a
                            className={
                              searchByItem === 'name'
                                ? 'searchselected'
                                : ''
                            }
                            value="name"
                            name="name"
                            role="link"
                            tabIndex={-1}
                            onKeyPress={this.SearchBy}
                            onClick={this.SearchBy}
                          >
                            <div
                              className="circle"
                              style={{
                                border: '1px solid black',
                                background: '#e69109',
                                marginLeft: '4px',
                                marginTop: '3px',
                              }}
                              title="Sites"
                            />
                            Search by Site Name
                          </a>
                        </li>
                        <li>
                          <a
                            className={
                              searchByItem === 'address'
                                ? 'searchselected'
                                : ''
                            }
                            value="address"
                            name="address"
                            role="link"
                            tabIndex={-1}
                            onKeyPress={this.SearchBy}
                            onClick={this.SearchBy}
                          >
                            <img
                              alt="osm_search"
                              src="/static/images/osm_search.png"
                              width="22px"
                              style={{ marginRight: '5px' }}
                              title="OSM Search"
                            />
                            Search by Address
                          </a>
                        </li>
                      </ul>
                    </span>
                  </div>
                </div>
              </form>
              <div className="sidebar-title flex-between">
                <h4>Map</h4>
                {/* {path === '/proj-mapfilter/:id' ? (
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
                ) : (
                  ''
                )} */}
              </div>
              <MainSidebarTab
                projectsList={projectsList}
                projectsRegionTypes={projectsRegionTypes}
                applyFilter={this.applyFilter}
                handleRegionChange={this.handleRegionChange}
                handleSiteChange={this.handleSiteChange}
                handleProgressChange={this.handleProgressChange}
                handleStatusChange={this.handleStatusChange}
                handleProjectChange={this.handleProjectChange}
                handleMetricsChange={this.handleMetricsChange}
                handleBaseLayer={this.handleBaseLayer}
                onClickClearBtn={this.onClickClearBtn}
                isProjectSelected={isProjectSelected}
                handleProjectParentCheckbox={
                  this.handleProjectParentCheckbox
                }
                isProgressSelected={isProgressSelected}
                handleProgressParentCheckbox={
                  this.handleProgressParentCheckbox
                }
                isStatusSelected={isStatusSelected}
                handleStatusParentCheckbox={
                  this.handleStatusParentCheckbox
                }
                isSiteTypeSelected={isSiteTypeSelected}
                handleSiteTypeParentCheckbox={
                  this.handleSiteTypeParentCheckbox
                }
                isRegionSelected={isRegionSelected}
                handleRegionParentCheckbox={
                  this.handleRegionParentCheckbox
                }
                selectedBaseLayer={selectedBaseLayer}
                geolayersList={geolayersList}
                geolayersOnChange={this.geolayersOnChange}
                path={path}
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
  getSearchPrimaryGeojson,
  refreshGeojsonData,
  getGeolayersList,
})(MapFilter);
