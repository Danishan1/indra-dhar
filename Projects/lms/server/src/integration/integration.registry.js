import { ApiIngestion } from "./ingestion/api.js";
import { EmailIngestion } from "./ingestion/email.js";
import { ExcelIngestion } from "./ingestion/excel.js";
import { FacebookIngestion } from "./ingestion/facebook.js";
import { IndiaMartIngestion } from "./ingestion/indiamart.js";


export const IngestionRegistry = {
  FACEBOOK: FacebookIngestion,
  INDIAMART: IndiaMartIngestion,
  EMAIL: EmailIngestion,
  EXCEL: ExcelIngestion,
  API: ApiIngestion,
};

export const NotificationRegistry = {
  // EMAIL: EmailProvider,
  // WHATSAPP: WhatsAppProvider,
  // SMS: SmsProvider,
};