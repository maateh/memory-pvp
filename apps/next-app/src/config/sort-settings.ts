// types
import type { z } from "zod"
import type { CollectionSort } from "@repo/schema/collection"
import type { PlayerSort } from "@repo/schema/player"
import type { SessionSort } from "@repo/schema/session"
import type { SortOptions, SortPattern, SortSchemaKey } from "@/lib/types/search"

// schemas
import { collectionSort } from "@repo/schema/collection"
import { playerSort } from "@repo/schema/player"
import { sessionSort } from "@repo/schema/session"

type SortSetting<S extends SortPattern> = {
  sortSchema: z.ZodSchema<S>
  options: SortOptions<S>
}

type SortSettings<S extends SortPattern> = Record<SortSchemaKey, SortSetting<S>>

const collectionSortSettings: SortSetting<CollectionSort> = {
  sortSchema: collectionSort,
  options: {
    name: {
      sortValueKey: "name",
      label: "Name"
    },
    tableSize: {
      sortValueKey: "tableSize",
      label: "Size"
    },
    createdAt: {
      sortValueKey: "createdAt",
      label: "Created at"
    },
    updatedAt: {
      sortValueKey: "updatedAt",
      label: "Updated at"
    }
  }
}

const playerSortSettings: SortSetting<PlayerSort> = {
  sortSchema: playerSort,
  options: {
    tag: {
      sortValueKey: "tag",
      label: "Player tag"
    },
    createdAt: {
      sortValueKey: "createdAt",
      label: "Created at"
    }
  }
}

const sessionSortSettings: SortSetting<SessionSort> = {
  sortSchema: sessionSort,
  options: {
    slug: {
      sortValueKey: "slug",
      label: "Session"
    },
    status: {
      sortValueKey: "status",
      label: "Status"
    },
    mode: {
      sortValueKey: "mode",
      label: "Settings"
    },
    format: {
      sortValueKey: "format",
      label: "Match format"
    },
    tableSize: {
      sortValueKey: "tableSize",
      label: "Table size"
    },
    startedAt: {
      sortValueKey: "startedAt",
      label: "Started at"
    },
    closedAt: {
      sortValueKey: "closedAt",
      label: "Closed at"
    }
  }
}

const _sortSettings: SortSettings<any> = {
  collection: collectionSortSettings,
  player: playerSortSettings,
  session: sessionSortSettings
} as const

export const sortSettings = <S extends SortPattern>(
  schemaKey: SortSchemaKey
) => _sortSettings[schemaKey] as SortSetting<S>
