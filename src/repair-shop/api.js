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
  //todo ShopOrgMsp
  return fetch("http://129.28.54.225:8000/rsa/?requesttype=&name=" + "ShopOrgMSP", {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
  }).then(async res => {
    var json = await res.json()
    var publicKey = json.publicKey

    return fetch('/shop/api/request-file', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({fileId, publicKey})
    }).then(async res => {
      return await res.json();
    });
  })
}

export function saveFile(fileId, symKey, fileName) {
  return fetch('/shop/api/save-file', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({fileId, symKey, fileName})
  })
}
