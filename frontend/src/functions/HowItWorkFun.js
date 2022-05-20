const HowItWorkFun = () => {
  const items = {
    Marketplace: [
      {
        title: "NFT? ERC-721 tokens?",
        text:
          "NFT stands for non-fungible tokens like ERC-721 (a smart contract standard) tokens which are hosted on Ethereum’s own blockchain. NFTs are unique digital items such as collectibles or artworks or game items. As an artist, by tokenizing your work you both ensure that it is unique and brand it as your work. The actual ownership is blockchain-managed. If you want to go in-depth into NFTs, I suggest this read: [https://opensea.io/blog/guides/non-fungible-tokens/](https://opensea.io/blog/guides/non-fungible-tokens/)",
      },
      {
        title: "What does “minting” mean?",
        text:
          "The process of tokenizing your work and creating an NFT (see above).",
      },
      {
        title: "Can I create an NFT without putting it on sale?",
        text:
          "Yes, you can and it is up to you if you decide to sell it later or not.",
      },
      {
        title: "Can I gift or send a collectible to someone?",
        text:
          "Yes, just go on the detail page of a collectible you own, open the “...” menu and select “transfer token”",
      },      
    ],
    Governance: [
      {
        title: "What is the purpose of POLL as a governance",
        text: "POLL Will be the native governance token of the NFT platform"
      }
    ]
  };

  return { items };
};

export default HowItWorkFun;
