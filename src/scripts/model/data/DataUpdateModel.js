import { getCsrf } from "../../cache/CsrfCache";
import { myHeaders } from "../../cache/MyHeaders";
import { API_ADDRESS, API_PORT } from "../../constants/ApiAddress";

export const getNewCryptoData = async function (currency, fileName) {
  await getCsrf();
  try {
    const resp = await fetch(
      `http://${API_ADDRESS}:${API_PORT}/api/v1/data/update/crypto?currency=${currency}&fileName=${fileName}`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: myHeaders,
      }
    );
    const jsonResp = await resp.json();
    if (resp.status !== 200) {
      return { message: jsonResp.message, status: jsonResp.status };
    }
    return jsonResp;
  } catch (err) {}
};

export const getNewStockData = async function (currency, fileName) {
  await getCsrf();
  try {
    const resp = await fetch(
      `http://${API_ADDRESS}:${API_PORT}/api/v1/data/update/stock?currency=${currency}&fileName=${fileName}`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: myHeaders,
      }
    );
    const jsonResp = await resp.json();
    if (resp.status !== 200) {
      return { message: jsonResp.message, status: jsonResp.status };
    }
    return jsonResp;
  } catch (err) {}
};

export const confirmUpdate = async function (currency, fileName) {
  await getCsrf();
  try {
    const resp = await fetch(
      `http://${API_ADDRESS}:${API_PORT}/api/v1/data/update/confirm`,
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: myHeaders,
      }
    );
    if (resp.status !== 200) {
      const jsonResp = await resp.json();
      return { message: jsonResp.message, status: jsonResp.status };
    }
    return await resp.text();
  } catch (err) {}
};

export const cancelUpdate = async function (currency, fileName) {
  await getCsrf();
  try {
    const resp = await fetch(
      `http://${API_ADDRESS}:${API_PORT}/api/v1/data/update/cancel`,
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: myHeaders,
      }
    );
    const jsonResp = await resp.json();
    if (resp.status !== 200) {
      return { message: jsonResp.message, status: jsonResp.status };
    }
    return jsonResp;
  } catch (err) {}
};
