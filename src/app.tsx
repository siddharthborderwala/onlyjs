import { Lightning } from '@phosphor-icons/react'
import { useThemeSync, useThemeValue, useToggleTheme } from './atoms/settings'
import { Editor } from './components/editor'
import { ToggleSwitch } from './components/toggle-switch'

export const App = () => {
  const theme = useThemeValue()
  const toggleTheme = useToggleTheme()

  useThemeSync()

  return (
    <div className="w-screen h-screen">
      <div className="h-full">
        <div className="flex flex-col w-full h-full bg-gray-50 dark:bg-[#202124]">
          <div className="col-span-2 flex bg-gray-100 dark:bg-[#111111] justify-between items-center py-4 px-2 border-y border-gray-300 dark:border-gray-700">
            <div className="flex gap-2 items-center">
              <Lightning
                weight="bold"
                size={20}
                className="text-gray-900 dark:text-gray-50"
              />
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 font-sans">
                onlyjs.io
              </p>
            </div>
            <div>
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
