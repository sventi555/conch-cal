export const canEdit = (entity: { owner: string }, userId: string) =>
  entity.owner === userId;
