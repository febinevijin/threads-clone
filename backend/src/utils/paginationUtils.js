export const getPaginationOptions = ({ limit = 20, page = 1 }) => {
  if (Number(limit) > 30) {
    limit = 20;
  }
  const newLimit = Number(limit);
  const skip = (Number(page) - 1) * Number(limit);
  return {
    limit: newLimit,
    skip,
  };
};
