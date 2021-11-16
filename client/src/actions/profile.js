import axios from "axios";
import { Navigate } from "react-router-dom";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE } from "./types";

//GET CURRENT USER...
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Create or Update Profile...
export const createProfile = (formData, auth) => async (dispatch) => {
  try {
    const token = auth.token;
    console.log("tokensin auth", token);
    console.log("tokensin auth in", auth);
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-auth-token": token,
      },
    };
    console.log(config);
    // const body = JSON(formData);
    console.log("Data in Body in action", formData);

    const res = await axios.post("/api/profile/editprofile", {
      headers: {
        "Content-Type": "application/json",
        "X-auth-token": token,
      },
      formData,
    });
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    dispatch(
      setAlert("Profile Created Successfully", "success", 3000),
      <Navigate to="/dashboard" />,
    );
  } catch (err) {
    const errors = err?.response?.data?.errors;
    console.log({ errors });
    console.log("error here", err, typeof err);

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger", 3000)));
    }
    dispatch(setAlert(err.response.statusText, "danger", 3000));

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
