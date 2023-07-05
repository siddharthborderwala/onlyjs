import { useThemeSync, useThemeValue, useToggleTheme } from './atoms/settings'
import { Editor } from './components/editor'
import { ToggleSwitch } from './components/toggle-switch'

export const App = () => {
  const theme = useThemeValue()
  const toggleTheme = useToggleTheme()

  useThemeSync()

  return (
    <div className="w-screen h-screen">
      <div className="flex justify-between items-center px-4 py-4 bg-gray-50 dark:bg-[#202124]">
        <h1 className="text-xl font-bold font-sans text-gray-900 dark:text-gray-50">
          only.js
        </h1>
        <ToggleSwitch
          checked={theme === 'dark'}
          label="Dark Mode"
          onChange={toggleTheme}
        />
      </div>
      <div
        style={{
          height: 'calc(100vh - 4rem)'
        }}
      >
        <Editor />
      </div>
    </div>
  )
}
