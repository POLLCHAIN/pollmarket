import { useState } from "react";
import { useHistory } from "react-router-dom";

const CreateDialogFun = () => {
  const history = useHistory();
  const [showDialog, setShowDialog] = useState(false);

  const showCreateDialog = () => {
    setShowDialog(!showDialog);
  };

  const goToSingleItem = () => {
    history.push("/create/single");
  };

  const goToMultipleItem = () => {
    history.push("/create/multiple");
  };

  return { showCreateDialog, showDialog, goToSingleItem, goToMultipleItem };
};

export default CreateDialogFun;
