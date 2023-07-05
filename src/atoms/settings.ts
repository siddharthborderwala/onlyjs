import { useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useCallback, useEffect } from 'react'

export type Theme = 'light' | 'dark'

export const themeAtom = atomWithStorage<Theme>('color-theme', 'dark')

export const useThemeValue = () => {
  return useAtomValue(themeAtom)
}

export const useSetTheme = () => {
  return useSetAtom(themeAtom)
}

export const useThemeSync = () => {
  const theme = useThemeValue()

  useEffect(() => {
    const html = document.documentElement

    if (html.classList.contains('dark')) {
      if (theme === 'light') {
        html.classList.remove('dark')
        html.classList.add('light')
      }
    } else if (html.classList.contains('light')) {
      if (theme === 'dark') {
        html.classList.remove('light')
        html.classList.add('dark')
      }
    } else {
      html.classList.add(theme)
    }
  }, [theme])
}

export const useToggleTheme = () => {
  const setTheme = useSetTheme()

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }, [setTheme])

  return toggleTheme
}
