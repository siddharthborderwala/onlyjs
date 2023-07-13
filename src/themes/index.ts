export type ThemeType = 'dark' | 'light'

export enum EditorTheme {
  'vs-dark' = 'vs-dark',
  light = 'light',
  'rose-pine-moon' = 'rose-pine-moon',
  'rose-pine-dawn' = 'rose-pine-dawn'
}

export const themes: Record<EditorTheme, { type: ThemeType, name: string }> = {
  'vs-dark': {
    type: 'dark',
    name: 'Dark'
  },
  light: {
    type: 'light',
    name: 'Light'
  },
  'rose-pine-moon': {
    type: 'dark',
    name: 'Rosé Pine Moon'
  },
  'rose-pine-dawn': {
    type: 'light',
    name: 'Rosé Pine Dawn'
  }
}

interface IToken {
  scope: string | string[]
  settings: {
    foreground: string
    fontStyle: string
  }
}

export const generateThemeConfig = (theme: any, themeType: ThemeType) => ({
  base: themeType === 'dark' ? 'vs-dark' : 'vs' as 'vs' | 'vs-dark',
  inherit: true,
  colors: theme.colors,
  rules: theme.tokenColors.flatMap((token: IToken) => {
    if (typeof token.scope === 'string') {
      return [
        {
          token: token.scope,
          foreground: token.settings.foreground,
          fontStyle: token.settings.fontStyle
        }
      ]
    }
    return token.scope.map((scope) => ({
      token: scope,
      foreground: token.settings.foreground,
      fontStyle: token.settings.fontStyle
    }))
  })
})

export const getThemeType = (theme: EditorTheme): ThemeType => themes[theme].type
