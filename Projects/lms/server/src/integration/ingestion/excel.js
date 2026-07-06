export const ExcelIngestion = {
  normalize({ payload }) {
    return {
      first_name: payload["First Name"],
      last_name: payload["Last Name"],
      email: payload["Email"],
      mobile: payload["Mobile"],
      company: payload["Company"],
      budget: payload["Budget"],
    };
  },
};
