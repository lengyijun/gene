'use strict';

import config from './config';
import { wrapError } from './utils';
import { repairShopClient as client, isReady } from './setup';

export async function getRepairOrders() {
  if (!isReady()) {
    return;
  }
  try {
    const repairOrders = await query('repair_order_ls');
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

export async function completeRepairOrder(uuid) {
  if (!isReady()) {
    return;
  }
  try {
    const successResult = await invoke(`repair_order_complete`, { uuid });
    if (successResult) {
      throw new Error(successResult);
    }
  } catch (e) {
    throw wrapError(`Error marking repair order as complete: ${e.message}`, e);
  }
}

export async function uploadGene(gene_list) {
  if (!isReady()) {
    return;
  }
  try {
    const repairOrders = await invoke(`upload_gene`,{"Allgene":gene_list});
    console.log(repairOrders)
    return repairOrders;
  } catch (e) {
    throw wrapError(`Error upload gene: ${e.message}`, e);
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
