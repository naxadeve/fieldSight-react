import React, { Component } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

class TableRow extends Component {
  renderName = (dataType, id) => {
    return this.props[dataType].find(dtype => dtype.id === +id).name;
  };

  tableRowMethod = () => ({
    siteInfo: (row, i, editHandler, removeHandler) => (
      <tr key={i}>
        <td>{row.question_text}</td>

        <td>{row.question_type}</td>
        <td>{row.form_id && this.renderName("forms", row.form_id)}</td>
        <td>{row.question && row.question.name}</td>
        <td>
          {row.selectedProject && this.renderName("projects", row.form_id)}
        </td>
        <td>
          <a
            onClick={() => editHandler(row.id || row.question_text)}
            className="td-edit-btn"
          >
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <i className="la la-edit" />
            </OverlayTrigger>
          </a>
          <a
            onClick={() => removeHandler(row.id || row.question_text)}
            className="td-delete-btn"
          >
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <i className="la la-trash-o" />
            </OverlayTrigger>
          </a>
        </td>
      </tr>
    )
  });
  render() {
    const {
      props: { tableRow, page, editHandler, removeHandler },
      tableRowMethod
    } = this;
    return (
      <tbody>
        {tableRow.map((row, i) =>
          tableRowMethod()[page](row, i, editHandler, removeHandler)
        )}
      </tbody>
    );
  }
}

export default TableRow;
