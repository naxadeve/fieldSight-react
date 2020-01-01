import React, { PureComponent } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
// import CustomCheckBox from './CustomCheckbox';
/* eslint-disable */

export default class CustomMultiSelect extends PureComponent {
  render() {
    const {
      toggleSelectClass,
      handleToggleClass,
      toggleType,
      checkboxOption,
      handleCheck,
      selectedArr,
      placeholderTxt,
    } = this.props;

    return (
      <div className="common-select">
        <div
          className={
            toggleSelectClass[toggleType]
              ? 'select-wrapper select-toggle'
              : 'select-wrapper'
          }
          onClick={handleToggleClass}
        >
          <span className="select-item">{placeholderTxt}</span>

          {/* <div
            style={{
              position: 'relative',
              height: `300px `,
            }}
          >
            <PerfectScrollbar> */}
          <ul>
            {checkboxOption.length > 0 &&
              checkboxOption.map(option => {
                const filterList = selectedArr.filter(i =>
                  i.code
                    ? i.code === option.code
                    : i.name
                    ? i.name === option.name
                    : '',
                );
                const isChecked =
                  filterList && filterList[0] ? true : false;
                const id = option.code
                  ? option.code
                  : option.id
                  ? option.id
                  : option.name
                  ? option.name
                  : '';
                const name = option.code
                  ? option.code
                  : option.name
                  ? option.name
                  : '';
                return (
                  <li
                    key={`option_${
                      option.code
                        ? option.code
                        : option.id
                        ? option.id
                        : option.name
                        ? option.name
                        : ''
                    }`}
                  >
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id={id}
                        name={name}
                        checked={isChecked}
                        onChange={e => {
                          handleCheck(e, option);
                        }}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor={id}
                        style={{ paddingLeft: '2em' }}
                      >
                        {option.label ? option.label : option.name}
                      </label>
                    </div>
                    {/* <CustomCheckBox
                    id={option.code}
                    name={option.code}
                    checked={selectedArr.includes(option.code)}
                    changeHandler={handleCheck}
                    label={option.label}
                  /> */}
                  </li>
                );
              })}
          </ul>
          {/* </PerfectScrollbar>
          </div> */}
        </div>
      </div>
    );
  }
}
