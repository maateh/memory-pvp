import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const UserScalarFieldEnumSchema = z.enum(['id','clerkId','username','email','imageUrl','createdAt','updatedAt']);

export const PlayerProfileScalarFieldEnumSchema = z.enum(['id','tag','color','isActive','userId','stats','createdAt','updatedAt']);

export const GameSessionScalarFieldEnumSchema = z.enum(['id','slug','type','mode','tableSize','status','stats','cards','flipped','currentTurn','collectionId','ownerId','guestId','continuedAt','closedAt','startedAt','updatedAt']);

export const ResultScalarFieldEnumSchema = z.enum(['id','flips','matches','score','playerId','sessionId','createdAt','updatedAt']);

export const MemoryCardScalarFieldEnumSchema = z.enum(['id','utKey','imageUrl','collectionId']);

export const CardCollectionScalarFieldEnumSchema = z.enum(['id','name','description','tableSize','userId','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const GameStatusSchema = z.enum(['RUNNING','FINISHED','ABANDONED','OFFLINE']);

export type GameStatusType = `${z.infer<typeof GameStatusSchema>}`

export const GameTypeSchema = z.enum(['CASUAL','COMPETITIVE']);

export type GameTypeType = `${z.infer<typeof GameTypeSchema>}`

export const GameModeSchema = z.enum(['SINGLE','PVP','COOP']);

export type GameModeType = `${z.infer<typeof GameModeSchema>}`

export const TableSizeSchema = z.enum(['SMALL','MEDIUM','LARGE']);

export type TableSizeType = `${z.infer<typeof TableSizeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  username: z.string(),
  email: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// PLAYER PROFILE SCHEMA
/////////////////////////////////////////

export const PlayerProfileSchema = z.object({
  id: z.string(),
  tag: z.string(),
  color: z.string(),
  isActive: z.boolean(),
  userId: z.string(),
  /**
   * [PlayerStats]
   */
  stats: JsonValueSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PlayerProfile = z.infer<typeof PlayerProfileSchema>

/////////////////////////////////////////
// GAME SESSION SCHEMA
/////////////////////////////////////////

export const GameSessionSchema = z.object({
  type: GameTypeSchema,
  mode: GameModeSchema,
  tableSize: TableSizeSchema,
  status: GameStatusSchema,
  id: z.string(),
  slug: z.string(),
  /**
   * [SessionStats]
   */
  stats: JsonValueSchema,
  /**
   * [SessionCard]
   */
  cards: JsonValueSchema.array(),
  /**
   * [SessionCardMetadata]
   */
  flipped: JsonValueSchema.array(),
  currentTurn: z.string(),
  collectionId: z.string().nullable(),
  ownerId: z.string().nullable(),
  guestId: z.string().nullable(),
  continuedAt: z.coerce.date().nullable(),
  closedAt: z.coerce.date().nullable(),
  startedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type GameSession = z.infer<typeof GameSessionSchema>

/////////////////////////////////////////
// RESULT SCHEMA
/////////////////////////////////////////

export const ResultSchema = z.object({
  id: z.string(),
  flips: z.number().int(),
  matches: z.number().int(),
  score: z.number().int().nullable(),
  playerId: z.string(),
  sessionId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Result = z.infer<typeof ResultSchema>

/////////////////////////////////////////
// MEMORY CARD SCHEMA
/////////////////////////////////////////

export const MemoryCardSchema = z.object({
  id: z.string(),
  utKey: z.string(),
  imageUrl: z.string(),
  collectionId: z.string(),
})

export type MemoryCard = z.infer<typeof MemoryCardSchema>

/////////////////////////////////////////
// CARD COLLECTION SCHEMA
/////////////////////////////////////////

export const CardCollectionSchema = z.object({
  tableSize: TableSizeSchema,
  id: z.string(),
  name: z.string(),
  description: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type CardCollection = z.infer<typeof CardCollectionSchema>
