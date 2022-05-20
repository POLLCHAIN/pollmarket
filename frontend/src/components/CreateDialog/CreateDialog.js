import React from "react";
import { Modal } from "antd";
import "./CreateDialog.css";
import SingleIcon from "../../assets/svg/single_card.svg";
import MultipleIcon from "../../assets/svg/multiple_card.svg";
import CreateDialogFun from "../../functions/CreateDialogFun";

const CreateDialog = ({ modalVisible, showCreateDialog }) => {

    const { goToSingleItem, goToMultipleItem } = CreateDialogFun();

    const goToSingle = () => {
      showCreateDialog();
      goToSingleItem();
    }
    const goToMultiple = () => {
      showCreateDialog();
      goToMultipleItem();
    }

  return (
    <div>
      <Modal
        title="Create Collection"
        style={{ top: 50 }}
        visible={modalVisible}
        onOk={showCreateDialog}
        onCancel={showCreateDialog}
        footer={[]}
      >
        <div className="create-dialog">
          <h3>
            Choose “Single” if you want your collectible to be one of a kind or
            “Multiple” if you want to sell one collectible multiple times
          </h3>
          <div className="create-dialog-container">
            <div onClick={goToSingle} className="create-dialog-image">
              <img src={SingleIcon} alt="single collection preview" />
              <h3>Single Collection</h3>
            </div>
            <div onClick={goToMultiple} className="create-dialog-image">
              <img src={MultipleIcon} alt="single collection preview" />
              <h3>Multiple Collections</h3>
            </div>
          </div>
          <h3>
            We do not own your private keys and cannot access your funds without
            your confirmation
          </h3>
        </div>
      </Modal>
    </div>
  );
};

export default CreateDialog;
