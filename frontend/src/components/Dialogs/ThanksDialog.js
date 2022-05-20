import React, { useState, useEffect } from "react";
import "./Dialog.css";
import { Modal, Spin } from "antd";

const ThanksDialog = ({ modalVisible, toggleDialog, check }) => {

    const [loading, setLoading] = useState(false)

    const setProgressOn = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }

    useEffect(() => {
        setProgressOn()
    }, [modalVisible])

  return (
    <Modal
      title={loading? "Sending": "Report sent"}
      maskStyle={{background: 'rgba(0, 0, 0, .7)'}}
      style={{ top: 100 }}
      width={window.screen.width > 500 ? "25vw": "90vw"}
      visible={modalVisible}
      onOk={toggleDialog}
      onCancel={toggleDialog}
      footer={[]}
    >
      <div className="purchase-dialog-main">
          {loading ?
          <div className="purchase-dialog-action">
            <Spin size="large" />
            <button className="disabled-btn">In Progress...</button>
          </div>:
        <div className="thanks-dialog">
            <h1>Thanks for reporting</h1>
            <p>We will investigate and make a right decision</p>
            <button onClick={toggleDialog}>Okay</button>
        </div>
        }
      </div>
    </Modal>
  );
};

export default ThanksDialog;
