import { getCsrf } from "../../cache/CsrfCache";
import { myHeaders } from "../../cache/MyHeaders";
import { API_ADDRESS, API_PORT } from "../../constants/ApiAddress";

export const getAllDataFiles = async function (fileType) {
  await getCsrf();
  try {
    const resp = await fetch(
      `http://${API_ADDRESS}:${API_PORT}/api/v1/files/training-data?fileType=${fileType}`,
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
