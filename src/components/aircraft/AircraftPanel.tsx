import React from 'react'
import { Button } from '@components/common'
import { PlusIcon } from '@heroicons/react/24/outline'

export const AircraftPanel: React.FC = () => {
  return (
    <div className="p-4">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">✈️</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Aircraft Profiles
        </h3>
        <p className="text-gray-600 mb-4">
          Manage your aircraft for weight & balance and performance calculations
        </p>
        <Button 
          variant="primary" 
          size="sm"
          leftIcon={<PlusIcon className="w-4 h-4" />}
        >
          Add Aircraft
        </Button>
      </div>
    </div>
  )
}