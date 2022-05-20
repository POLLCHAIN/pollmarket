/* eslint-disable prefer-const */
import { Collection, Pair, Event} from '../generated/schema'
import { MultiCollectionCreated, MultiItemListed, MultiItemDelisted, MultiItemSwapped} from '../generated/MultipleFixed/MultipleFixed'
import { MultipleNFT as MultipleNFTTemplate } from '../generated/templates'
import { constants} from '@amxx/graphprotocol-utils'

export function handleMultiCollectionCreated(event: MultiCollectionCreated): void {
  let entityId = event.params.collection_address.toHex()
  let entity = new Collection(entityId)
  entity.timestamp = event.block.timestamp
  entity.txhash = event.transaction.hash.toHexString()
  entity.logIndex = event.transactionLogIndex

  entity.address = event.params.collection_address
  entity.ownerAddress = event.params.owner
  entity.type = 'multi'
  entity.name = event.params.name
  entity.uri = event.params.uri
  entity.isPublic = event.params.isPublic

  // create the tracked contract based on the template
  MultipleNFTTemplate.create(event.params.collection_address)
  
  entity.save()
}

export function handleMultiItemListed(event: MultiItemListed): void {
  let entityID = event.params.item.collection.toHex().concat('-').concat(event.params.item.tokenId.toString()).concat('-').concat(event.params.item.pairId.toString())
  let pair = Pair.load(entityID)
	if (pair == null) {
		pair = new Pair(entityID)
	}

  pair.timestamp = event.block.timestamp
  pair.txhash = event.transaction.hash.toHexString()
  pair.logIndex = event.transactionLogIndex

  pair.collection = event.params.item.collection
  pair.tokenId = event.params.item.tokenId
  pair.pairId = event.params.item.pairId
  pair.type = 'multi'
  pair.creator = event.params.item.creator
  pair.owner = event.params.item.owner
  pair.tokenAdr = event.params.item.tokenAdr
  pair.balance = event.params.item.balance
  pair.price = event.params.item.price
  pair.creatorFee = event.params.item.creatorFee
  pair.bValid = true  
  pair.save()

  // register MultiItemListed event
  let eventId = event.params.item.collection.toHex().concat('-').concat(event.params.item.tokenId.toString()).concat('-').concat(event.block.timestamp.toString())

  let eventItem = new Event(eventId)
  eventItem.timestamp = event.block.timestamp	
  eventItem.collection = event.params.item.collection
  eventItem.tokenId = event.params.item.tokenId
  eventItem.action = 'MultiItemListed'
  eventItem.actionAddress = event.params.item.owner
  eventItem.params = event.params.item.balance.toString().concat('-').concat(event.params.item.tokenAdr.toHex()).concat('-').concat(event.params.item.price.toString())	 	
  eventItem.save()

}

export function handleMultiItemDelisted(event: MultiItemDelisted): void {
  let entityID = event.params.collection.toHex().concat('-').concat(event.params.tokenId.toString()).concat('-').concat(event.params.pairId.toString())
  let pair = Pair.load(entityID)
	
	if (pair != null) {
		pair.timestamp = event.block.timestamp
    pair.txhash = event.transaction.hash.toHexString()
    pair.logIndex = event.transactionLogIndex
    
    pair.balance = constants.BIGINT_ZERO
    pair.bValid = false
    pair.save()
	}  
}

export function handleMultiItemSwapped(event: MultiItemSwapped): void {
  let entityID = event.params.item.collection.toHex().concat('-').concat(event.params.item.tokenId.toString()).concat('-').concat(event.params.item.pairId.toString())
  let pair = Pair.load(entityID)
	if (pair == null) {
		pair = new Pair(entityID)
	}

  pair.timestamp = event.block.timestamp
  pair.txhash = event.transaction.hash.toHexString()
  pair.logIndex = event.transactionLogIndex

  pair.collection = event.params.item.collection
  pair.tokenId = event.params.item.tokenId
  pair.pairId = event.params.item.pairId
  pair.type = 'multi'
  pair.creator = event.params.item.creator
  pair.owner = event.params.item.owner
  pair.tokenAdr = event.params.item.tokenAdr
  pair.balance = event.params.item.balance
  pair.price = event.params.item.price
  pair.creatorFee = event.params.item.creatorFee
  pair.bValid = event.params.item.bValid

  pair.save()


  // register MultiItemSwapped event
  let eventId = event.params.item.collection.toHex().concat('-').concat(event.params.item.tokenId.toString()).concat('-').concat(event.block.timestamp.toString())

  let eventItem = new Event(eventId)
  eventItem.timestamp = event.block.timestamp	
  eventItem.collection = event.params.item.collection
  eventItem.tokenId = event.params.item.tokenId
  eventItem.action = 'MultiItemSwapped'
  eventItem.actionAddress = event.params.buyer
  eventItem.params = event.params.item.owner.toHex().concat('-').concat(event.params.amount.toString()).concat('-').concat(event.params.item.tokenAdr.toHex()).concat('-').concat(event.params.item.price.toString())	 	
  eventItem.save()
}
