export const ConditionEngine = {
  check(conditions, payload) {
    return conditions.every((condition) => {
      const value = condition.field
        .split(".")
        .reduce((a, b) => a?.[b], payload);

      switch (condition.operator) {
        case "=":
          return value === condition.value;

        case "!=":
          return value !== condition.value;

        case "IN":
          return condition.value.includes(value);

        default:
          return true;
      }
    });
  },
};
