'use strict';

import * as ClaimProcessingActionType from '../actions/claimProcessingActionTypes';
import * as initialState from './initialState';

export default function claimProcessingReducer(state = initialState.claimProcessing, action) {
  switch (action.type) {
    case ClaimProcessingActionType.LOAD_CLAIMS_SUCCESS:
      return Object.assign({}, state, {
        blocks: [...action.claims]
      });
    default:
      return state;
  }
}
