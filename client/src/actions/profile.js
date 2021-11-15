import axios from "axios";
import { Navigate } from "react-router";
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
export const createProfile =
  (formData, edit = false, token) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          // "Content-Type": "application/json",
          "X-auth-token": token,
        },
      };

      const res = await axios.post(
        "/api/profile/editprofile",
        formData,
        config,
      );
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });

      dispatch(
        setAlert(
          edit
            ? "Profile Updated Successfully..."
            : "Profile Created Successfully",
          3000,
        ),
      );

      if (!edit) {
        <Navigate to="/dashboard" />;
      }
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) =>
          dispatch(setAlert(error.msg, "danger", 3000)),
        );
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
