import { useState } from "react";

const MobileDrawerFun = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  const showMobileDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  return { showMobileDrawer, showDrawer };
};

export default MobileDrawerFun;
