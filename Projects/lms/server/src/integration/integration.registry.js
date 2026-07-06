import { ApiIngestion } from "./ingestion/api";
import { EmailIngestion } from "./ingestion/email";
import { ExcelIngestion } from "./ingestion/excel";
import { FacebookIngestion } from "./ingestion/facebook";
import { IndiaMartIngestion } from "./ingestion/indiamart";


export const IngestionRegistry = {
  FACEBOOK: FacebookIngestion,
  INDIAMART: IndiaMartIngestion,
  EMAIL: EmailIngestion,
  EXCEL: ExcelIngestion,
  API: ApiIngestion,
};

export const NotificationRegistry = {
  EMAIL: EmailProvider,
  WHATSAPP: WhatsAppProvider,
  SMS: SmsProvider,
};