import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useStore } from '@store'
import { Button } from '@components/common'
import { WeatherPanel } from '@components/weather/WeatherPanel'
import { NOTAMPanel } from '@components/notam/NOTAMPanel'
import { AircraftPanel } from '@components/aircraft/AircraftPanel'
import { SettingsPanel } from '@components/settings/SettingsPanel'

export const Sidebar: React.FC = () => {
  const { activePanel, setActivePanel } = useStore()

  const handleClose = () => {
    setActivePanel(null)
  }

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'weather':
        return <WeatherPanel />
      case 'notams':
        return <NOTAMPanel />
      case 'aircraft':
        return <AircraftPanel />
      case 'settings':
        return <SettingsPanel />
      default:
        return null
    }
  }

  const getPanelTitle = () => {
    switch (activePanel) {
      case 'weather':
        return 'Weather Information'
      case 'notams':
        return 'NOTAMs & TFRs'
      case 'aircraft':
        return 'Aircraft Management'
      case 'settings':
        return 'Settings'
      default:
        return 'Panel'
    }
  }

  if (!activePanel) return null

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
          {getPanelTitle()}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto">
        {renderPanelContent()}
      </div>
    </div>
  )
}