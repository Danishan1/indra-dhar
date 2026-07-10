import { LeadWorkflows } from "./definitions/lead.workflow.js";

import { TaskWorkflows } from "./definitions/task.workflow.js";

export const WORKFLOWS = [...LeadWorkflows, ...TaskWorkflows];
