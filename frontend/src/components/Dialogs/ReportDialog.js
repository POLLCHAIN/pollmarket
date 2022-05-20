import React from "react";
import "./Dialog.css";
import { Modal } from "antd";

const ReportDialog = ({ modalVisible, toggleDialog, toggleThanksDialog }) => {

  const toggleBoth = () => {
    toggleDialog()
    toggleThanksDialog();
  }

  return (
    <Modal
      title="Why are you reporting?"
      maskStyle={{ background: "rgba(0, 0, 0, .7)" }}
      style={{ top: 200 }}
      width={window.screen.width > 500 ? "25vw": "90vw"}
      visible={modalVisible}
      onOk={toggleDialog}
      onCancel={toggleDialog}
      footer={[]}
    >
      <div className="report-dialog">
        <p>
          Describe why you think this item should be removed from marketplace
        </p>
        <h3>Message</h3>
        <div className="purchase-dialog-item">
          <input placeholder="Tell us some details" />
        </div>
        <div className="purchase-dialog-action">
          <button onClick={toggleBoth} className="proceed-btn">
            Report
          </button>
          <button onClick={toggleDialog}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportDialog;
