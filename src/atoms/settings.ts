import { useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useCallback, useEffect } from 'react'
import { EditorTheme, ThemeType, themes } from '../themes'

export const editorThemeAtom = atomWithStorage<EditorTheme>(
  'editor-theme',
  EditorTheme['vs-dark']
)

export const useEditorThemeValue = () => {
  return useAtomValue(editorThemeAtom)
}

export const useSetEditorTheme = () => {
  return useSetAtom(editorThemeAtom)
}

export const themeAtom = atomWithStorage<ThemeType>('color-theme', 'dark')

export const useThemeValue = () => {
  return useAtomValue(themeAtom)
}

export const useSetTheme = () => {
  return useSetAtom(themeAtom)
}

export const useThemeSync = () => {
  const theme = useThemeValue()
  const editorTheme = useEditorThemeValue()
  const setEditorTheme = useSetEditorTheme()

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

  useEffect(() => {
    if (themes[editorTheme].type === 'dark' && theme === 'light') {
      setEditorTheme(EditorTheme['light'])
    } else if (themes[editorTheme].type === 'light' && theme === 'dark') {
      setEditorTheme(EditorTheme['vs-dark'])
    }
  }, [editorTheme, theme, setEditorTheme])
}

export const useToggleTheme = () => {
  const setTheme = useSetTheme()

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => prevTheme === 'light' ? 'dark' : 'light')
  }, [setTheme])

  return toggleTheme
}
