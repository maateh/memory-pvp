export type Theme = "light" | "dark"

export type UseThemeProps = {
  theme: "light" | "dark"
  setTheme: (theme: Theme) => void
}
