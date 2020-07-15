import apiURl from './api';

export const createCookie = (cookieName, cookieValue, hourToExpire) => {
  const date = new Date();
  date.setTime(date.getTime() + hourToExpire * 60 * 60 * 1000);
  document.cookie = `${cookieName} = ${cookieValue}; expires = ${date.toGMTString()}`;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

function combineAddress(addr) {
  return `${apiURl}${addr}`;
}

export const apiAuthorize = async (address) => {
  const res = await fetch(combineAddress(address), {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      Authorization: document.cookie,
    },
  }).then((result) => result.json());
  return res;
};

export const apiPost = async (address, object) => {
  const res = await fetch(combineAddress(address), {
    method: 'POST',
    body: JSON.stringify(object),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((result) => result.json());
  console.log(res);
  return res;
};

export const apiGet = async (address) => {
  const res = await fetch(combineAddress(address), {
    method: 'GET',
    // credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((result) => result.json());
  console.log(res);
  return res;
};
