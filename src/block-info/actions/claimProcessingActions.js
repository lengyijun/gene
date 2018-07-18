'use strict';

import * as Api from '../api';
import * as ClaimProcessingActionType from './claimProcessingActionTypes';

export function loadBlocks() {
  return async dispatch => {
    let claims;
    try {
      claims = await Api.getBlocksFromContractManagement(20); // Load only (N)ew (unprocessed) claims
      console.log("============claims==========")
      console.log(claims)
    } catch (e) {
      console.log(e);
    }
    if (Array.isArray(claims)) {
      dispatch(loadClaimsSuccess(claims));
    }
  };
}

function loadClaimsSuccess(claims) {
  return {
    type: ClaimProcessingActionType.LOAD_CLAIMS_SUCCESS,
    claims
  };
}

