'use strict';

import fetch from 'isomorphic-fetch';

export function getContractTypes(shopType) {
  return fetch('/shop/api/contract-types', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ shopType })
  }).then(async res => {
    let contractTypes = (await res.json())
      .map(c => Object.assign({}, c, {
        formulaPerDay: new Function('price', 'return ' + preventXssForFormula(c.formulaPerDay))
      }));
    return contractTypes;
  });
}

export function requestNewUser(user) {
  return fetch('/shop/api/request-user', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ user })
  }).then(async res => {
    return await res.json();
  });
}

export function enterContract(user, contractTypeUuid, additionalInfo) {
  return fetch('/shop/api/enter-contract', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ user, contractTypeUuid, additionalInfo })
  }).then(async res => {
    const response = await res.json();
    if (response.success) {
      return response.loginInfo;
    } else {
      throw new Error(response.error);
    }
  });
}

/**
 * Function parses formula, to prevent cross site scripting attacks.
 *
 * @param {string} formula The formula as a string.
 * @returns {string} A parsed and filtered fomula as a string.
 */
function preventXssForFormula(formula) {
  if (typeof formula !== 'string') {
    return null;
  }
  let lexemes = formulaLexer(formula).filter(l =>
    (l === '(' ||
      l === ')' ||
      l === '+' ||
      l === '-' ||
      l === '*' ||
      l === '/' ||
      l === 'price' ||
      Number(l)));
  return lexemes.join(' ');
}

function formulaLexer(formula) {
  let lexemes = formula;
  lexemes = splitFormulaPart(lexemes, /( )/);
  lexemes = splitFormulaPart(lexemes, /(\()/);
  lexemes = splitFormulaPart(lexemes, /(\))/);
  lexemes = splitFormulaPart(lexemes, /(\+)/);
  lexemes = splitFormulaPart(lexemes, /(\-)/);
  lexemes = splitFormulaPart(lexemes, /(\*)/);
  lexemes = splitFormulaPart(lexemes, /(\/)/);
  lexemes = splitFormulaPart(lexemes, /([0-9]+\.[0-9]+|[0-9]+)/);
  lexemes = splitFormulaPart(lexemes, /([A-Za-z]+)/);
  return lexemes;
}

function splitFormulaPart(part, splitQualifier) {
  if (Array.isArray(part)) {
    let results = [];
    part.forEach(e => results.push(...splitFormulaPart(e, splitQualifier)));
    return results;
  } else if (typeof part === 'string') {
    return part.split(splitQualifier).filter(p => !!p.trim());
  } else {
    return null;
  }
}

export function uploadFileIndex(filename, description, level, fileContent) {
  console.log("real filecotent")
  console.log(fileContent)

  return fetch("http://129.28.54.225:8000/upload/", {
    method: 'POST',
    // mode: 'no-cors',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({data: fileContent})
  }).then(async res => {
    var json = await res.json()
    var fileId = json.fileId
    return fetch('/shop/api/uploadFile', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({filename, description, level, fileId})
    })
      .then(async res => await res.json())
      .then(async res => {
        console.log(res)
        if (res.success) {
          return res.loginInfo;
        } else {
          throw new Error(res.error);
        }
      })
  })

}

