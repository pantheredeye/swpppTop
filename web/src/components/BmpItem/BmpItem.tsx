// src/components/BmpItem/BmpItem.tsx
import { useState, useEffect } from 'react'

import {
  CheckboxField,
  TextField,
  TextAreaField,
  Label,
} from '@cedarjs/forms'

import useBmpStore from 'src/stores/bmpStore'

interface Bmp {
  id: number
  name: string
  description: string
  implemented: boolean
  maintenanceRequired: boolean
  repeatOccurrence: boolean
  correctiveActionNeeded: string
  notes: string
}

interface BmpItemProps {
  bmp: Bmp
}

const BmpItem = ({ bmp }: BmpItemProps) => {
  const [expanded, setExpanded] = useState(false)
  const [bmpData, setBmpData] = useState<Bmp>(bmp)
  const updateBmpResponse = useBmpStore((state) => state.updateBmpResponse)

  useEffect(() => {
    setBmpData(bmp)
  }, [bmp])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const updatedData = {
      [name.replace(`-${bmp.id}`, '')]: type === 'checkbox' ? checked : value,
    }
    setBmpData((prevData) => ({
      ...prevData,
      ...updatedData,
    }))
    updateBmpResponse(bmp.id, updatedData)
  }

  return (
    <div className="rounded-xl bg-gray-800 p-6 shadow-lg">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-200">{bmp.name}</h3>
          <p className="text-sm text-gray-400">{bmp.description}</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-indigo-500 hover:text-indigo-400"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      {expanded && (
        <div className="mt-4 space-y-4">
          <div>
            <Label
              name={`implemented-${bmp.id}`}
              className="block text-sm font-medium text-gray-200"
            >
              Implemented
            </Label>
            <CheckboxField
              name={`implemented-${bmp.id}`}
              checked={bmpData.implemented}
              onChange={handleChange}
              className="rounded-md border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div>
            <Label
              name={`maintenanceRequired-${bmp.id}`}
              className="block text-sm font-medium text-gray-200"
            >
              Maintenance Required
            </Label>
            <CheckboxField
              name={`maintenanceRequired-${bmp.id}`}
              checked={bmpData.maintenanceRequired}
              onChange={handleChange}
              className="rounded-md border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div>
            <Label
              name={`repeatOccurrence-${bmp.id}`}
              className="block text-sm font-medium text-gray-200"
            >
              Repeat Occurrence
            </Label>
            <CheckboxField
              name={`repeatOccurrence-${bmp.id}`}
              checked={bmpData.repeatOccurrence}
              onChange={handleChange}
              className="rounded-md border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div>
            <Label
              name={`correctiveActionNeeded-${bmp.id}`}
              className="block text-sm font-medium text-gray-200"
            >
              Corrective Action Needed
            </Label>
            <TextField
              name={`correctiveActionNeeded-${bmp.id}`}
              value={bmpData.correctiveActionNeeded}
              onChange={handleChange}
              className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <Label
              name={`notes-${bmp.id}`}
              className="block text-sm font-medium text-gray-200"
            >
              Notes
            </Label>
            <TextAreaField
              name={`notes-${bmp.id}`}
              value={bmpData.notes}
              onChange={handleChange}
              className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default BmpItem
