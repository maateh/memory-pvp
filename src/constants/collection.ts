/** Schema parser keys */
export const clientCardCollectionKeys: (keyof ClientCardCollection)[] = [
  'name', 'description', 'tableSize', 'cards',
  'user', 'createdAt', 'updatedAt'
] as const
