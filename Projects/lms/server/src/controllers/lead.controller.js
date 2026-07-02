import { LeadService } from "../services/lead.service.js";

export const LeadController = {
  async create(req, res) {
    const tenantId = req.user.tenant_id;

    const lead = await LeadService.create({
      ...req.body,
      tenant_id: tenantId,
      created_by: req.user.id,
    });

    res.json(lead);
  },

  async list(req, res) {
    const tenantId = req.user.tenant_id;

    const leads = await LeadService.list({
      tenant_id: tenantId,
      filters: req.query,
    });

    res.json(leads);
  },

  async getById(req, res) {
    const lead = await LeadService.getById(req.params.id);
    res.json(lead);
  },

  async update(req, res) {
    const lead = await LeadService.update(req.params.id, req.body);
    res.json(lead);
  },

  async remove(req, res) {
    const result = await LeadService.delete(req.params.id);
    res.json(result);
  },

  async assign(req, res) {
    const result = await LeadService.assign(
      req.params.id,
      req.body.to_user,
      req.user.id,
    );
    res.json(result);
  },

  async changeStage(req, res) {
    const result = await LeadService.changeStage(
      req.params.id,
      req.body.stage_id,
      req.user.id,
    );
    res.json(result);
  },

  async updateStatus(req, res) {
    const result = await LeadService.updateStatus(
      req.params.id,
      req.body.status,
    );
    res.json(result);
  },

  async addNote(req, res) {
    const note = await LeadService.addNote(
      req.params.id,
      req.body.note,
      req.user.id,
    );
    res.json(note);
  },

  async timeline(req, res) {
    const data = await LeadService.timeline(req.params.id);
    res.json(data);
  },

  async uploadAttachment(req, res) {
    try {
      const tenant_id = req.user.tenant_id;
      const lead_id = req.params.id;

      const file = req.file; // from multer

      const result = await LeadService.uploadAttachment({
        tenant_id,
        lead_id,
        file,
        uploaded_by: req.user?.id,
      });

      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  /**
   * Duplicate check
   */
  async checkDuplicates(req, res) {
    try {
      const tenant_id = req.user.tenant_id;
      const lead_id = req.params.id;

      const result = await LeadService.checkDuplicates({
        tenant_id,
        lead_id,
      });

      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
