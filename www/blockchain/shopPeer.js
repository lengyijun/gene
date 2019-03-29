'use strict';

import config from './config';
import { wrapError } from './utils';
import { shopClient as client, isReady } from './setup';
import uuidV4 from 'uuid/v4';
import CryptoJS from 'crypto-js'

export async function getContractTypes(shopType) {
  if (!isReady()) {
    return;
  }
  try {
    return await query('contract_type_ls', { shopType });
  } catch (e) {
    throw wrapError(
      `Error getting contract types for shop type ${shopType} : ${e.message}`
      , e);
  }
}

export async function createContract(contract) {
  if (!isReady()) {
    return;
  }
  try {
    let c = Object.assign({}, contract, { uuid: uuidV4() });
    const loginInfo = await invoke('contract_create', c);
    if (!loginInfo
      ^ !!(loginInfo && loginInfo.username && loginInfo.password)) {
      return Object.assign(loginInfo || {}, { uuid: c.uuid });
    } else {
      throw new Error(loginInfo);
    }
  } catch (e) {
    throw wrapError(`Error creating contract: ${e.message}`, e);
  }
}

export async function createUser(user) {
  if (!isReady()) {
    return;
  }
  try {
    const loginInfo = await invoke('user_create', user);
    if (!loginInfo ^
      !!(loginInfo && loginInfo.username && loginInfo.password)) {
      return loginInfo;
    } else {
      throw new Error(loginInfo);
    }
  } catch (e) {
    throw wrapError(`Error creating user: ${e.message}`, e);
  }
}

export async function authenticateUser(username, password) {
  if (!isReady()) {
    return;
  }
  try {
    let authenticated =
      await query('user_authenticate', { username, password });
    if (authenticated === undefined || authenticated === null) {
      throw new Error('Unknown error, invalid response!');
    }
    return authenticated;
  } catch (e) {
    throw wrapError(`Error authenticating user: ${e.message}`, e);
  }
}

export async function uploadFile(filename, description, level) {
  if (!isReady()) {
    return;
  }
  try {
    const UUID = Math.random().toString(36).substring(7);
    var parameter = ['uploadFile', UUID, filename, description, level]
    const user = await invoke.apply(this,parameter);
    console.log(user)
    return user;
  } catch (e) {
    throw wrapError(`Error getting user info: ${e.message}`, e);
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


export async function getMyRequest() {
  if (!isReady()) {
    return;
  }
  try {
    const repairOrders = await query( "listRequest" );
    console.log(repairOrders)
    return repairOrders;
  } catch (e) {
    throw wrapError(`Error getting repair orders: ${e.message}`, e);
  }
}

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

export async function getResponse() {
  // if (!isReady()) {
  //   return;
  // }
  try {
    // if (typeof status !== 'string') {
    //   status = undefined;
    // }
    const claims = await query('listResponse' );  //no args need
    return claims;
  } catch (e) {
    let errMessage;
    if (status) {
      errMessage = `Error getting response with status ${status}: ${e.message}`;
    } else {
      errMessage = `Error getting all response: ${e.message}`;
    }
    throw wrapError(errMessage, e);
  }
}

function invoke(fcn, ...args) {
  return client.invoke(
    config.chaincodeId, config.chaincodeVersion, fcn, ...args);
}

function query(fcn, ...args) {
  return client.query(
    config.chaincodeId, config.chaincodeVersion, fcn, ...args);
}
