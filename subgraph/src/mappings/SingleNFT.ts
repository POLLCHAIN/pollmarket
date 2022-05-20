/* eslint-disable prefer-const */
import { Item, Balance, Collection, Event} from '../generated/schema'
import { ItemCreated, CollectionUriUpdated, CollectionNameUpdated, CollectionPublicUpdated, TokenUriUpdated, Transfer, Burned } from '../generated/templates/SingleNFT/SingleNFT'
import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { constants, integers} from '@amxx/graphprotocol-utils'

function fetchBalance(collection: Bytes, tokenId: BigInt, account: Bytes): Balance {
	let balanceid = collection.toHex().concat('-').concat(tokenId.toString()).concat('-').concat(account.toHex())
	let balance = Balance.load(balanceid)
	if (balance == null) {
		balance = new Balance(balanceid)
		balance.timestamp = constants.BIGINT_ZERO
		balance.collection = collection
		balance.tokenId   = tokenId
		balance.account = account
		balance.value   = constants.BIGINT_ZERO		
	}
	return balance as Balance
}

function fetchTransfer(timestamp: BigInt, collection: Bytes, from: Bytes, to: Bytes, tokenId: BigInt, value: BigInt): void {	
	if (from.toHex() == constants.ADDRESS_ZERO) {
		// mint		
	} else {
		// transfer
		let balance = fetchBalance(collection, tokenId, from)
		balance.value = integers.decrement(balance.value, value)
		balance.timestamp = timestamp	
		balance.save()		
	}

	if (to.toHex() == constants.ADDRESS_ZERO) {
		// burn	
	} else {
		// transfer
		let balance = fetchBalance(collection, tokenId, to)
		balance.value = integers.increment(balance.value, value)
		balance.timestamp = timestamp
		balance.save()
	}

	if ((from.toHex() != constants.ADDRESS_ZERO)&&(to.toHex() != constants.ADDRESS_ZERO)) {
		// register transfer event
		let eventId = collection.toHex().concat('-').concat(tokenId.toString()).concat('-').concat(timestamp.toString())

		let eventItem = new Event(eventId)
		eventItem.timestamp = timestamp	
		eventItem.collection = collection
		eventItem.tokenId = tokenId
		eventItem.action = 'SingleTransfer'
		eventItem.actionAddress = from
		eventItem.params = to.toHex()		
		eventItem.save()
	}
}

export function handleTransfer(event: Transfer): void
{
	let collection = Collection.load(event.address.toHex())
	if (collection != null) {
		let from     = event.params.from
		let to       = event.params.to	
		fetchTransfer(	
			event.block.timestamp,		
			event.address,
			from,
			to,
			event.params.tokenId,
			constants.BIGINT_ONE
		)
	}	
}

export function handleBurned(event: Burned): void
{
	let collection = Collection.load(event.address.toHex())
	if (collection != null) {
		let itemId = event.address.toHex().concat('-').concat(event.params.nftID.toString())
		let item = Item.load(itemId)
		if (item != null) {
			item.supply = constants.BIGINT_ZERO
			item.save()		
			// register burn event
			let eventId = event.address.toHex().concat('-').concat(event.params.nftID.toString()).concat('-').concat(event.block.timestamp.toString())

			let eventItem = new Event(eventId)
			eventItem.timestamp = event.block.timestamp	
			eventItem.collection = event.address
			eventItem.tokenId = event.params.nftID
			eventItem.action = 'SingleBurn'
			eventItem.actionAddress = event.params.owner
			eventItem.params = ''	
			eventItem.save()
		}	
	}	
}


export function handleCollectionUriUpdated(event: CollectionUriUpdated): void {  
	let collection = Collection.load(event.address.toHex())
	if (collection != null) {
		// update collection uri
		collection.timestamp = event.block.timestamp
		collection.uri = event.params.collection_uri		
		collection.save()
	}
}

export function handleCollectionNameUpdated(event: CollectionNameUpdated): void {  
	let collection = Collection.load(event.address.toHex())
	if (collection != null) {
		// update collection name
		collection.timestamp = event.block.timestamp
		collection.name = event.params.collection_name		
		collection.save()
	}
}

export function handleCollectionPublicUpdated(event: CollectionPublicUpdated): void {  
	let collection = Collection.load(event.address.toHex())
	if (collection != null) {
		// update collection isPublic
		collection.timestamp = event.block.timestamp
		collection.isPublic = event.params.isPublic		
		collection.save()
	}
}

export function handleTokenUriUpdated(event: TokenUriUpdated): void {  
	let collection = Collection.load(event.address.toHex())
	if (collection != null) {
		// update item uri
		let entityId = event.address.toHex().concat('-').concat(event.params.id.toString())
		let item = Item.load(entityId)
		if (item != null) {
			item.timestamp = event.block.timestamp
			item.uri = event.params.uri		
			item.save()
		}
	}
}

export function handleItemCreated(event: ItemCreated): void {
	let collection = Collection.load(event.address.toHex())
	if (collection != null) {
		// create Item entity
		let entityId = event.address.toHex().concat('-').concat(event.params.id.toString())
		let entity = new Item(entityId)
		entity.timestamp = event.block.timestamp
		entity.txhash = event.transaction.hash.toHexString()
		entity.logIndex = event.transactionLogIndex

		entity.collection = event.address
		entity.tokenId = event.params.id
		entity.type = 'single'  
		entity.creator = event.params.creator
		entity.uri = event.params.uri
		entity.supply = constants.BIGINT_ONE
		entity.royalty = event.params.royalty
		entity.save()		

		// register MultiItemCreated event
		let eventId = event.address.toHex().concat('-').concat(event.params.id.toString()).concat('-').concat(event.block.timestamp.toString())

		let eventItem = new Event(eventId)
		eventItem.timestamp = event.block.timestamp	
		eventItem.collection = event.address
		eventItem.tokenId = event.params.id
		eventItem.action = 'SingleItemCreated'
		eventItem.actionAddress = event.params.creator
		eventItem.params = ''		
		eventItem.save()
	}
}
