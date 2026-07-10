import { TaskActions } from "../actions/task.actions.js";
import { LeadActions } from "../actions/lead.actions.js";

const ACTIONS = {
  ...TaskActions,
  ...LeadActions,
};

export const ActionEngine = {
  async execute({ actions, payload, tenant_id }) {
    for (const action of actions) {
      const handler = ACTIONS[action.type];

      if (handler) {
        await handler({
          tenant_id,

          payload,

          config: action.config,
        });
      }
    }
  },
};
