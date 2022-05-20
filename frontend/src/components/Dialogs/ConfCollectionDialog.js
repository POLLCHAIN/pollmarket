import React, { useState, useEffect } from "react";
import "./Dialog.css";
import { Modal, Spin } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const ConfCollectionDialog = ({ modalVisible, toggleDialog }) => {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const setProgressOn = () => {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
      setLoading2(true);
      setTimeout(() => {
        setLoading2(false);     
      }, 3000);
    }, 3000);
  };

  useEffect(() => {
    setProgressOn();
}, [modalVisible]);

  return (
    <Modal
      title="Follow steps"
      maskStyle={{ background: "rgba(0, 0, 0, .7)" }}
      style={{ top: 100 }}
      width={window.screen.width > 500 ? "25vw": "90vw"}
      visible={modalVisible}
      onOk={toggleDialog}
      onCancel={toggleDialog}
      footer={[]}
    >
      <div className="confirm-create-dialog">
        <div className="confirm-item">
          <div className="confirm-flex-item">
            <div>{loading1 ? <Spin /> : <CheckOutlined />}</div>
            <div className="confirm-info">
              <h2>Deploy Contract</h2>
              <p>Deploy code for the new collection smart contract</p>
            </div>
          </div>
          <div>
            {loading1 ? (
              <button className="in-progress-btn">In progress...</button>
            ) : (
              <button className="done-btn">Done</button>
            )}
          </div>
        </div>
        <div className="confirm-item">
          <div className="confirm-flex-item">
            <div>{loading2 ? <Spin /> : <CheckOutlined />}</div>
            <div className="confirm-info">
              <h2>Sign message</h2>
              <p>Sign message with new collection preferences</p>
            </div>
          </div>
          <div>
            {loading2 ? (
              <button onClick={setProgressOn} className="in-progress-btn">
                In progress...
              </button>
            ) : (
              <button className="done-btn">Done</button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfCollectionDialog;
