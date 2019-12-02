import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import RadioElement from '../common/RadioElement';
import { DotLoader } from '../myForm/Loader';

/* eslint-disable  consistent-return */
/* eslint-disable   react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */

class AddForm extends PureComponent {
  render() {
    const {
      props: {
        activeTab,
        onChangeHandler,
        toggleTab,
        formList,
        handleRadioChange,
        projectList,
        sharedList,
        loader,
      },
    } = this;

    return (
      <>
        <ul className="nav nav-tabs ">
          <li className="nav-item">
            <a
              className={
                activeTab === 'myForms'
                  ? 'nav-link active'
                  : 'nav-link'
              }
              onClick={() => toggleTab('myForms')}
              tabIndex="0"
              role="button"
              onKeyDown={() => toggleTab('myForms')}
            >
              <FormattedMessage
                id="app.my-forms"
                defaultMessage="My Forms"
              />
            </a>
          </li>
          <li className="nav-item">
            <a
              className={
                activeTab === 'sharedForms'
                  ? 'nav-link active'
                  : 'nav-link'
              }
              onClick={() => toggleTab('sharedForms')}
              tabIndex="0"
              role="button"
              onKeyDown={() => toggleTab('sharedForms')}
            >
              <FormattedMessage
                id="app.sharedForms"
                defaultMessage="Shared Forms"
              />
            </a>
          </li>
          <li className="nav-item">
            <a
              className={
                activeTab === 'projectForms'
                  ? 'nav-link active'
                  : 'nav-link'
              }
              onClick={() => toggleTab('projectForms')}
              tabIndex="0"
              role="button"
              onKeyDown={() => toggleTab('projectForms')}
            >
              <FormattedMessage
                id="app.project-forms"
                defaultMessage="Project Forms"
              />
            </a>
          </li>
          {/* <li className="nav-item">
              <a
                className={
                  activeTab === "libraryForms" ? "nav-link active" : "nav-link"
                }
                onClick={() => toggleTab("libraryForms")}
              >
                Library Forms
              </a>
            </li> */}
        </ul>
        {loader && <DotLoader />}

        {!loader && activeTab === 'myForms' && (
          <div className="thumb-list mr-0 ">
            {/* <form
              className="floating-form"
              onSubmit={e => {
                e.preventDefault();
              }}
            > */}
            <div className="form-group search-group mrt-15">
              <input
                type="search"
                className="form-control"
                placeholder="Search"
                onChange={onChangeHandler}
              />
              <i className="la la-search" />
            </div>
            {formList.length === 0 ? (
              <div>
                <FormattedMessage
                  id="app.noFormAvailable"
                  defaultMessage="No Form Available"
                />
              </div>
            ) : (
              <div>
                {formList.map((each, i) => {
                  return (
                    <div className="form-group" key={`form_${i}`}>
                      <RadioElement
                        label={each.title}
                        className="radiobox"
                        name="myform"
                        value={each.id}
                        changeHandler={e => {
                          handleRadioChange(e, each.title);
                        }}
                      />
                      <div className="select-form-info">
                        <span className="form-owner">
                          {each.owner}
                        </span>
                        <time>
                          <i className="la la-clock-o" />
                          {each.date_created}
                        </time>
                      </div>
                    </div>
                  );
                })}
                {/* <div className="form-group pull-right no-margin">
                    <button
                      type="button"
                      className="fieldsight-btn"
                      onClick={handleSaveForm}
                    >
                      Save
                    </button>
                  </div> */}
              </div>
            )}
            {/* </form> */}
          </div>
        )}

        {!loader && activeTab === 'projectForms' && (
          <div className="thumb-list mr-0 ">
            {/* <form
              className="floating-form"
              onSubmit={e => {
                e.preventDefault();
              }}
            > */}
            <div className="form-group search-group mrt-15">
              <input
                type="search"
                className="form-control"
                placeholder="Search"
                onChange={onChangeHandler}
              />
              <i className="la la-search" />
            </div>
            {projectList.length === 0 ? (
              <div>
                <FormattedMessage
                  id="app.noFormAvailable"
                  defaultMessage="No Form Available"
                />
              </div>
            ) : (
              <div>
                {projectList.map((each, i) => (
                  <Fragment key={`form_${i}`}>
                    {each.forms && each.forms.length > 0 && (
                      <div className="form-group">
                        <div>
                          <h5>{each.name}</h5>
                        </div>
                        {console.log(each.forms, 'each.forms')}
                        {each.forms.map(item => (
                          <div
                            className="form-group"
                            // key={`form_${i}`}
                          >
                            <RadioElement
                              label={item.title}
                              className="radiobox"
                              name="myform"
                              value={item.id}
                              changeHandler={e => {
                                handleRadioChange(e, item.title);
                              }}
                            />
                            <div className="select-form-info">
                              <span className="form-owner">
                                {item.owner}
                              </span>
                              <time>
                                <i className="la la-clock-o" />
                                {each.date_created}
                              </time>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Fragment>
                ))}
                {/* <div className="form-group pull-right no-margin">
                    <button
                      type="button"
                      className="fieldsight-btn"
                      onClick={handleSaveForm}
                    >
                      Save
                    </button>
                  </div> */}
              </div>
            )}
            {/* </form> */}
          </div>
        )}

        {!loader && activeTab === 'sharedForms' && (
          <div className="thumb-list mr-0 ">
            {/* <form
              className="floating-form"
              onSubmit={e => {
                e.preventDefault();
              }}
            > */}
            <div className="form-group search-group mrt-15">
              <input
                type="search"
                className="form-control"
                placeholder="Search"
                onChange={onChangeHandler}
              />
              <i className="la la-search" />
            </div>
            {sharedList.length === 0 ? (
              <div>
                <FormattedMessage
                  id="app.noFormAvailable"
                  defaultMessage="No Form Available"
                />
              </div>
            ) : (
              <div>
                {sharedList.map((each, i) => {
                  return (
                    <div className="form-group" key={`form_${i}`}>
                      <RadioElement
                        label={each.title}
                        className="radiobox"
                        name="myform"
                        value={each.id}
                        changeHandler={e => {
                          handleRadioChange(e, each.title);
                        }}
                      />
                      <div className="select-form-info">
                        <span className="form-owner">
                          {each.owner}
                        </span>
                        <time>
                          <i className="la la-clock-o" />
                          {each.date_created}
                        </time>
                      </div>
                    </div>
                  );
                })}
                {/* <div className="form-group pull-right no-margin">
                    <button
                      type="button"
                      className="fieldsight-btn"
                      onClick={handleSaveForm}
                    >
                      Save
                    </button>
                  </div> */}
              </div>
            )}
            {/* </form> */}
          </div>
        )}
      </>
    );
  }
}
export default AddForm;
