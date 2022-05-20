import React from "react";
import "./Dialog.css";
import { Modal } from "antd";

const WalletDialog = ({ modalVisible, toggleDialog }) => {
  return (
    <Modal
      title={"What is Wallet?"}
      maskStyle={{ background: "rgba(0, 0, 0, .7)" }}
      style={{ top: 100 }}
      width={window.screen.width > 500 ? "25vw" : "90vw"}
      visible={modalVisible}
      onOk={toggleDialog}
      onCancel={toggleDialog}
      footer={[]}
    >
      <div className="purchase-dialog-main">
        <div className="thanks-dialog">
          <p>
            Wallets are used to send, receive, and store digital assets like
            Ether. Wallets come in many forms. They are either built into your
            browser, an extension added to your browser, a piece of hardware
            plugged into your computer or even an app on your phone
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default WalletDialog;
