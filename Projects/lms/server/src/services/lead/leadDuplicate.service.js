import { LeadRepository } from "../../repositories/lead.repository.js";

export const DuplicateService = {
  async check({ tenant_id, lead }) {
    return LeadRepository.findDuplicateLead({
      tenant_id,
      email: lead.email,
      mobile: lead.mobile,
      first_name: lead.first_name,
      last_name: lead.last_name,
      company: lead.company,
    });
  },
};
