let Item = require("./models/item.model");

function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() *
 charactersLength)));
   }
   return result.join('');
}

function makeItem(tokenId, groupAddress, creatorAddress, ownerAddress, itemCollection, itemCollectionName, name, desc, metadata, supply, creatorFee, image){
  console.log(creatorAddress)
  const item = new Item({
    tokenId: tokenId,
    groupAddress: groupAddress,
    creatorAddress: creatorAddress,
    itemCollection: itemCollection,
    itemCollectionName: itemCollectionName,
    name: name,
    description: desc,
    metadata: metadata,
    supply: supply,
    maxSupply: supply,
    creatorFee: creatorFee,
  })
  item.holders.push({address: ownerAddress, balance: supply});
  if (image){
    item.image = image
  }

  return item
}


module.exports = {makeid, makeItem};
