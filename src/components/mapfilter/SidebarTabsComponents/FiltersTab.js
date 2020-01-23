import React, { Component } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';

class FiltersTab extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      activeTab,
      projectsList,
      projectsRegionTypes,
      handleRegionChange,
      handleSiteChange,
      handleProgressChange,
      handleStatusChange,
      handleProjectChange,
    } = this.props;
    return (
      <div
        className={`tab-pane fade ${
          activeTab === 'filters' ? 'show active' : ''
        }`}
        id="sidebar-filter"
        role="tabpanel"
        aria-labelledby="sidebar-filter_tab"
      >
        <Accordion id="accordion" className="map-accordion">
          <Card>
            <Card.Header>
              <Accordion.Toggle
                as={Card.Link}
                className="card-link btn-link"
                // variant="link"
                eventKey="0"
              >
                Project
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Scrollbars style={{ height: '200px' }}>
                  <div className="card-body">
                    <div className="sidebar-list">
                      {projectsList &&
                        projectsList.map(each => {
                          const projectName = each.name;
                          return (
                            <div key={each.id} className="form-group">
                              <div className="checkbox">
                                <label>
                                  <input
                                    type="checkbox"
                                    name={projectName}
                                    defaultChecked
                                    onChange={handleProjectChange}
                                  />
                                  <i className="helper" />
                                  {projectName}
                                </label>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </Scrollbars>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            {/* <div className="card"> */}
            <Card.Header>
              <Accordion.Toggle
                as={Card.Link}
                className="card-link btn-link"
                // variant="link"
                eventKey="1"
              >
                Progress
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <Scrollbars style={{ height: '200px' }}>
                  <div className="sidebar-list">
                    <div className="form-group">
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="0_0"
                            value="0_0"
                            onChange={handleProgressChange}
                          />
                          <i className="helper" />
                          0%
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="1_20"
                            value="1_20"
                            onChange={handleProgressChange}
                          />
                          <i className="helper" />
                          1-20%
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="21_40"
                            value="21_40"
                            onChange={handleProgressChange}
                          />
                          <i className="helper" />
                          21-40%
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="41_60"
                            value="41_60"
                            onChange={handleProgressChange}
                          />
                          <i className="helper" />
                          41%-60%
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="61_80"
                            value="61_80"
                            onChange={handleProgressChange}
                          />
                          <i className="helper" />
                          61%-80%
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="81_100"
                            value="81_100"
                            onChange={handleProgressChange}
                          />
                          <i className="helper" />
                          81%-100%
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="100_100"
                            value="100_100"
                            onChange={handleProgressChange}
                          />
                          <i className="helper" />
                          100%
                        </label>
                      </div>
                    </div>
                  </div>
                </Scrollbars>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            {/* < className="card"> */}
            <Card.Header>
              <Accordion.Toggle
                as={Card.Link}
                className="card-link btn-link"
                // variant="link"
                eventKey="2"
              >
                Form Status
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <Scrollbars style={{ height: '200px' }}>
                  <div className="form-group flexrow checkbox-group">
                    <div className="custom-checkbox display-inline">
                      <div className="radiobox approved">
                        <label>
                          <input
                            type="radio"
                            name="radioYes"
                            value="3"
                            onChange={handleStatusChange}
                          />
                          <i className="helper" />
                          Approved
                        </label>
                      </div>
                      <div className="radiobox pending">
                        <label>
                          <input
                            type="radio"
                            name="radioYes"
                            value="0"
                            onChange={handleStatusChange}
                          />
                          <i className="helper" />
                          Pending
                        </label>
                      </div>
                      <div className="radiobox flagged">
                        <label>
                          <input
                            type="radio"
                            name="radioYes"
                            value="2"
                            onChange={handleStatusChange}
                          />
                          <i className="helper" />
                          Flagged
                        </label>
                      </div>
                      <div className="radiobox rejected">
                        <label>
                          <input
                            type="radio"
                            name="radioYes"
                            value="1"
                            onChange={handleStatusChange}
                          />
                          <i className="helper" />
                          Rejected
                        </label>
                      </div>
                    </div>
                  </div>
                </Scrollbars>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <Accordion.Toggle
                as={Card.Link}
                className="card-link btn-link"
                // variant="link"
                eventKey="3"
              >
                Site Type
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="3">
              <Card.Body>
                <Scrollbars style={{ height: '200px' }}>
                  <div className="sidebar-list">
                    {projectsRegionTypes[0] &&
                      projectsRegionTypes[0].site_types &&
                      projectsRegionTypes[0].site_types.map(data => {
                        // console.log(data);
                        return (
                          <div key={data.id} className="form-group">
                            <div className="checkbox">
                              <label>
                                <input
                                  type="checkbox"
                                  name={data.name}
                                  // checked={this.state.checkedItems.includes(
                                  //   data.name,
                                  // )}
                                  onChange={handleSiteChange}
                                  // onChange={this.filterChange}
                                />
                                <i className="helper" />
                                {data.name}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </Scrollbars>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <Accordion.Toggle
                as={Card.Link}
                className="card-link btn-link"
                // variant="link"
                eventKey="4"
              >
                Region
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="4">
              <Card.Body>
                <Scrollbars style={{ height: '200px' }}>
                  <div className="sidebar-list">
                    {projectsRegionTypes[0] &&
                      projectsRegionTypes[0].regions &&
                      projectsRegionTypes[0].regions.map(data => {
                        // console.log(data);
                        // debugger
                        return (
                          <div key={data.id} className="form-group">
                            <div className="checkbox">
                              <label>
                                <input
                                  type="checkbox"
                                  name={data.name}
                                  // checked={this.state.checkedItems.includes(
                                  //   data.name,
                                  // )}
                                  onChange={handleRegionChange}
                                  // onChange={this.filterChange}
                                />
                                <i className="helper" />
                                {data.name}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </Scrollbars>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}

export default FiltersTab;
