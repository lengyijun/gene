'use strict';

import config from './config';
import { wrapError } from './utils';
import { repairShopClient as client, isReady } from './setup';
import CryptoJS from 'crypto-js'

export async function getAllFiles() {
  if (!isReady()) {
    return;
  }
  try {
    const repairOrders = await query( "listFile" );
    return repairOrders;
  } catch (e) {
    throw wrapError(`Error getting all files: ${e.message}`, e);
  }
}

export async function requestFile(fileId,owner) {
  if (!isReady()) {
    return;
  }
  try {
    const ReqId = Math.random().toString(36).substring(7)
    var args = ['requestFile', ReqId, fileId, owner, "publicKey", "tokentokentoken"]
    const Result = await invoke.apply(this, args);
    console.log(Result)
    return Result
  } catch (e) {
    throw wrapError(`Error marking repair order as complete: ${e.message}`, e);
  }
}

export function getBlocks(noOfLastBlocks) {
  return client.getBlocks(noOfLastBlocks);
}

export async function getBlockById(id){
  if (!isReady()) {
    return;
  }
  try{
    const blockinfo=await getblockbyid(id)
    return blockinfo
  }catch (e){
    throw wrapError(`Error getting Block By Id: ${e.message}`, e);
  }

}

export const on = client.on.bind(client);
export const once = client.once.bind(client);
export const addListener = client.addListener.bind(client);
export const prependListener = client.prependListener.bind(client);
export const removeListener = client.removeListener.bind(client);

function invoke(fcn, ...args) {
  return client.invoke(
    config.chaincodeId, config.chaincodeVersion, fcn, ...args);
}

function query(fcn, ...args) {
  return client.query(
    config.chaincodeId, config.chaincodeVersion, fcn, ...args);
}

function getblockbyid(id){
  return client.getBlockInfoFromBlockId(id)
}
