const knex = require("../knex");
const { addCreatedTimestamps } = require("./helper");

const countAll = async (where = {}, whereNot = {}) => {
  try {
    let teams = await knex("teams")
      .where(where)
      .whereNot(whereNot)
      .count({ count: "*" })
      .first();
    return parseInt(teams.count);
  } catch (error) {
    throw error;
  }
};

const create = async (payload) => {
  try {
    payload = addCreatedTimestamps(payload);

    let result = await knex.transaction(async (trx) => {
      const teams = await trx("teams").insert(payload).returning("*");
      const teamMemberPayload = addCreatedTimestamps({
        user_uuid: payload.creator_user_uuid,
        team_uuid: teams[0]["uuid"],
        status: "accepted",
        role: "owner",
      });
      await trx("team_members").insert(teamMemberPayload);
      return teams[0];
    });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  create,
  countAll,
};
