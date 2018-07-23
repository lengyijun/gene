'use strict';

import fetch from 'isomorphic-fetch';

export function getRepairOrders() {
  return fetch('/medical-center/api/repair-orders', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(async res => {
    return await res.json();
  });
}

export function completeRepairOrder(uuid,ll) {
  return fetch('/medical-center/api/complete-repair-order', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ uuid,ll })
  }).then(async res => {
    return await res.json();
  });
}
