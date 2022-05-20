/* eslint-disable prefer-const */
import { Collection, Pair, Event } from '../generated/schema'
import { SingleCollectionCreated, SingleItemListed, SingleItemDelisted, SingleSwapped } from '../generated/SingleFixed/SingleFixed'
import { SingleNFT as SingleNFTTemplate } from '../generated/templates'
import { constants} from '@amxx/graphprotocol-utils'

export function handleSingleCollectionCreated(event: SingleCollectionCreated): void {
  let entityId = event.params.collection_address.toHex()
  let entity = new Collection(entityId)
  entity.timestamp = event.block.timestamp
  entity.txhash = event.transaction.hash.toHexString()
  entity.logIndex = event.transactionLogIndex

  entity.address = event.params.collection_address
  entity.ownerAddress = event.params.owner
  entity.type = 'single'  		
  entity.name = event.params.name
  entity.uri = event.params.uri
  entity.isPublic = event.params.isPublic

  // create the tracked contract based on the template
  SingleNFTTemplate.create(event.params.collection_address)
  entity.save()
}

export function handleSingleItemListed(event: SingleItemListed): void {
  let entryId = event.params.pair.collection.toHex().concat('-').concat(event.params.pair.tokenId.toString()).concat('-').concat(event.params.pair.pairId.toString())
  
  let pair = Pair.load(entryId)
  if (pair == null) {
    pair = new Pair(entryId)
  }

  pair.timestamp = event.block.timestamp
  pair.txhash = event.transaction.hash.toHexString()
  pair.logIndex = event.transactionLogIndex

  pair.collection = event.params.pair.collection
  pair.tokenId = event.params.pair.tokenId
  pair.pairId = event.params.pair.pairId
  pair.type = 'single'
  pair.creator = event.params.pair.creator
  pair.owner = event.params.pair.owner
  pair.tokenAdr = event.params.pair.tokenAdr
  pair.balance = constants.BIGINT_ONE
  pair.price = event.params.pair.price
  pair.creatorFee = event.params.pair.creatorFee
  pair.bValid = true
  pair.save()


  // register SingleItemListed event
  let eventId = event.params.pair.collection.toHex().concat('-').concat(event.params.pair.tokenId.toString()).concat('-').concat(event.block.timestamp.toString())

  let eventItem = new Event(eventId)
  eventItem.timestamp = event.block.timestamp	
  eventItem.collection = event.params.pair.collection
  eventItem.tokenId = event.params.pair.tokenId
  eventItem.action = 'SingleItemListed'
  eventItem.actionAddress = event.params.pair.owner
  eventItem.params = event.params.pair.tokenAdr.toHex().concat('-').concat(event.params.pair.price.toString())	 	
  eventItem.save()
}

export function handleSingleItemDelisted(event: SingleItemDelisted): void {
  let entryId = event.params.collection.toHex().concat('-').concat(event.params.tokenId.toString()).concat('-').concat(event.params.pairId.toString())
  
  let pair = Pair.load(entryId)  
  if (pair != null) {
    pair.timestamp = event.block.timestamp
    pair.txhash = event.transaction.hash.toHexString()
    pair.logIndex = event.transactionLogIndex

    pair.balance = constants.BIGINT_ZERO
    pair.bValid = false
    pair.save()
  }
}

export function handleSingleSwapped(event: SingleSwapped): void {
  let entryId = event.params.pair.collection.toHex().concat('-').concat(event.params.pair.tokenId.toString()).concat('-').concat(event.params.pair.pairId.toString())
  
  let pair = Pair.load(entryId)
  if (pair == null) {
    pair = new Pair(entryId)
  }

  pair.timestamp = event.block.timestamp
  pair.txhash = event.transaction.hash.toHexString()
  pair.logIndex = event.transactionLogIndex

  pair.collection = event.params.pair.collection
  pair.tokenId = event.params.pair.tokenId
  pair.pairId = event.params.pair.pairId
  pair.type = 'single'
  pair.creator = event.params.pair.creator
  pair.owner = event.params.pair.owner
  pair.tokenAdr = event.params.pair.tokenAdr
  pair.balance = constants.BIGINT_ZERO
  pair.price = event.params.pair.price
  pair.creatorFee = event.params.pair.creatorFee
  pair.bValid = false
  pair.save()


  // register SingleSwapped event
  let eventId = event.params.pair.collection.toHex().concat('-').concat(event.params.pair.tokenId.toString()).concat('-').concat(event.block.timestamp.toString())

  let eventItem = new Event(eventId)
  eventItem.timestamp = event.block.timestamp	
  eventItem.collection = event.params.pair.collection
  eventItem.tokenId = event.params.pair.tokenId
  eventItem.action = 'SingleSwapped'
  eventItem.actionAddress = event.params.buyer
  eventItem.params = event.params.pair.owner.toHex().concat('-').concat(event.params.pair.tokenAdr.toHex()).concat('-').concat(event.params.pair.price.toString())	 	
  eventItem.save()
}
