'use strict';

import fetch from 'isomorphic-fetch';

export function getAllFiles() {
  return fetch('/shop/api/all-files', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(async res => {
    return await res.json();
  });
}

export function requestFile(fileId) {
  return fetch('/shop/api/request-file', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({fileId})
  }).then(async res => {
    return await res.json();
  });
}
