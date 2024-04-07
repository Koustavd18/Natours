import axios from "axios";
import { showAlert } from "./alerts";

export const updateData = async (data, type) => {
  const endpoint = type === "password" ? "updatePassword" : "updateMe";
  console.log(endpoint);
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:8000/api/v1/users/${endpoint}`,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated sucessfully`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
