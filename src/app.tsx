import { Gear } from '@phosphor-icons/react'
import {
  useEditorThemeValue,
  useSetEditorTheme,
  useThemeSync,
  useThemeValue,
  useToggleTheme
} from './atoms/settings'
import { Editor, EditorKeyBinding } from './components/editor'
import { ToggleSwitch } from './components/toggle-switch'
import { EditorTheme, ThemeType, themes } from './themes'
import { useCallback, useEffect, useState } from 'react'
import { Modal } from './components/modal'
import { useMonaco } from '@monaco-editor/react'

const themeEntries = Object.entries(themes) as [
  EditorTheme,
  {
    name: string
    type: ThemeType
  }
][]

/**
 * 
 <select
                value={editorTheme}
                onChange={(e) =>
                  setEditorTheme(e.target.value as keyof typeof themes)
                }
              >
                {themeEntries
                  .filter(([, value]) => value.type === theme)
                  .map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name}
                    </option>
                  ))}
              </select>
              <ToggleSwitch
                checked={theme === 'dark'}
                label="Dark Mode"
                onChange={toggleTheme}
              />
 */

export const App = () => {
  const theme = useThemeValue()
  const toggleTheme = useToggleTheme()
  const editorTheme = useEditorThemeValue()
  const setEditorTheme = useSetEditorTheme()
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  useThemeSync()

  const toggleSettings = useCallback(() => {
    setIsSettingsModalOpen((v) => !v)
  }, [])

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      // listen to command + k
      if (e.metaKey && e.key === 'k') {
        toggleSettings()
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [toggleSettings])

  const monaco = useMonaco()

  const keyBindings: EditorKeyBinding[] = monaco
    ? [
        {
          keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
          commandId: 'toggle-app-settings',
          commandCallback: toggleSettings
        }
      ]
    : []

  return (
    <div className="w-screen h-screen">
      <div className="h-full">
        <div className="flex flex-col w-full h-full bg-gray-50 dark:bg-[#202124]">
          <div className="col-span-2 flex bg-gray-100 dark:bg-[#111111] justify-between items-center p-4 border-y border-gray-300 dark:border-gray-700">
            <div className="flex gap-2 items-center">
              <img
                src="/ojs-black.svg"
                width={40}
                alt="onlyjs.io"
                className={theme === 'dark' ? 'hidden' : 'block'}
              />
              <img
                src="/ojs-white.svg"
                width={40}
                alt="onlyjs.io"
                className={theme === 'light' ? 'hidden' : 'block'}
              />
            </div>
            <button
              title="Open Settings Modal"
              className="text-white"
              onClick={toggleSettings}
            >
              <Gear />
            </button>
          </div>
          <div
            style={{
              height: 'calc(100vh - 3.625rem)'
            }}
          >
            <Editor keyBindings={keyBindings} />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      >
        <div>
          <select
            value={editorTheme}
            onChange={(e) =>
              setEditorTheme(e.target.value as keyof typeof themes)
            }
          >
            {themeEntries
              .filter(([, value]) => value.type === theme)
              .map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
          </select>
          <ToggleSwitch
            checked={theme === 'dark'}
            label="Dark Mode"
            onChange={toggleTheme}
          />
        </div>
      </Modal>
    </div>
  )
}
