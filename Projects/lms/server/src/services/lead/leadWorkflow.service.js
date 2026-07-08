import { LeadRepository } from "../../repositories/lead.repository.js";
import { TaskService } from "../task.service.js";
import { AssignmentService } from "./leadAssignment.service.js";
import { DuplicateService } from "./leadDuplicate.service.js";

export const LeadWorkflowService = {
  async process({ tenant_id, source, data }) {

    console.log("DDDD: ", {tenant_id, source, data})

    // 1. Duplicate Check
    const duplicate = await DuplicateService.check({
      tenant_id,
      lead: data,
    });

    if (duplicate) {
      return {
        status: "DUPLICATE",
        existingLead: duplicate,
      };
    }

    // 2. Create Lead
    const lead = await LeadRepository.create({
      tenant_id,
      ...data,
      source,
      status: "NEW",
    });

    // 3. Round Robin Assignment
    const assignedUser = await AssignmentService.assignLead({
      tenant_id,
      team_id: null,
    });

    await LeadRepository.assign(lead.id, assignedUser.id);

    // 4. Create Initial Task
    const task = await TaskService.create({
      tenant_id,
      lead_id: lead.id,
      assigned_to: assignedUser.id,
      title: "Follow up new lead",
      description: "Contact customer",
      priority: "HIGH",
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // // 5. Notification
    // await NotificationService.send({
    //   user_id: assignedUser.id,
    //   title: "New Lead Assigned",
    //   message: `New lead ${data.first_name} assigned`,
    // });
    // return {
    //   lead,
    //   task,
    //   assignedUser,
    // };
  },
};
