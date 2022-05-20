/* eslint-disable prefer-const */
import { Auction,Bid,Event} from '../generated/schema'
import { AuctionBidSuccess, AuctionCreated, AuctionCanceled,AuctionFinalized} from '../generated/SingleAuction/SingleAuction'

export function handleAuctionBidSuccess(event: AuctionBidSuccess): void {
  let auctionID = event.params.auction.collectionId.toHex().concat('-').concat(event.params.auction.tokenId.toString()).concat('-').concat(event.params.auction.auctionId.toString())
  
  let auction = Auction.load(auctionID)
  if (auction != null) {
    let bidId = auctionID.concat('-').concat(event.params._bidIndex.toHexString())
    let bid = new Bid(bidId)
    bid.timestamp = event.block.timestamp
    bid.txhash = event.transaction.hash.toHexString()
    bid.logIndex = event.transactionLogIndex

    bid.collection = auction.collection
    bid.tokenId = auction.tokenId
    bid.auctionId = event.params.auction.auctionId
    bid.from = event.params._from
    bid.tokenAdr = auction.tokenAdr
    bid.bidPrice = event.params.price
    bid.save()

    // register AuctionBidSuccess event
    let eventId = auction.collection.toHex().concat('-').concat(auction.tokenId.toString()).concat('-').concat(event.block.timestamp.toString())

    let eventItem = new Event(eventId)
    eventItem.timestamp = event.block.timestamp	
    eventItem.collection = auction.collection
    eventItem.tokenId = auction.tokenId
    eventItem.action = 'AuctionBidSuccess'
    eventItem.actionAddress = event.params._from
    eventItem.params = auction.tokenAdr.toHex().concat('-').concat(event.params.price.toString())	 	
    eventItem.save()

  }
}

export function handleAuctionCreated(event: AuctionCreated): void {
  let entryId = event.params.auction.collectionId.toHex().concat('-').concat(event.params.auction.tokenId.toString()).concat('-').concat(event.params.auction.auctionId.toString())
  let auction = Auction.load(entryId)
  if (auction == null) {
    auction = new Auction(entryId)
  }
  auction.timestamp = event.block.timestamp
  auction.txhash = event.transaction.hash.toHexString()
  auction.logIndex = event.transactionLogIndex

  auction.collection = event.params.auction.collectionId
  auction.tokenId = event.params.auction.tokenId
  auction.auctionId = event.params.auction.auctionId
  auction.startTime = event.params.auction.startTime
  auction.endTime = event.params.auction.endTime
  auction.tokenAdr = event.params.auction.tokenAdr
  auction.startPrice = event.params.auction.startPrice
  auction.creator = event.params.auction.creator
  auction.owner = event.params.auction.owner  
  auction.active = true
  auction.save()


  // register AuctionCreated event
  let eventId = event.params.auction.collectionId.toHex().concat('-').concat(event.params.auction.tokenId.toString()).concat('-').concat(event.block.timestamp.toString())

  let eventItem = new Event(eventId)
  eventItem.timestamp = event.block.timestamp	
  eventItem.collection = event.params.auction.collectionId
  eventItem.tokenId = event.params.auction.tokenId
  eventItem.action = 'AuctionCreated'
  eventItem.actionAddress = event.params.auction.owner
  eventItem.params = event.params.auction.tokenAdr.toHex().concat('-').concat(event.params.auction.startPrice.toString())	 	
  eventItem.save()
}

export function handleAuctionCanceled(event: AuctionCanceled): void {
  let entryId = event.params.auction.collectionId.toHex().concat('-').concat(event.params.auction.tokenId.toString()).concat('-').concat(event.params.auction.auctionId.toString())
  let auction = Auction.load(entryId)  
  
  if (auction != null) {
    auction.timestamp = event.block.timestamp
    auction.txhash = event.transaction.hash.toHexString()
    auction.logIndex = event.transactionLogIndex

    auction.active = false
    auction.save()

    // register AuctionCanceled event
    let eventId = event.params.auction.collectionId.toHex().concat('-').concat(event.params.auction.tokenId.toString()).concat('-').concat(event.block.timestamp.toString())

    let eventItem = new Event(eventId)
    eventItem.timestamp = event.block.timestamp	
    eventItem.collection = event.params.auction.collectionId
    eventItem.tokenId = event.params.auction.tokenId
    eventItem.action = 'AuctionCanceled'
    eventItem.actionAddress = event.params.auction.owner
    eventItem.params = ''	 	
    eventItem.save()
  }
}

export function handleAuctionFinalized(event: AuctionFinalized): void {
  let entryId = event.params.auction.collectionId.toHex().concat('-').concat(event.params.auction.tokenId.toString()).concat('-').concat(event.params.auction.auctionId.toString())
  let auction = Auction.load(entryId) 
  
  if (auction != null) {
    auction.timestamp = event.block.timestamp
    auction.txhash = event.transaction.hash.toHexString()
    auction.logIndex = event.transactionLogIndex

    auction.active = false
    auction.save()

    // register AuctionFinalized event
    let eventId = event.params.auction.collectionId.toHex().concat('-').concat(event.params.auction.tokenId.toString()).concat('-').concat(event.block.timestamp.toString())

    let eventItem = new Event(eventId)
    eventItem.timestamp = event.block.timestamp	
    eventItem.collection = event.params.auction.collectionId
    eventItem.tokenId = event.params.auction.tokenId
    eventItem.action = 'AuctionFinalized'
    eventItem.actionAddress = event.params.buyer
    eventItem.params = event.params.auction.owner.toHex().concat('-').concat(event.params.auction.tokenAdr.toHex()).concat('-').concat(event.params.price.toString())	 	
    eventItem.save()
  }
}