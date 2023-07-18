import {
  useEditorThemeValue,
  useSetEditorTheme,
  useThemeSync,
  useThemeValue,
  useToggleTheme
} from './atoms/settings'
import { Editor } from './components/editor'
import { ToggleSwitch } from './components/toggle-switch'
import { EditorTheme, ThemeType, themes } from './themes'

const themeEntries = Object.entries(themes) as [
  EditorTheme,
  {
    name: string
    type: ThemeType
  }
][]

export const App = () => {
  const theme = useThemeValue()
  const toggleTheme = useToggleTheme()
  const editorTheme = useEditorThemeValue()
  const setEditorTheme = useSetEditorTheme()

  useThemeSync()

  return (
    <div className="w-screen h-screen">
      <div className="h-full">
        <div className="flex flex-col w-full h-full bg-gray-50 dark:bg-[#202124]">
          <div className="col-span-2 flex bg-gray-100 dark:bg-[#111111] justify-between items-center p-4 border-y border-gray-300 dark:border-gray-700">
            <div className="flex gap-2 items-center">
              <img
                src={`/ojs-${theme === 'dark' ? 'white' : 'black'}.svg`}
                width={40}
                alt="onlyjs.io"
              />
            </div>
            <div className="flex items-center gap-4">
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
          </div>
          <div
            style={{
              height: 'calc(100vh - 3.625rem)'
            }}
          >
            <Editor />
          </div>
        </div>
      </div>
    </div>
  )
}
