'use strict';

import config from './config';
import { wrapError } from './utils';
import { repairShopClient as client, isReady } from './setup';

export async function getRepairOrders() {
  if (!isReady()) {
    return;
  }
  try {
    const repairOrders = await query( "diseasecenter_compare_claim_gene_ls" );
    return repairOrders;
  } catch (e) {
    throw wrapError(`Error getting repair orders: ${e.message}`, e);
  }
}

export async function getCalculationClaims() {
  if (!isReady()) {
    return;
  }
  try {
    const repairOrders = await query( "calculation_ls" );
    return repairOrders;
  } catch (e) {
    throw wrapError(`Error getting repair orders: ${e.message}`, e);
  }
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

export async function completeRepairOrder(uuid,ll) {
  if (!isReady()) {
    return;
  }
  try {
    ll.unshift(uuid)
    ll.unshift( "diseasecenter_upload_gene" )
    const Result = await invoke.apply(this, ll);
    if (Result) {
      throw new Error(Result);
    }
  } catch (e) {
    throw wrapError(`Error marking repair order as complete: ${e.message}`, e);
  }
}

export async function completeCalculationClaim (uuid) {
  if (!isReady()) {
    return;
  }
  try {
    const successResult = await invoke( "calculation_complete" , uuid );
    return successResult
  } catch (e) {
    throw wrapError(`Error marking repair order as complete: ${e.message}`, e);
  }
}

export function getBlocks(noOfLastBlocks) {
  return client.getBlocks(noOfLastBlocks);
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
