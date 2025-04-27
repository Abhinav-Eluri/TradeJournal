
let showToastHandler = null;

export const toast = (message, type = "success") => {
  if (showToastHandler) {
    showToastHandler(message, type);
  }
};

export const setToastHandler = (handler) => {
  showToastHandler = handler;
};
