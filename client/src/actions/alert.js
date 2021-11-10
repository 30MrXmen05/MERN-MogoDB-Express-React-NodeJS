import { v4 as uuid } from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

//Alert Function For Dynamic TEXT, ALERT_TYPE, TIMEOUT_TIME...
export const setAlert = (msg, alertType, timeOut) => (dispatch) => {
  const id = uuid();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(
    () =>
      dispatch({
        type: REMOVE_ALERT,
        payload: id,
      }),
    timeOut,
  );
};
