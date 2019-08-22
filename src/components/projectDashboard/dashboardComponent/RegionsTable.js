import React from "react";
import Table from "../../common/Table";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { DotLoader } from "../../myForm/Loader";
import isEmpty from "../../../utils/isEmpty";

import withPagination from "../../../hoc/WithPagination";

class RegionsTable extends React.Component {
  state = {
    project_id: JSON.parse(this.props.id)
  };
  componentDidMount() {
    this.props.paginationHandler(1, null, {
      type: "projectRegionList",
      projectId: this.state.project_id
    });
  }
  render() {
    const { data, loader, terms } = this.props;

    const tableHeader = {
      projectRegions: !isEmpty(terms)
        ? [
            `${terms.region} ID`,
            `${terms.region} Name`,
            ,
            "Created Date",
            "Total Sites"
          ]
        : ["Region ID", "Region Name", "Created Date", "Total Sites"]
    };
    return (
      // <div className="card region-table">
      <>
        {/* <div className="card-header main-card-header sub-card-header">
          <h5>Lists</h5>
        </div> */}
        <div className="sub-card-header">
          <h5>Lists</h5>
        </div>
        <div className="card-body">
          <div style={{ position: "relative", height: "360px" }}>
            <PerfectScrollbar>
              {loader && <DotLoader />}
              {!loader && (
                <Table
                  page="projectManageRegion"
                  tableHeader={tableHeader.projectRegions}
                  tableRow={data}
                />
              )}
            </PerfectScrollbar>
          </div>
        </div>
      </>
    );
  }
}
export default withPagination(RegionsTable);
