'use strict';

import fetch from 'isomorphic-fetch';

export function getRepairOrders() {
  return fetch('/calculation-center/api/repair-orders', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(async res => {
    return await res.json();
  });
}

export function completeRepairOrder(uuid) {
  return fetch('/calculation-center/api/complete-repair-order', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ uuid })
  }).then(async res => {
    return await res.json();
  });
}
