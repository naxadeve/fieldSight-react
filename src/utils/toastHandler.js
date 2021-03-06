import { toast } from 'react-toastify';
/* eslint-disable no-unneeded-ternary */

export const successToast = (title, action) => {
  toast.success(
    action ? `${title} was successfully ${action}` : title,
    {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
    },
  );
};

export const errorToast = error => {
  toast.error(error ? error : 'Oops, something went wrong', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
  });
};
