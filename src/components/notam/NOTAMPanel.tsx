import React from 'react'
import { Button } from '@components/common'

export const NOTAMPanel: React.FC = () => {
  return (
    <div className="p-4">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          NOTAMs & TFRs
        </h3>
        <p className="text-gray-600 mb-4">
          View active NOTAMs and temporary flight restrictions for your route
        </p>
        <Button variant="outline" size="sm">
          Refresh NOTAMs
        </Button>
      </div>
    </div>
  )
}