/** Schema parser keys */
export const clientCardCollectionKeys: (keyof ClientCardCollection)[] = [
  'id', 'name', 'description', 'tableSize', 'cards',
  'user', 'createdAt', 'updatedAt'
] as const
