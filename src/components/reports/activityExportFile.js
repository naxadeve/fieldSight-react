import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Dropdown } from 'react-bootstrap';
import format from 'date-fns/format';
import axios from 'axios';
import RadioElement from '../common/RadioElement';
import { errorToast, successToast } from '../../utils/toastHandler';

export default class ActivityExportFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleType: 'Daily',
      startedDate: '',
      endedDate: '',
      project: 'Project',
    };
  }

  handleYearlyChange = e => {
    const { value } = e.target;

    this.setState(state => {
      if (value === 'Daily') {
        return {
          scheduleType: value,
        };
      }
      if (value === 'Weekly') {
        return {
          scheduleType: value,
        };
      }
      if (value === 'Monthly') {
        return {
          scheduleType: value,
        };
      }
      return null;
    });
  };

  onEndChangeHandler = date => {
    this.setState({
      endedDate: date,
    });
  };

  onChangeHandler = date => {
    this.setState({
      startedDate: date,
    });
  };

  toUpper = str => {
    return str
      .toLowerCase()
      .split(' ')
      .map(function(word) {
        return word[0].toLowerCase() + word.substr(1);
      })
      .join('_');
  };

  handleApply = e => {
    e.preventDefault();

    const {
      match: {
        params: { id },
      },
      location: {
        state: { fromDashboard },
      },
    } = this.props;
    const user = 'u';

    const data = {
      start_date: format(this.state.startedDate, ['YYYY-MM-DD']),
      end_date: format(this.state.endedDate, ['YYYY-MM-DD']),
      ...(fromDashboard === 'Activity Report' && {
        type: this.state.scheduleType,
      }),
      ...(fromDashboard === 'Project Logs' && {
        type: this.state.project,
      }),
      ...(fromDashboard === 'User Activity Report' && {
        type: `${user}${this.state.project}`,
      }),
    };

    const route = this.toUpper(
      this.props.location.state.fromDashboard,
    );

    axios
      .post(
        `/v4/api/reporting/generate-standard-reports/${id}/?report_type=${route}`,
        data,
      )
      .then(req => {
        if (req.status === 200) {
          successToast(req.data.message);
        }
      })
      .catch(err => {
        const error = err.response.data;
        Object.entries(error).map(([key, value]) => {
          return errorToast(`${value}`);
        });
      });
  };

  render() {
    const {
      state: { scheduleType },
      props: {
        location: {
          state: { fromDashboard },
        },
      },
    } = this;
    // const {state:{fromDashboard}}=this.props.location

    const DataCrude = [
      {
        id: '1',
        title: 'Edit',
        link: '#',
      },
      {
        id: '2',
        title: 'Add a template',
        link: '#',
      },
      {
        id: '3',
        title: 'Share',
        link: '#',
      },
      {
        id: '4',
        title: 'Delete',
        link: '#',
      },
    ];

    return (
      <div className="reports mrb-30">
        <div className="card">
          <div className="card-body">
            <div className="standard-tempalte">
              <h3 className="mb-3">Template report</h3>

              <div className="report-list">
                <div className="row">
                  <div className="col-md-12">
                    <div className="report-content">
                      <h4>Export Data</h4>
                      {fromDashboard === 'Activity Report' && (
                        <p>
                          Export of site visits, submissions and
                          active users in a selected time interval.
                        </p>
                      )}

                      {fromDashboard === 'Project Logs' && (
                        <p>
                          Export of all the logs in the project in a
                          selected time interval.
                        </p>
                      )}
                      {fromDashboard === 'User Activity Report' && (
                        <p>
                          Export of User Activities in a selected time
                          interval.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="dropdown report-option">
                  <Dropdown drop="left">
                    <Dropdown.Toggle
                      variant=""
                      id="dropdown-Data"
                      className="dropdown-toggle common-button no-border is-icon"
                    >
                      <i className="material-icons">more_vert</i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                      {DataCrude.map(item => (
                        <Dropdown.Item
                          href={item.link}
                          key={item.id}
                          target="_blank"
                        >
                          {item.title}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="data-filter mt-3">
                <h3 className="mb-3">Filters</h3>
                <form>
                  {fromDashboard === 'Activity Report' && (
                    <div className="form-group checkbox-group">
                      <label>Select Report Type:</label>
                      <div className="custom-checkbox display-inline">
                        <RadioElement
                          label="Daily"
                          name="scheduleType"
                          value="Daily"
                          changeHandler={this.handleYearlyChange}
                          checked={scheduleType === 'Daily'}
                        />
                        <RadioElement
                          label="Weekly"
                          name="scheduleType"
                          value="Weekly"
                          changeHandler={this.handleYearlyChange}
                          checked={scheduleType === 'Weekly'}
                        />
                        <RadioElement
                          label="Monthly"
                          name="scheduleType"
                          value="Monthly"
                          changeHandler={this.handleYearlyChange}
                          checked={scheduleType === 'Monthly'}
                        />
                      </div>
                    </div>
                  )}

                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group icon-between">
                        <label className="mb-2">Time period</label>
                        <div className="inline-flex ">
                          <div className="custom-group">
                            <DatePicker
                              placeholderText="Start Date"
                              name="startedDate"
                              selected={this.state.startedDate}
                              onChange={this.onChangeHandler}
                              dateFormat="yyyy-MM-dd"
                              className="form-control"
                            />
                          </div>
                          <span className="icon-between">
                            <i className="material-icons">
                              arrow_right_alt
                            </i>
                          </span>
                          <div className="custom-group">
                            <DatePicker
                              placeholderText="End Date"
                              name="endedDate"
                              selected={this.state.endedDate}
                              onChange={this.onEndChangeHandler}
                              className="form-control"
                              dateFormat="yyyy-MM-dd"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <button
                        // disabled
                        type="button"
                        className="common-button mt-3 is-bg"
                        onClick={this.handleApply}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}