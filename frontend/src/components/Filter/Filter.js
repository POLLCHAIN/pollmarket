import React from "react";
import { Dropdown, Menu } from "antd";
import "./Filter.css";

const menu = (
  <Menu onClick={() => {}}>
    <h3>Sort by</h3>
    <Menu.Item key="1">Recently added</Menu.Item>
    <Menu.Item key="2">Cheapest</Menu.Item>
    <Menu.Item key="3">Highest price</Menu.Item>
    <Menu.Item key="3">Most liked</Menu.Item>
    <Menu.Item key="3">Verified only</Menu.Item>
  </Menu>
);

const Filter = () => {
  return (
    <div className="main-filter">
      <Dropdown
        onClick={() => {}}
        overlay={menu}
        trigger={["click"]}
        placement="bottomCenter"
      >
        <button>Filter & Sort</button>
      </Dropdown>
    </div>
  );
};

export default Filter;
