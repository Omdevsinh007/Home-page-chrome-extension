export interface Shortcut {
  id: string
  type: "Shortcut" | "Group"
  name: string | null
  url: string | null
  group: Group[] | null,
}

export interface Group {
  id: string
  name: string
  url: string
}
