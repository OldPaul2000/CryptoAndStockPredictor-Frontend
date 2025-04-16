import { getCsrf } from "../../cache/CsrfCache";
import { myHeaders } from "../../cache/MyHeaders";
import { API_ADDRESS, API_PORT } from "../../constants/ApiAddress";

const AVAILABLE_CURRENCIES = [
  "amazon",
  "amd",
  "apple",
  "microsoft",
  "netflix",
  "starbucks",
  "tesla",
];

export const getCurrency = async function (currency, start, resultsPerPage) {
  if (AVAILABLE_CURRENCIES.includes(currency)) {
    try {
      const resp = await fetch(
        `http://${API_ADDRESS}:${API_PORT}/api/v1/stocks/${currency}?start=${start}&resultsPerPage=${resultsPerPage}`,
        {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: myHeaders,
        }
      );
      const jsonResp = await resp.json();
      if (resp.status !== 200) {
        return { status: jsonResp.status, message: jsonResp.message };
      }
      return jsonResp;
    } catch (err) {}
  }
  return "Currency doesn't exist";
};

export const addCurrency = async function (currency, record) {
  if (AVAILABLE_CURRENCIES.includes(currency)) {
    await getCsrf();
    try {
      const resp = await fetch(
        `http://${API_ADDRESS}:${API_PORT}/api/v1/stocks/${currency}`,
        {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: myHeaders,
          body: JSON.stringify(record),
        }
      );
      if (!resp.ok) {
        const jsonResp = await resp.json();
        return { status: jsonResp.status, message: jsonResp.message };
      }
      return await resp.text();
    } catch (err) {}
  }
  return "Currency doesn't exist";
};

export const updateCurrency = async function (currency, id, record) {
  if (AVAILABLE_CURRENCIES.includes(currency)) {
    await getCsrf();
    try {
      const resp = await fetch(
        `http://${API_ADDRESS}:${API_PORT}/api/v1/stocks/${currency}/${id}`,
        {
          method: "PUT",
          mode: "cors",
          credentials: "include",
          headers: myHeaders,
          body: JSON.stringify(record),
        }
      );
      if (!resp.ok) {
        const jsonResp = await resp.json();
        return { status: jsonResp.status, message: jsonResp.message };
      }
      return resp.text();
    } catch (err) {}
  }
  return "Currency doesn't exist";
};

export const deleteCurrency = async function (currency, id) {
  if (AVAILABLE_CURRENCIES.includes(currency)) {
    await getCsrf();
    try {
      const resp = await fetch(
        `http://${API_ADDRESS}:${API_PORT}/api/v1/stocks/${currency}/${id}`,
        {
          method: "DELETE",
          mode: "cors",
          credentials: "include",
          headers: myHeaders,
        }
      );
      if (!resp.ok) {
        const jsonResp = await resp.json();
        return { status: jsonResp.status, message: jsonResp.message };
      }
      return await resp.text();
    } catch (err) {}
  }
  return "Currency doesn't exist";
};
