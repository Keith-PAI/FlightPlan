import React from 'react'
import { useStore } from '@store'

export const SettingsPanel: React.FC = () => {
  const { preferences, updatePreferences } = useStore()

  const handleUnitsChange = (key: string, value: string) => {
    updatePreferences({
      units: {
        ...preferences.units,
        [key]: value
      }
    })
  }

  return (
    <div className="p-4 space-y-6">
      {/* Units */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Units</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Distance</label>
            <select
              value={preferences.units.distance}
              onChange={(e) => handleUnitsChange('distance', e.target.value)}
              className="form-select text-sm"
            >
              <option value="nm">Nautical Miles</option>
              <option value="sm">Statute Miles</option>
              <option value="km">Kilometers</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Speed</label>
            <select
              value={preferences.units.speed}
              onChange={(e) => handleUnitsChange('speed', e.target.value)}
              className="form-select text-sm"
            >
              <option value="kts">Knots</option>
              <option value="mph">Miles per Hour</option>
              <option value="kmh">Kilometers per Hour</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Weight</label>
            <select
              value={preferences.units.weight}
              onChange={(e) => handleUnitsChange('weight', e.target.value)}
              className="form-select text-sm"
            >
              <option value="lbs">Pounds</option>
              <option value="kg">Kilograms</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Fuel</label>
            <select
              value={preferences.units.fuel}
              onChange={(e) => handleUnitsChange('fuel', e.target.value)}
              className="form-select text-sm"
            >
              <option value="gal">Gallons</option>
              <option value="lbs">Pounds</option>
              <option value="kg">Kilograms</option>
              <option value="l">Liters</option>
            </select>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
        <div className="space-y-2">
          {['light', 'dark', 'night'].map((theme) => (
            <label key={theme} className="flex items-center">
              <input
                type="radio"
                name="theme"
                value={theme}
                checked={preferences.theme === theme}
                onChange={(e) => updatePreferences({ theme: e.target.value as any })}
                className="form-radio"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {theme} {theme === 'night' && '(Red Light Compatible)'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Auto-save */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.autoSave}
              onChange={(e) => updatePreferences({ autoSave: e.target.checked })}
              className="form-checkbox"
            />
            <span className="ml-2 text-sm text-gray-700">Auto-save routes</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => updatePreferences({ notifications: e.target.checked })}
              className="form-checkbox"
            />
            <span className="ml-2 text-sm text-gray-700">Enable notifications</span>
          </label>
        </div>
      </div>
    </div>
  )
}