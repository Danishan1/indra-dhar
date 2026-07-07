import axios from "axios";

export async function fetchFacebookLead(leadId, config) {
  const response = await axios.get(
    `https://graph.facebook.com/v20.0/${leadId}`,
    {
      params: {
        access_token: config.accessToken,
        fields: "field_data",
      },
    },
  );

  const fields = response.data.field_data ?? [];

  return fields.reduce((acc, item) => {
    acc[item.name] = item.values?.[0] ?? null;

    return acc;
  }, {});
}
