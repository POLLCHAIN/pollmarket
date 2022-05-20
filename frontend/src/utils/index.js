import axios from 'axios'
import { Contract } from '@ethersproject/contracts'
import TokenABI from '../contracts/Token.json'
import SingleNFTABI from '../contracts/SingleNFT.json'
import SingleFixedABI from '../contracts/SingleFixed.json'
import SingleAuctionABI from '../contracts/SingleAuction.json'

import MultipleNFTABI from '../contracts/MultipleNFT.json'
import MultipleFixedABI from '../contracts/MultipleFixed.json'

export const currentNetwork = process.env.REACT_APP_NETWORK_ID;

export const CONTRACTS_BY_NETWORK = {
  [currentNetwork]: {
    ETH: {
      address: '0x0000000000000000000000000000000000000000',
      abi: TokenABI,
      decimal: 18,
    },
    POLL: {
      address: '0x4b0f027d0b694Aae2761ED2d426295d4f949F5d0',
      abi: TokenABI,
      decimal: 18,
    },
    SingleNFT: {
      address: "0xB5d2B6Da243865dfeA06b6B820Ee9C9Ca74C5288",
      abi: SingleNFTABI,
    },
    SingleFixed: {
      address: "0xc8dd8eaebc6c36f124c946c6a433e5f0ceab14e6",
      abi: SingleFixedABI,
    },
    SingleAuction: {
      address: "0xe91d68c22a09b83ab33bbabed75f4a505b2c6546",
      abi: SingleAuctionABI
    },
    MultipleNFT: {
      address: "0x74792a79E4BBECE975d4162F9a1dFbA00dd216eA",
      abi: MultipleNFTABI,
    },
    MultipleFixed: {
      address: "0x0cf3a5f7c25f1d69838f34b1a0e0700415fdb8ac",
      abi: MultipleFixedABI
    },    
  },  
}

export function getContractInfo(name, chainId = null) {
  if(!chainId) chainId = currentNetwork;

  const contracts = CONTRACTS_BY_NETWORK?.[chainId];  
  if(contracts) {
    return contracts?.[name];
  }else{
    return null;
  }
}

export function getContractObj(name, chainId, provider) {
  const info = getContractInfo(name, chainId);
  return !!info && new Contract(info.address, info.abi, provider);
}

export function getCollectionContract(name, address, chainId, provider) {
  // name : SingleNFT / MultipleNFT
  const info = getContractInfo(name, chainId);
  return !!info && new Contract(address, info.abi, provider);
}

export const shorter = (str) =>
  str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str

export function formatNum(value) {
  let intValue = Math.floor(value)
  if (intValue < 10) {
    return ''+ parseFloat(value).toFixed(2)
  } else if (intValue < 1000){
    return '' + intValue
  } else if (intValue < 1000000) {
    return parseFloat(intValue/1000).toFixed(1) + 'K'
  } else if (intValue < 1000000000) {
    return parseFloat(intValue/1000000).toFixed(1) + 'M'
  } else {
    return parseFloat(intValue/1000000000).toFixed(1) + 'B'
  }
}

export async function getUSDRateFromSymbol(symbol) {
  const res = await axios(`/api/tokens`);
  if (res.data) { 
    const tokens = res.data.tokens;   
    for (var index = 0; index < tokens.length; index++) {
      const token=tokens[index]
      if (token.symbol.toLowerCase() === symbol.toLowerCase()) {
        return Number(token.rate)
      }
    }
    return 0 
  }      
  return 0        
}
export async function getUSDRateFromAddress(address) {
  const res = await axios(`/api/tokens`);
  if (res.data) { 
    const tokens = res.data.tokens;   
    for (var index = 0; index < tokens.length; index++) {
      const token=tokens[index]
      if (token.address === address?.toLowerCase()) {
        return Number(token.rate)
      }
    }
    return 0 
  }      
  return 0  
}