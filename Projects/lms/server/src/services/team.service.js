import { TeamRepository } from "../repositories/team.repository.js";

export const TeamService = {
  async create(data) {
    if (data.parent_team_id) {
      await this.checkCycle(null, data.parent_team_id);
    }

    return TeamRepository.create(data);
  },

  async list(tenantId) {
    return TeamRepository.list(tenantId);
  },

  async getById(id) {
    return TeamRepository.findById(id);
  },

  async update(id, data) {
    if (data.parent_team_id) {
      await this.checkCycle(id, data.parent_team_id);
    }

    return TeamRepository.update(id, data);
  },

  async remove(id) {
    return TeamRepository.remove(id);
  },

  async listMembers(teamId) {
    return TeamRepository.listMembers(teamId);
  },

  async addMember(teamId, userId, isLeader = false) {
    return TeamRepository.addMember({
      team_id: teamId,

      user_id: userId,

      is_leader: isLeader,
    });
  },

  async removeMember(teamId, userId) {
    return TeamRepository.removeMember(teamId, userId);
  },

  async setLeader(teamId, userId, isLeader) {
    return TeamRepository.setLeader(teamId, userId, isLeader);
  },

  async listChildren(teamId) {
    return TeamRepository.listChildren(teamId);
  },

  /**
   * Prevent circular hierarchy
   *
   * moving:
   *
   * A -> B -> C
   *
   * C parent cannot become A
   *
   */
  async checkCycle(teamId, parentTeamId) {
    if (teamId && teamId === parentTeamId) {
      throw {
        status: 400,

        message: "A team cannot be its own parent",
      };
    }

    let current = parentTeamId;

    while (current) {
      const parent = await TeamRepository.getParent(current);

      if (!parent) {
        break;
      }

      if (teamId && parent.id === teamId) {
        throw {
          status: 400,

          message: "Invalid hierarchy. Cannot create cyclic team relationship",
        };
      }

      current = parent.parent_team_id;
    }
  },

  async getAssignableTeams(tenantId) {
    const teams = await TeamRepository.listWithMembers(tenantId);

    return teams;
  },
};
