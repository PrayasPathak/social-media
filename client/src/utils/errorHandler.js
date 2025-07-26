export function parseApiError(error) {
  if (error.response) {
    const { status, data } = error.response;

    if (status === 400) {
      if (data.errors) {
        return {
          type: "validation",
          details: data.errors,
          message: data.error,
        };
      }
      if (data.validationErrors) {
        return {
          type: "validationSet",
          details: data.validationErrors,
          message: data.error,
        };
      }
      return { type: "bad_request", message: data.error || "Bad request" };
    }
    if (status === 401) {
      return { type: "unauthorized", message: data.error || "Unauthorized" };
    }
    if (status === 403) {
      return { type: "forbidden", message: data.error || "Forbidden" };
    }
    if (status === 404) {
      return { type: "not_found", message: data.error || "Not Found" };
    }
    if (status >= 500) {
      return { type: "server_error", message: data.error || "Server error" };
    }
  }

  return { type: "unknown", message: error.message || "Unknown error" };
}
