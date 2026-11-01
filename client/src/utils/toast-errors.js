import { toast } from "react-toastify";

// Shows the (translated) error messages returned by the API, or a fallback message
export default function toastErrors(error, t, fallback = "O servidor não está respondendo, tente novamente mais tarde.") {
  const errorMessages = error?.response?.data?.message;
  if (Array.isArray(errorMessages)) {
    errorMessages.forEach((err) => toast.error(t(err)));
  } else {
    toast.error(fallback);
  }
}
