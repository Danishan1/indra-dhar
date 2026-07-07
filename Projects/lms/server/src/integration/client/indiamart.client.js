import axios from "axios";

export async function fetchIndiaMartLead(queryId, config) {
  const response = await axios.get(
    "https://mapi.indiamart.com/wservce/enquiry/search.json",
    {
      params: {
        query_id: queryId,
        key: config.apiKey,
      },
    },
  );

  const lead = response.data?.RESPONSE?.[0];

  if (!lead) {
    throw new Error("IndiaMART lead not found");
  }

  return {
    name: lead.SENDER_NAME ?? null,
    phone: lead.SENDER_MOBILE ?? null,
    email: lead.SENDER_EMAIL ?? null,
    message: lead.QUERY_MESSAGE ?? null,
    product: lead.QUERY_PRODUCT_NAME ?? null,
    source: "INDIAMART",
    externalId: queryId,
  };
}
