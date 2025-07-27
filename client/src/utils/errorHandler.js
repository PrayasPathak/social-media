export function parseApiError(error) {
  if (error.response) {
    const { status, data } = error.response;

    if (status === 400) {
      if (data.errors) {
        return {
          message: data.error || "Invalid input",
          fieldErrors: data.errors,
          validationErrors: [],
        };
      }
      if (data.validationErrors) {
        return {
          message: data.error || "Validation failed",
          fieldErrors: {},
          validationErrors: data.validationErrors,
        };
      }
      return {
        message: data.error || "Bad request",
        fieldErrors: {},
        validationErrors: [],
      };
    }

    return {
      message: data.error || "Something went wrong",
      fieldErrors: {},
      validationErrors: [],
    };
  }

  return {
    message: error.message || "Unknown error",
    fieldErrors: {},
    validationErrors: [],
  };
}
