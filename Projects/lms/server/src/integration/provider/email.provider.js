export const EmailProvider = {
  async send({ config, payload }) {
    console.log("Sending Email", payload.to);
  },
};
