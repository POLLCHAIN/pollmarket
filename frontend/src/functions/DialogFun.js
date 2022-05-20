import { useState } from "react";

const DialogFun = () => {

  const [putSaleDialog, setPutSaleDialog] = useState(false);

  const [buyItemDialog, setBuyItemDialog] = useState(false);
  const [delistItemDialog, setDelistItemDialog] = useState(false);

  const [endAuctionDialog, setEndAuctionDialog] = useState(false);
  const [auctionBidDialog, setAuctionBidDialog] = useState(false);

  const [transferdDialog, setTransferdDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [reportDialog, setReportDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [createCollDialog, setCreateCollDialog] = useState(false);
  const [confCollectionDialog, setConfCollectionDialog] = useState(false);
  const [thanksDialog, setThanksDialog] = useState(false)

  const togglePutSaleDialog = () => {
    setPutSaleDialog(!putSaleDialog);
  };

  const toggleBuyItemDialog = () => {
    setBuyItemDialog(!buyItemDialog);
  };
  const toggleDelistItemDialog = () => {
    setDelistItemDialog(!delistItemDialog);
  };

  const toggleEndAuctionDialog = () => {
    setEndAuctionDialog(!endAuctionDialog);
  };
  const toggleAuctionBidDialog = () => {
    setAuctionBidDialog(!auctionBidDialog);
  };


  const toggleTransferDialog = () => {
    setTransferdDialog(!transferdDialog);
  };

  const toggleShareDialog = () => {
    setShareDialog(!shareDialog);
  };

  const toggleReportDialog = () => {
    setReportDialog(!reportDialog);
  };

  const toggleConfirmDialog = () => {
    setConfirmDialog(!confirmDialog);
  };
 
  const toggleCreateCollDialog = () => {
    setCreateCollDialog(!createCollDialog);
  };
 
  const toggleConfCollDialog = () => {
    setConfCollectionDialog(!confCollectionDialog);
  };
 
  const toggleThanksDialog = () => {
    setThanksDialog(!thanksDialog);
  };

  return { togglePutSaleDialog, putSaleDialog,

    toggleBuyItemDialog, buyItemDialog,
    toggleDelistItemDialog, delistItemDialog,

    toggleEndAuctionDialog, endAuctionDialog,
    toggleAuctionBidDialog, auctionBidDialog,

    toggleTransferDialog, transferdDialog,
    toggleShareDialog, shareDialog, 
    toggleCreateCollDialog, createCollDialog, 
    toggleThanksDialog, thanksDialog, 
    toggleConfCollDialog, confCollectionDialog, 
    toggleConfirmDialog, confirmDialog, 
    toggleReportDialog, reportDialog };
};

export default DialogFun;
