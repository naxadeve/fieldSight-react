import React, { Component } from 'react';
import FilterByDate from './filterByDate';
import FilterByData from './filterByData';

// import CustomSelect from '../CustomSelect';
/* eslint-disable */

const InitialState = {
  filterData: {
    project: '',
    regions: [],
    siteType: [{ id: 'all_sitetypes', name: 'Select All' }],
    userRoles: [{ id: 'all_userroles', name: 'Select All' }],
    startDate: '',
    endDate: '',
  },
  errors: {},
};

export default class DataFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...InitialState,
      createdDate:
        props.projectCreatedOn && new Date(props.projectCreatedOn),
      tillDate: new Date(),
    };
  }

  componentWillMount() {
    if (this.props.filteredData) {
      const data = this.props.filteredData;
      const regions = data.regions
        ? data.regions.length === this.props.regions.length
          ? [
              { id: 'all_regions', name: 'Select All' },
              ...data.regions,
            ]
          : data.regions
        : this.props.filterByRegions;
      const siteType = data.site_types
        ? data.site_types.length === this.props.siteTypes.length
          ? [
              { id: 'all_sitetypes', name: 'Select All' },
              ...data.site_types,
            ]
          : data.site_types
        : this.props.filterBySiteType;
      const userRoles = data.user_roles
        ? data.user_roles.length === this.props.userRoles.length
          ? [
              { id: 'all_userroles', name: 'Select All' },
              ...data.user_roles,
            ]
          : data.user_roles
        : this.props.filterByUserRoles;
      // debugger;
      const startDate = data.start_date
        ? new Date(data.start_date)
        : new Date(this.props.projectCreatedOn);
      const endDate = data.end_date
        ? new Date(data.end_date)
        : new Date();
      this.setState(state => ({
        filterData: {
          ...state.filterData,
          regions,
          siteType,
          userRoles,
          startDate,
          endDate,
        },
      }));
    }
  }

  componentWillUnmount() {
    this.handleClear();
  }

  handleRegionFilter = (e, item) => {
    const {
      target: { checked, id },
    } = e;
    const { filterByRegions } = this.props;
    const {
      filterData: { regions },
    } = this.state;

    this.setState(state => {
      if (checked) {
        if (id === 'all_regions') {
          return {
            filterData: {
              ...state.filterData,
              regions: filterByRegions,
            },
          };
        } else {
          return {
            filterData: {
              ...state.filterData,
              regions: [...state.filterData.regions, item],
            },
          };
        }
      }
      if (!checked) {
        if (id === 'all_regions') {
          return {
            filterData: {
              ...state.filterData,
              regions: [],
            },
          };
        } else {
          const filterRegions = regions.filter(
            r => r.id !== item.id && r.id !== 'all_regions',
          );
          return {
            filterData: {
              ...state.filterData,
              regions: filterRegions,
            },
          };
        }
      }
      return null;
    });
  };

  handleSiteTypeFilter = (e, item) => {
    const {
      target: { checked, id },
    } = e;
    const { filterBySiteType } = this.props;
    const {
      filterData: { siteType },
    } = this.state;
    this.setState(state => {
      if (checked) {
        if (id === 'all_sitetypes') {
          return {
            filterData: {
              ...state.filterData,
              siteType: filterBySiteType,
            },
          };
        } else {
          return {
            filterData: {
              ...state.filterData,
              siteType: [...state.filterData.siteType, item],
            },
          };
        }
      }
      if (!checked) {
        if (id === 'all_sitetypes') {
          return {
            filterData: {
              ...state.filterData,
              siteType: [],
            },
          };
        } else {
          const filterSiteType = siteType.filter(
            s => s.id !== item.id && s.id !== 'all_sitetypes',
          );
          return {
            filterData: {
              ...state.filterData,
              siteType: filterSiteType,
            },
          };
        }
      }
      return null;
    });
  };

  handleUserRoleFilter = (e, item) => {
    const {
      target: { checked, id },
    } = e;
    const { filterByUserRoles } = this.props;
    const {
      filterData: { userRoles },
    } = this.state;
    this.setState(state => {
      if (checked) {
        if (id === 'all_userroles') {
          return {
            filterData: {
              ...state.filterData,
              userRoles: filterByUserRoles,
            },
          };
        } else {
          return {
            filterData: {
              ...state.filterData,
              userRoles: [...state.filterData.userRoles, item],
            },
          };
        }
      }
      if (!checked) {
        if (id === 'all_userroles') {
          return {
            filterData: {
              ...state.filterData,
              userRoles: [],
            },
          };
        } else {
          const filterUserRoles = userRoles.filter(
            s => s.id !== item.id && s.id !== 'all_userroles',
          );
          return {
            filterData: {
              ...state.filterData,
              userRoles: filterUserRoles,
            },
          };
        }
      }
      return null;
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.handleSubmitFilter(this.state.filterData);
  };

  handleClear = () => {
    this.setState(state => ({
      filterData: {
        ...state.filterData,
        regions: [],
        siteType: [],
        userRoles: [],
        startDate: new Date(this.props.projectCreatedOn),
        endDate: new Date(),
      },
      createdDate: new Date(this.props.projectCreatedOn),
      tillDate: new Date(),
    }));
  };

  handleStartDateChange = e => {
    const {
      filterData: { endDate },
    } = this.state;
    const errors = {};
    this.setState(state => {
      if (endDate && e > endDate) {
        errors.endDate = 'Invalid Date';
        return {
          filterData: {
            ...state.filterData,
            endDate: e,
          },
          errors,
        };
      }
      return {
        filterData: {
          ...state.filterData,
          startDate: e,
        },
        errors,
      };
    });
  };

  handleEndDateChange = e => {
    const {
      filterData: { startDate },
    } = this.state;
    const errors = {};
    this.setState(state => {
      if (e < startDate) {
        errors.endDate = 'Invalid Date';
        return {
          filterData: {
            ...state.filterData,
            startDate: e,
          },
          errors,
        };
      }
      return {
        filterData: {
          ...state.filterData,
          endDate: e,
        },
        errors,
      };
    });
  };

  render() {
    const {
      filterData: {
        regions,
        siteType,
        startDate,
        endDate,
        userRoles,
      },
      createdDate,
      tillDate,
      errors,
    } = this.state;
    const {
      toggleSelectClass,
      handleToggleClass,
      filterArr,
      filterBySiteType,
      filterByRegions,
      filterByUserRoles,
      applyFilter,
      selectedReportType,
    } = this.props;

    // console.log('in filter', this.props);
    return (
      <div className="data-filter filter-bottom mrt-30">
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            {/* <div className="col-xl-2 col-md-6">
              <div className="form-group inline-form-group">
                <label className="mb-2">project</label>
                <CustomSelect label="select Project" />
              </div>
            </div> */}
            {selectedReportType <= 3 && (
              // filterArr.some(f => f.code === 'regions') && (
              <div className="col-xl-2 col-md-6">
                <FilterByData
                  className="form-group inline-form-group"
                  label="region"
                  toggleSelectClass={toggleSelectClass}
                  handleToggleClass={() => {
                    handleToggleClass('filterRegion');
                  }}
                  toggleType="filterRegion"
                  data={filterByRegions}
                  changeHandler={this.handleRegionFilter}
                  selectedArr={regions}
                  placeholderTxt="Select Regions"
                />
              </div>
            )}
            {selectedReportType <= 3 && (
              // filterArr.some(f => f.code === 'site_types') && (
              <div className="col-xl-2 col-md-6">
                <FilterByData
                  className="form-group inline-form-group"
                  label="site type"
                  toggleSelectClass={toggleSelectClass}
                  handleToggleClass={() => {
                    handleToggleClass('filterSiteType');
                  }}
                  toggleType="filterSiteType"
                  data={filterBySiteType}
                  changeHandler={this.handleSiteTypeFilter}
                  selectedArr={siteType}
                  placeholderTxt="Select Site Types"
                />
              </div>
            )}

            {selectedReportType === 4 && (
              // filterArr.some(f => f.code === 'user_roles') && (
              <div className="col-xl-2 col-md-6">
                <FilterByData
                  className="form-group inline-form-group"
                  label="user roles"
                  toggleSelectClass={toggleSelectClass}
                  handleToggleClass={() => {
                    handleToggleClass('filterUserRole');
                  }}
                  toggleType="filterUserRole"
                  data={filterByUserRoles}
                  changeHandler={this.handleUserRoleFilter}
                  selectedArr={userRoles}
                  placeholderTxt="Select User Roles"
                />
              </div>
            )}

            {selectedReportType === 5 && (
              <div className="col-xl-5 col-md-6">
                <FilterByDate
                  className="form-group icon-between inline-form-group"
                  startDate={startDate}
                  endDate={endDate}
                  createdDate={createdDate}
                  tillDate={tillDate}
                  startDateHandler={this.handleStartDateChange}
                  endDateHandler={this.handleEndDateChange}
                  errors={errors}
                />
              </div>
            )}
            {/* <div className="col-xl-2 col-md-6">
              <div className="form-group inline-form-group">
                <label className="">Site information</label>
                <CustomSelect label="select Project" />
              </div>
            </div> */}
            {/* <div className="col-xl-2 col-md-6">
              <div className="form-group inline-form-group">
                <label className="">Value</label>
                <CustomSelect label="select Region" />
              </div>
            </div> */}
            {/* <div className="col-xl-2 col-md-6">
              <div className="form-group inline-form-group">
                <label className="">Sub group</label>
                <CustomSelect label="select user roles" />
              </div>
            </div> */}
            <div className="col-md-12">
              <div className="buttons center mt-3">
                <button
                  disabled={!applyFilter}
                  type="submit"
                  className="common-button is-bg"
                >
                  Apply
                </button>
                <button
                  type="button"
                  disabled={!applyFilter}
                  className="common-button  is-clear"
                  onClick={() => {
                    this.handleClear();
                  }}
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
