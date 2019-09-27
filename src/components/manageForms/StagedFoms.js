import React, { Component } from "react";
import axios from "axios";
import { Accordion, Card } from "react-bootstrap";

import { DotLoader } from "../myForm/Loader";
import Modal from "../common/Modal";
import RightContentCard from "../common/RightContentCard";
import InputElement from "../common/InputElement";
import CommonPopupForm from "./CommonPopupForm";
import { errorToast, successToast } from "../../utils/toastHandler";
import EditFormGuide from "./EditFormGuide";
import SubStageTable from "./subStageTable";
import AddStageForm from "./AddStageForm";
import AddForm from "./AddForm";
import SortableStage from "./SortableStage";

class StagedForms extends Component {
  _isMounted = false;
  state = {
    id: this.props.match.params ? this.props.match.params.id : "",
    data: [],
    loader: false,
    deployStatus: false,
    editGuide: false,
    guideData: {},
    editFormId: "",
    showFormModal: false,
    activeTab: "myForms",
    commonFormData: {
      status: 3,
      isDonor: true,
      isEdit: true,
      isDelete: true,
      regionSelected: [],
      typeSelected: [],
      xf: ""
    },
    optionType: "",
    optionRegion: "",
    loader: false,
    loaded: 0,
    formId: "",
    formTitle: "",
    weight: 0,
    isProjectForm: "",
    myFormList: [],
    projectFormList: [],
    sharedFormList: [],
    subStageData: [],
    loadSubStage: false,
    showSubstageForm: false,
    selectedStage: {},
    order: 0,
    substageTitle: "",
    substageDesc: "",
    stageId: "",
    substageId: "",
    isStageReorder: false,
    newStageOrder: [],
    isStageReorderCancel: true
  };

  componentDidMount() {
    this._isMounted = true;
    const {
      match: {
        url,
        params: { id }
      }
    } = this.props;
    const splitArr = url.split("/");
    const isProjectForm = splitArr.includes("project");

    if (isProjectForm) {
      this.setState(
        {
          loader: true,
          isProjectForm
        },
        this.requestStagedData(id)
      );
    }
  }

  requestStagedData = projectId => {
    axios
      .get(`fv3/api/manage-forms/stages/?project_id=${projectId}`)
      .then(res => {
        if (this._isMounted) {
          this.setState({ data: res.data, loader: false });
        }
      })
      .catch(err => {});
  };

  handleStageReorder = () => {
    this.setState({
      isStageReorder: !this.state.isStageReorder,
      isStageReorderCancel: !this.state.isStageReorderCancel
    });
  };
  handleNewStageOrder = list => {
    this.setState({
      newStageOrder: list
    });
  };
  handleSaveStageReorder = () => {
    axios
      .post(`fv3/api/forms/reorder/stage/`, this.state.newStageOrder)
      .then(res => {
        console.log("------", res.data);
        this.setState(
          {
            data: res.data.data,
            isStageReorder: false
            // isStageReorderCancel: true
          },
          () => {
            successToast("reordered", "successfully");
          }
        );
      })
      .catch(err => {
        errorToast(err);
      });
  };
  handleRequestSubStage = (stageId, order) => {
    this.setState(
      {
        loadSubStage: true,
        order: order,
        stageId
      },
      () => {
        axios
          .get(`fv3/api/manage-forms/sub-stages/?stage_id=${stageId}`)
          .then(res => {
            this.setState({
              loadSubStage: false,
              subStageData: res.data
            });
          })
          .catch(err => {
            errorToast(err);
          });
      }
    );
  };
  changeDeployStatus = (formId, isDeploy) => {
    const { id } = this.state;
    axios
      .post(
        `fv3/api/manage-forms/deploy/?project_id=${id}&type=substage&id=${formId}`,
        { is_deployed: !isDeploy }
      )
      .then(res => {
        this.setState(
          state => {
            const newData = this.state.subStageData;
            newData.map(each => {
              const arrItem = { ...each };

              if (each.id == formId) {
                each.is_deployed = !isDeploy;
              }
              return arrItem;
            });
            return { subStageData: newData };
          },
          () => {
            successToast("Form", "updated");
          }
        );
      })
      .catch(err => {});
  };
  deleteItem = (formId, isDeploy) => {
    const { id } = this.state;
    axios
      .post(
        `fv3/api/manage-forms/delete/?project_id=${id}&type=substage&id=${formId}`,
        { is_deployed: isDeploy }
      )
      .then(res => {
        this.setState(
          {
            subStageData: this.state.subStageData.filter(
              each => each.id != formId
            )
          },
          () => {
            successToast("Form", "deleted");
          }
        );
      })
      .catch(err => {});
  };

  handleEditGuide = (data, formId) => {
    this.setState({
      editGuide: !this.state.editGuide,
      guideData: data ? data : {},
      editFormId: formId
    });
  };
  handleUpdateGuide = data => {
    const { id, editFormId, stageId } = this.state;
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.text) formData.append("text", data.text);
    if (data.pdf) formData.append("pdf", data.pdf);
    if (data.is_pdf) formData.append("is_pdf", data.is_pdf);
    // if (editFormId) formData.append("fsxf", editFormId);
    if (data.images && data.images.length > 0) {
      data.images.map((each, i) => {
        if (!each.image) formData.append(`new_images_${i + 1}`, each);
      });
    }
    if (data.id) {
      formData.append("id", data.id);
    }
    formData.append("stage", editFormId);
    axios
      .post(`forms/api/save_educational_material/`, formData)
      .then(res => {
        this.setState(
          {
            editGuide: false
          },
          () => {
            this.handleRequestSubStage(stageId);
            successToast("update", "successfully");
          }
        );
      })
      .catch(err => {
        errorToast(err);
      });
  };

  handleSubStageForm = () => {
    this.setState({
      showSubstageForm: !this.state.showSubstageForm
    });
  };
  handleSubmitStageForm = data => {
    const { name, desc, selectedRegion, selectedType, order, id } = data;
    const mapRegion = selectedRegion.map(each => each.id);
    const mapType = selectedType.map(each => each.id);
    const newOrder = order > 0 ? order : this.state.data.length + 1;

    if (order > 0) {
      const body = {
        name: name,
        tags: mapType,
        regions: mapRegion,
        order: newOrder,
        description: desc,
        id: id
      };
      axios
        .put(
          `fv3/api/manage-forms/stages/${id}/?project_id=${this.state.id}`,
          body
        )
        .then(res => {
          this.setState(
            state => {
              const data = this.state.data;
              const newArr = data.map(each => {
                if (each.id == res.data.id) {
                  return (each = res.data);
                } else {
                  return each;
                }
              });
              return {
                data: newArr
              };
            },
            () => {
              this.props.closePopup();
              successToast("Updated", "successfully");
            }
          );
        })
        .catch(err => {
          errorToast(err);
        });
    } else {
      const body = {
        name: name,
        tags: mapType,
        regions: mapRegion,
        order: newOrder,
        description: desc
      };
      axios
        .post(`fv3/api/manage-forms/stages/?project_id=130`, body)
        .then(res => {
          this.setState(
            {
              data: [...this.state.data, res.data]
            },
            () => {
              this.props.closePopup();
              successToast("Created", "successfully");
            }
          );
        })
        .catch(err => {
          errorToast(err);
        });
    }
  };
  handleClickEdit = stageData => {
    this.setState(
      {
        selectedStage: stageData
      },
      () => {
        this.props.commonPopupHandler();
      }
    );
  };
  handleClearState = () => {
    this.setState(
      {
        activeTab: "myForms",
        commonFormData: {
          status: 3,
          isDonor: false,
          isEdit: false,
          isDelete: false,
          regionSelected: [],
          typeSelected: [],
          xf: ""
        },
        formId: "",
        formTitle: "",
        weight: 0
      },
      () => {
        this.handleSubStageForm();
      }
    );
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  toggleFormModal = () => {
    this.setState({ showFormModal: !this.state.showFormModal });
  };

  toggleTab = tab => {
    this.setState({
      activeTab: tab,
      myFormList: this.props.myForms,
      sharedFormList: this.props.sharedForms,
      projectFormList: this.props.projectForms
    });
  };
  handleRadioChange = e => {
    const { name, value } = e.target;

    this.setState(state => {
      if (name == "status") {
        return {
          commonFormData: {
            ...this.state.commonFormData,
            status: value
          }
        };
      } else if (name == "donor") {
        return {
          commonFormData: {
            ...this.state.commonFormData,
            isDonor: JSON.parse(value)
          }
        };
      } else if (name == "edit") {
        return {
          commonFormData: {
            ...this.state.commonFormData,
            isEdit: JSON.parse(value)
          }
        };
      } else if (name == "delete") {
        return {
          commonFormData: {
            ...this.state.commonFormData,
            isDelete: JSON.parse(value)
          }
        };
      }
    });
  };
  handleSelectRegionChange = e => {
    e.map(region => {
      this.setState(state => {
        return {
          commonFormData: {
            ...this.state.commonFormData,
            regionSelected: [
              ...this.state.commonFormData.regionSelected,
              region.id
            ]
          }
        };
      });
    });
  };
  handleSelectTypeChange = e => {
    e.map(type => {
      this.setState(state => {
        return {
          commonFormData: {
            ...this.state.commonFormData,
            typeSelected: [...this.state.commonFormData.typeSelected, type.id]
          }
        };
      });
    });
  };
  handleMyFormChange = (e, title) => {
    this.setState({
      formId: e.target.value,
      formTitle: title
    });
  };
  handleSaveForm = () => {
    this.setState({
      commonFormData: {
        ...this.state.commonFormData,
        xf: this.state.formId
      },
      showFormModal: !this.state.showFormModal
    });
  };
  handleCreateForm = e => {
    e.preventDefault();
    const {
      weight,
      commonFormData,
      order,
      substageTitle,
      substageDesc,
      stageId,
      substageId
    } = this.state;

    if (!!substageId) {
      const body = {
        id: substageId,
        weight: weight,
        name: substageTitle,
        description: substageDesc,
        order: order,
        xf: commonFormData.xf,
        default_submission_status: commonFormData.status,
        setting: {
          types: commonFormData.typeSelected,
          regions: commonFormData.regionSelected,
          donor_visibility: commonFormData.isDonor,
          can_edit: commonFormData.isEdit,
          can_delete: commonFormData.isDelete
        }
      };

      axios
        .put(
          `fv3/api/manage-forms/sub-stages/${substageId}/?stage_id=${stageId}`,
          body
        )
        .then(res => {
          this.setState(
            state => {
              const data = this.state.subStageData;
              const newArr = data.map(each => {
                if (each.id == res.data.id) {
                  return (each = res.data);
                } else {
                  return each;
                }
              });
              return {
                subStageData: newArr
              };
            },
            () => {
              this.handleSubStageForm();

              successToast("Updated", "successfully");
            }
          );
        })
        .catch(err => {
          errorToast(err);
        });
    } else {
      const body = {
        weight: weight,
        name: substageTitle,
        description: substageDesc,
        order: order,
        xf: commonFormData.xf,
        default_submission_status: commonFormData.status,
        setting: {
          types: commonFormData.typeSelected,
          regions: commonFormData.regionSelected,
          donor_visibility: commonFormData.isDonor,
          can_edit: commonFormData.isEdit,
          can_delete: commonFormData.isDelete
        }
      };

      axios
        .post(`fv3/api/manage-forms/sub-stages/?stage_id=${stageId}`, body)
        .then(res => {
          this.setState(
            {
              subStageData: [...this.state.subStageData, res.data]
            },
            () => {
              this.handleSubStageForm();
              successToast("Created", "successfully");
            }
          );
        })
        .catch(err => {
          errorToast(err);
        });
    }
  };
  onChangeHandler = async e => {
    const {
      activeTab,
      myFormList,
      projectFormList,
      sharedFormList
    } = this.state;
    const searchValue = e.target.value;

    if (searchValue) {
      if (activeTab == "myForms") {
        const filteredData = await myFormList.filter(form => {
          return (
            form.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            form.owner.toLowerCase().includes(searchValue.toLowerCase())
          );
        });

        this.setState({
          myFormList: filteredData
        });
      } else if (activeTab == "projectForms") {
        const awaitedData = await projectFormList.map(project => {
          const filteredData = project.forms.filter(form => {
            return (
              form.title.toLowerCase().includes(searchValue.toLowerCase()) ||
              form.owner.toLowerCase().includes(searchValue.toLowerCase())
            );
          });
          return { ...project, forms: filteredData };
        });
        this.setState({
          projectFormList: awaitedData
        });
      } else if (activeTab == "sharedForms") {
        const filteredData = await sharedFormList.filter(form => {
          return (
            form.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            form.owner.toLowerCase().includes(searchValue.toLowerCase())
          );
        });

        this.setState({
          sharedFormList: filteredData
        });
      }
    } else {
      this.setState({
        myFormList: this.props.myForms,
        sharedFormList: this.props.sharedForms,
        projectFormList: this.props.projectForms
      });
    }
  };

  editSubStageForm = formData => {
    this.setState(
      {
        formId: formData.xf && formData.xf.id,
        formTitle: formData.xf && formData.xf.title,
        weight: formData.weight,
        substageTitle: formData.name,
        substageDesc: formData.description,
        order: formData.order,
        commonFormData: {
          ...this.state.commonFormData,
          status: formData.default_submission_status,
          isDonor: formData.setting && formData.setting.donor_visibility,
          isEdit: formData.setting && formData.setting.can_edit,
          isDelete: formData.setting && formData.setting.can_delete,
          regionSelected: formData.setting && formData.setting.regions,
          typeSelected: formData.setting && formData.setting.types,
          xf: formData.xf && formData.xf.id
        },
        substageId: formData.id
      },
      () => {
        this.handleSubStageForm();
      }
    );
  };
  render() {
    const {
      props: { regionOptions, typeOptions },
      state: {
        data,
        loader,
        subStageData,
        loadSubStage,
        showSubstageForm,
        selectedStage,
        weight,
        formTitle,
        commonFormData,
        showFormModal,
        activeTab,
        myFormList,
        projectFormList,
        sharedFormList,
        substageTitle,
        substageDesc,
        editGuide,
        guideData,
        substageId,
        stageId,
        isStageReorder,
        isStageReorderCancel
      },
      handleRequestSubStage,
      handleSubmitStageForm,
      handleClickEdit,
      handleSubStageForm,
      handleClearState,
      handleInputChange,
      handleRadioChange,
      handleSelectRegionChange,
      handleSelectTypeChange,
      handleMyFormChange,
      handleSaveForm,
      handleCreateForm,
      handleStageReorder,
      handleSaveStageReorder
    } = this;
    return (
      <div className="col-xl-9 col-lg-8">
        <div className="card">
          <div className="card-header main-card-header">
            <h5>Staged Forms</h5>
            <div className="add-btn">
              <a onClick={this.props.commonPopupHandler}>
                Add New
                <span>
                  <i className="la la-plus" />
                </span>
              </a>
              <a onClick={handleStageReorder}>
                {!isStageReorder ? "Reorder" : "Cancel Reorder"}
                {!isStageReorder ? (
                  <span>
                    <i className="la la-reorder" />
                  </span>
                ) : (
                  <span>
                    <i className="la la-close" />
                  </span>
                )}
              </a>
              {isStageReorder && (
                <a onClick={handleSaveStageReorder}>
                  Save Order
                  <span>
                    <i className="la la-save" />
                  </span>
                </a>
              )}
            </div>
          </div>
          {loader && <DotLoader />}
          {!loader && (
            <SortableStage
              stage={data}
              handleRequestSubStage={handleRequestSubStage}
              handleClickEdit={handleClickEdit}
              loadSubStage={loadSubStage}
              subStageData={subStageData}
              handleEditGuide={this.handleEditGuide}
              changeDeployStatus={this.changeDeployStatus}
              deleteItem={this.deleteItem}
              editSubStageForm={this.editSubStageForm}
              handleSubStageForm={handleSubStageForm}
              reorder={isStageReorder}
              isStageReorderCancel={isStageReorderCancel}
              handleNewStageOrder={this.handleNewStageOrder}
            />
          )}
          {this.props.popupModal && (
            <Modal title="Stage Form" toggleModal={this.props.closePopup}>
              <AddStageForm
                regionOptions={regionOptions}
                typeOptions={typeOptions}
                handleSubmit={handleSubmitStageForm}
                stageData={selectedStage}
              />
            </Modal>
          )}
          {showSubstageForm && (
            <Modal title="SubStage Form" toggleModal={handleClearState}>
              <form className="floating-form" onSubmit={this.handleCreateForm}>
                <div className="form-form">
                  <div className="selected-form">
                    <div className="add-btn flex-start">
                      <a data-tab="choose-form" onClick={this.toggleFormModal}>
                        {formTitle ? "Change form" : " Choose form"}
                        <span>
                          <i className="la la-plus"></i>
                        </span>
                      </a>
                    </div>
                    <div className="selected-text">
                      <span>{formTitle}</span>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <InputElement
                    formType="editForm"
                    tag="input"
                    type="number"
                    //   required={true}
                    label="Weight"
                    name="weight"
                    value={weight}
                    changeHandler={handleInputChange}
                  />
                </div>
                <CommonPopupForm
                  regionOptions={regionOptions}
                  typeOptions={typeOptions}
                  handleRadioChange={handleRadioChange}
                  handleSelectRegionChange={handleSelectRegionChange}
                  handleSelectTypeChange={handleSelectTypeChange}
                  commonFormData={commonFormData}
                />
                <div className="form-group">
                  <InputElement
                    formType="editForm"
                    tag="input"
                    type="text"
                    required={true}
                    label="Name"
                    name="substageTitle"
                    value={substageTitle}
                    changeHandler={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <InputElement
                    formType="editForm"
                    tag="input"
                    type="text"
                    //   required={true}
                    label="Description"
                    name="substageDesc"
                    value={substageDesc}
                    changeHandler={handleInputChange}
                  />
                </div>
                <div className="form-group pull-right no-margin">
                  <button type="submit" className="fieldsight-btn">
                    {!!substageId ? "Save" : "Add Form"}
                  </button>
                </div>
              </form>
              {/* </div> */}
            </Modal>
          )}
          {showFormModal && (
            <Modal
              title="Add Form"
              toggleModal={this.toggleFormModal}
              showButton={true}
              showText="Create Form"
              url="/forms/create/"
            >
              <AddForm
                activeTab={activeTab}
                toggleTab={this.toggleTab}
                onChangeHandler={this.onChangeHandler}
                formList={myFormList}
                projectList={projectFormList}
                sharedList={sharedFormList}
                handleRadioChange={this.handleMyFormChange}
                handleSaveForm={this.handleSaveForm}
              />
            </Modal>
          )}
          {editGuide && (
            <Modal title="Form Guide" toggleModal={this.handleEditGuide}>
              <EditFormGuide
                data={guideData}
                handleCancel={this.handleEditGuide}
                handleUpdateGuide={this.handleUpdateGuide}
                handleCreateGuide={this.handleCreateGuide}
              />
            </Modal>
          )}
        </div>
      </div>
    );
  }
}
export default StagedForms;
