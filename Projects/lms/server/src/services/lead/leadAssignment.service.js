import { UserRepository } from "../../repositories/user.repository.js";

export const AssignmentService = {
  async assignLead({ tenant_id, team_id = null }) {
    const user = await UserRepository.getRandomAssignableUser({
      tenant_id,
      team_id,
    });

    if (!user) {
      throw new Error("No available user found for lead assignment");
    }

    return user;
  },
};
