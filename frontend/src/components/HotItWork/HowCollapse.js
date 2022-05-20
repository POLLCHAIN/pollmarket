import React from "react";
import { Collapse } from "antd";

const { Panel } = Collapse;

const HowCollapse = ({ items, headline }) => {
  return (
    <div>
      <h2>{headline}</h2>
      <Collapse defaultActiveKey={["1"]} onChange={() => {}}>
        {items.map((item, index) => (
          <Panel header={item.title} key={index + 1}>
            <p>{item.text}</p>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default HowCollapse;
