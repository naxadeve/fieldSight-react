import React, { Component } from 'react';
import axios from 'axios';

import { successToast } from '../../../utils/toastHandler';
import RightContentCard from '../../common/RightContentCard';
import Modal from '../../common/Modal';
import DeleteModal from '../../common/DeleteModal';
import FormTable from './formTable';
import GeneralFormModal from './generalForm';
import ScheduleFormModal from './scheduleform';
import RadioElement from '../../common/RadioElement';

/* eslint-disable */

export default class MyForm extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      popUpPage: false,
      scheduled_forms: [],
      selectId: '',
      forms: [],
      selected: '',
      openModal: false,
      form_id: '',
      generalPopUp: false,
      schedulePopUp: false,
      general_forms: [],
      form_type: '',
      checkbox: [],
      activeTab: 'myForms',
      organization_library_forms: [],
      selectOrganization: '',
      radioForms: '0',
      formTypePopUp: false,
      selectedName: '',
      loader: false,
      selectedId: '',
      selectedArr: [],
    };
  }

  componentDidMount() {
    const {
      props: { id },
      state: { forms, organization_library_forms },
    } = this;
    this._isMounted = true;
    if (this._isMounted) {
      axios
        .get(`/fv3/api/manage-super-organizations-library/${id}/`)
        .then(res => {
          const newArr = forms;
          const orgArr = organization_library_forms;
          this.setState(() => {
            if (res.data.forms !== undefined) {
              res.data.forms.map(arrPush => newArr.push(arrPush));
            }
            if (res.data.organization_library_forms !== undefined) {
              res.data.organization_library_forms.map(arrPush =>
                orgArr.push(arrPush),
              );
            }

            return {
              forms: res.data.forms,
              scheduled_forms:
                res.data.selected_forms.scheduled_forms,
              general_forms: res.data.selected_forms.general_forms,
              organization_library_forms:
                res.data.organization_library_forms,
              masterOrganization: res.data.organization_library_forms,
              masterForms: res.data.forms,
              loader: true,
            };
          });
        })
        .catch();
    }
  }

  handleChange = () => {
    this.setState(preveState => ({
      popUpPage: !preveState.popUpPage,
    }));
  };

  handleClosePopup = () => {
    this.setState({
      popUpPage: false,
    });
  };

  changeHandler = e => {
    const { checked, value } = e.target;

    if (checked) {
      this.setState(prevState => ({
        selected: [...prevState.selected, value],
      }));
    }

    if (!checked) {
      this.setState(preveState => ({
        selected: preveState.selected.filter(
          region => region !== value,
        ),
      }));
    }
  };

  openDelete = (form_id, form_type) => {
    this.setState(prevState => ({
      openModal: !prevState.openModal,
      form_id,
      form_type,
    }));
  };

  handleConfirm = () => {
    const {
      general_forms,
      scheduled_forms,
      form_id,
      form_type,
    } = this.state;
    const { id } = this.props;
    const body = { id: form_id };
    // debugger;
    axios
      .post(
        `/fv3/api/manage-super-organizations-library/${id}/`,
        body,
      )
      .then(async res => {
        if (res.status === 200) {
          if (form_type === 'general') {
            successToast('General Form', 'removed');
            const delet = general_forms.filter(
              data => form_id !== data.id,
            );

            await this.setState({
              general_forms: delet,
              openModal: false,
            });
          }
          if (form_type === 'scheduled') {
            successToast('Schedule Form', 'removed');
            const delet = scheduled_forms.filter(
              data => form_id !== data.id,
            );

            await this.setState({
              scheduled_forms: delet,
              openModal: false,
            });
          }
        }
      })
      .catch(err => {
        console.log(err.response, err, 'err');
        // const error = err.response.data;
        // Object.entries(error).map(([key, value]) => {
        //   return errorToast(`${value}`);
        // });
      });
  };

  handleCancle = () => {
    this.setState({
      openModal: false,
    });
  };

  generalCloseButton = () => {
    this.setState({
      generalPopUp: false,
    });
  };

  scheduleCloseButton = () => {
    this.setState({
      schedulePopUp: false,
    });
  };

  handleAllModel = res => {
    if (this._isMounted) {
      this.setState(
        {
          schedulePopUp: false,
          popUpPage: false,
          generalPopUp: false,
          general_forms: res.data.general_forms,
          scheduled_forms: res.data.scheduled_forms,
          selected: '',
          selectId: '',
          selectOrganization: '',
        },
        () => successToast('Organization Default Form', 'added'),
      );
    }
  };

  checkboxhandler = e => {
    const { id, checked } = e.target;
    this.setState(prevState => {
      if (checked) {
        return { checkbox: [...prevState.checkbox, id] };
      }
      if (!checked) {
        return {
          checkbox: prevState.checkbox.filter(
            region => region !== id,
          ),
        };
      }
      return null;
    });
  };

  toggleTab = result => {
    this.setState({
      activeTab: result,
    });
  };

  OrganizationHandler = id => {
    const { masterOrganization } = this.state;

    this.setState(
      {
        selectOrganization: id,
        formTypePopUp: false,
      },
      () => {
        const displayName = this.state.organization_library_forms.filter(
          form => id === form.xf_id,
        );
        this.setState({
          selectedArr: displayName,
          organization_library_forms: masterOrganization,
        });
      },
    );
  };

  handleRadioChange = e => {
    const { value } = e.target;
    this.setState(() => {
      if (value === '0') {
        return {
          radioForms: value,
        };
      }
      if (value === '1') {
        return {
          radioForms: value,
        };
      }
      return null;
    });
  };

  handleFormType = () => {
    this.setState(prevState => ({
      formTypePopUp: !prevState.formTypePopUp,
    }));
  };

  handleCloseFormType = () => {
    this.setState(prevState => ({
      formTypePopUp: !prevState.formTypePopUp,
    }));
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleForm(id) {
    const { masterForms, masterOrganization } = this.state;

    this.setState(
      {
        selectId: id,
        formTypePopUp: false,
      },
      () => {
        const displayName = this.state.forms.filter(
          form => id === form.xf_id,
        );
        this.setState({
          selectedArr: displayName,
          forms: masterForms,
        });
      },
    );
  }

  onChangeHandler = async (e, type) => {
    const {
      target: { value },
    } = e;
    const {
      organization_library_forms,
      forms,
      masterOrganization,
      masterForms,
    } = this.state;

    if (value && type === 'organization') {
      const search = await organization_library_forms.filter(
        result => {
          return result.title
            .toLowerCase()
            .includes(value.toLowerCase());
        },
      );
      this.setState({
        organization_library_forms: search,
      });
    } else {
      this.setState({
        organization_library_forms: masterOrganization,
      });
    }
    if (value && type === 'myForms') {
      const search = await forms.filter(result => {
        return result.title
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      this.setState({
        forms: search,
      });
    } else {
      this.setState({
        forms: masterForms,
      });
    }
  };

  render() {
    const {
      state: {
        scheduled_forms,
        selectId,
        general_forms,
        popUpPage,
        forms,
        openModal,
        generalPopUp,
        schedulePopUp,
        activeTab,
        organization_library_forms,
        selectOrganization,
        radioForms,
        formTypePopUp,
        selectedName,
        loader,
        selectedArr,
      },
      props: { id },
      openDelete,
      handleCancle,
      handleConfirm,
      scheduleCloseButton,
      handleAllModel,
      toggleTab,
    } = this;
    return (
      <>
        <RightContentCard
          title="Organization Default FormS"
          addButton
          toggleModal={this.handleChange}
          // buttonName="Add"
        >
          <FormTable
            orgId={id}
            selected_forms={scheduled_forms}
            openDelete={openDelete}
            general_forms={general_forms}
            loader={loader}
          />
        </RightContentCard>

        {popUpPage && (
          <Modal
            title="Add Organization Default Forms"
            toggleModal={this.handleClosePopup}
            showButton
            showText="Create Form"
            url="/forms/create/"
          >
            <form
              className="floating-form"
              onSubmit={this.handleSubmit}
            >
              <div className="form-form">
                <div className="selected-form">
                  <div className="selected-text">
                    <div className="form-group flexrow checkbox-group">
                      <label>Form Types</label>
                      <div className="custom-checkbox display-inline">
                        <RadioElement
                          label="General Form"
                          className="General Forms"
                          name="status"
                          value={0}
                          changeHandler={this.handleRadioChange}
                          checked={radioForms === '0'}
                        />
                        <RadioElement
                          label="Scheduled Form"
                          className="Scheduled Forms"
                          name="status"
                          value={1}
                          changeHandler={this.handleRadioChange}
                          checked={radioForms === '1'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            {radioForms === '0' && (
              <GeneralFormModal
                selected={selectId}
                organization={selectOrganization}
                formType={radioForms}
                id={id}
                handleAllModel={handleAllModel}
                handleFormType={this.handleFormType}
                selectedName={selectedName}
                SelectedArr={selectedArr}
              />
            )}

            {radioForms === '1' && (
              <ScheduleFormModal
                selected={selectId}
                organization={selectOrganization}
                formType={radioForms}
                handleAllModel={handleAllModel}
                id={id}
                handleFormType={this.handleFormType}
                SelectedArr={selectedArr}
              />
            )}
          </Modal>
        )}
        {formTypePopUp && (
          <Modal
            title="Add Forms"
            toggleModal={this.handleCloseFormType}
          >
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
                  My Forms
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={
                    activeTab === 'organizationForm'
                      ? 'nav-link active'
                      : 'nav-link'
                  }
                  onClick={() => toggleTab('organizationForm')}
                  tabIndex="0"
                  role="button"
                  onKeyDown={() => toggleTab('organizationForm')}
                >
                  Organization Library Form
                </a>
              </li>
            </ul>

            {activeTab === 'myForms' && (
              <>
                <div className="form-group search-group mrt-15">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search"
                    onChange={e => this.onChangeHandler(e, 'myForms')}
                  />
                  <i className="la la-search" />
                </div>
                <div className="form-group">
                  {forms.map(formList => (
                    <div key={formList.xf_id}>
                      <a
                        role="button"
                        onKeyDown={handleConfirm}
                        tabIndex="0"
                        className="td-delete-btn"
                        onClick={() => {
                          this.handleForm(formList.xf_id);
                        }}
                      >
                        <div className="form-group">
                          <label>{formList.title}</label>
                        </div>
                        {/* {formList.title} */}
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'organizationForm' && (
              <>
                <div className="form-group search-group mrt-15">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search"
                    onChange={e =>
                      this.onChangeHandler(e, 'organization')
                    }
                  />
                  <i className="la la-search" />
                </div>
                <div className="form-group">
                  {organization_library_forms ? (
                    organization_library_forms.map(formList => (
                      <div key={formList.xf_id}>
                        <a
                          role="button"
                          onKeyDown={handleConfirm}
                          tabIndex="0"
                          className="td-delete-btn"
                          onClick={() => {
                            this.OrganizationHandler(formList.xf_id);
                          }}
                        >
                          <div className="form-group">
                            <label>{formList.title}</label>
                          </div>
                        </a>
                      </div>
                    ))
                  ) : (
                    <p>No organization library forms </p>
                  )}
                </div>
              </>
            )}
          </Modal>
        )}
        {openModal && (
          <DeleteModal
            onCancel={handleCancle}
            onConfirm={handleConfirm}
            onToggle={handleCancle}
            title="Warning"
            message="Are you sure you want to delete?"
          />
        )}
      </>
    );
  }
}
