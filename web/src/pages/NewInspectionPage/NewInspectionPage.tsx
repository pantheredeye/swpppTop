import { useEffect, useState } from 'react'

import {
  Form,
  FieldError,
  Label,
  SelectField,
  TextField,
  TextAreaField,
  Submit,
  CheckboxField,
  DateField,
  TimeField,
  DatetimeLocalField,
} from '@cedarjs/forms'
import { useMutation } from '@cedarjs/web'

import { useAuth } from 'src/auth'
import BmpsCell from 'src/components/BmpsCell'
import CloudinaryUploadWidget from 'src/components/CloudinaryUploadWidget/CloudinaryUploadWidget'
import SitesCell from 'src/components/SitesCell'
// import UsersCell from 'src/components/UsersCell'

const CREATE_INSPECTION_MUTATION = gql`
  mutation CreateInspectionMutation($input: CreateInspectionInput!) {
    createInspection(input: $input) {
      id
    }
  }
`

const NewInspectionPage = () => {
  const [cloudName] = useState('goodswppp')
  const [uploadPreset] = useState('swppp_unsigned')
  const [selectedImage, setSelectedImage] = useState(null)

  const { currentUser } = useAuth()
  const [uwConfig] = useState({
    cloudName,
    uploadPreset,
  })

  const [createInspection, { loading, error }] = useMutation(
    CREATE_INSPECTION_MUTATION
  )

  const [formData, setFormData] = useState(() => {
    const now = new Date()
    const formattedDate = now.toISOString().split('T')[0]
    const formattedTime = now.toTimeString().split(' ')[0].substring(0, 5)
    return {
      date: formattedDate,
      startTime: formattedTime,
      endTime: '',
      inspectorId: currentUser.id,
      siteId: '',
      permitOnSite: false,
      swpppOnSite: false,
      bmpsInstalledPerSwppp: false,
      siteInspectionReports: false,
      inspectionType: 'REGULAR',
      title: '',
      description: '',
      severity: 'LOW',
      violationsNotes: '',
      whomToContact: '',
      newStormEvent: false,
      stormDateTime: '',
      stormDuration: '',
      approximatePrecipitation: '',
      weatherAtTime: 'CLEAR',
      temperature: '',
      previousDischarge: false,
      newDischarges: false,
      dischargeAtThisTime: false,
      currentDischarges: false,
    }
  })

  const [media, setMedia] = useState([])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleThumbnailClick = (event) => {
    const thumbnail = event.target.closest('.cloudinary-thumbnail')
    if (thumbnail) {
      const data = JSON.parse(thumbnail.getAttribute('data-cloudinary'))
      setSelectedImage(data.secure_url)
    }
  }

  const handleDescriptionChange = (index, description) => {
    setMedia((prevMedia) => {
      const newMedia = [...prevMedia]
      newMedia[index].description = description
      return newMedia
    })
  }

  const addMedia = (info) => {
    setMedia((prevMedia) => [
      ...prevMedia,
      { url: info.secure_url, description: '' },
    ])
  }

  const handleSubmit = async (data) => {
    try {
      data.siteId = parseInt(data.siteId, 10)
      data.inspectorId = parseInt(data.inspectorId, 10)

      const baseDate = new Date(data.date)
      const [startHours, startMinutes] = data.startTime.split(':')
      const [endHours, endMinutes] = data.endTime.split(':')

      const startTime = new Date(baseDate)
      startTime.setHours(startHours, startMinutes)

      const endTime = new Date(baseDate)
      endTime.setHours(endHours, endMinutes)

      data.startTime = startTime.toISOString()
      data.endTime = endTime.toISOString()

      const bmpData = []
      const cleanedData = { ...data }

      Object.keys(data).forEach((key) => {
        const match = key.match(/(.*)-(\d+)/)
        if (match) {
          const fieldName = match[1]
          const bmpId = parseInt(match[2], 10)
          if (!bmpData[bmpId]) {
            bmpData[bmpId] = { bmpId }
          }
          bmpData[bmpId][fieldName] = data[key]
          delete cleanedData[key]
        }
      })

      const filteredBmpData = bmpData.filter(Boolean)

      cleanedData.temperature = cleanedData.temperature
        ? parseFloat(cleanedData.temperature)
        : null
      cleanedData.approximatePrecipitation =
        cleanedData.approximatePrecipitation
          ? parseFloat(cleanedData.approximatePrecipitation)
          : null

      data.media = media.map((item) => ({
        url: item.url,
        description: item.description,
      }))

      await createInspection({
        variables: {
          input: {
            ...cleanedData,
            bmpData: filteredBmpData,
            media: data.media,
          },
        },
      })
    } catch (error) {
      console.error('Error in handleSubmit:', error.message)
      alert(
        'There was an error processing the form. Please check your input and try again.'
      )
    }
  }

  useEffect(() => {
    const contentDiv = document.querySelector('.content')
    contentDiv?.addEventListener('click', handleThumbnailClick)

    return () => {
      contentDiv?.removeEventListener('click', handleThumbnailClick)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-800">
      <Form
        id="inspectionForm"
        onSubmit={handleSubmit}
        className="mx-auto max-w-7xl rounded-xl bg-gray-900 p-8 shadow-2xl"
      >
        <div className="space-y-12">
          {/* Section 1: Inspection Details */}
          <div className="border-b border-gray-700 pb-12">
            <h2 className="text-3xl font-bold text-gray-100">New Inspection</h2>
            <p className="mt-2 text-sm text-gray-400">
              Please fill out the inspection details.
            </p>
            <p className="mt-1 text-sm text-red-500">* Required fields</p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-6">
              {/* Site Name */}
              <div className="sm:col-span-3">
                <Label
                  name="siteId"
                  className="block text-sm font-medium text-gray-200"
                >
                  Site Name*
                </Label>
                <div className="mt-2">
                  <SitesCell />
                  <FieldError name="siteId" className="mt-1 text-red-500" />
                </div>
              </div>
              {/* Inspector */}
              <div className="sm:col-span-3">
                <Label
                  name="inspectorId"
                  className="block text-sm font-medium text-gray-200"
                >
                  Inspector*
                </Label>
                <div className="mt-2">
                  {/* <UsersCell currentUserId={currentUser.id} /> */}
                  <FieldError
                    name="inspectorId"
                    className="mt-1 text-red-500"
                  />
                </div>
              </div>
              {/* Date */}
              <div className="sm:col-span-2">
                <Label
                  name="date"
                  className="block text-sm font-medium text-gray-200"
                >
                  Date*
                </Label>
                <div className="mt-2">
                  <DateField
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                    validation={{ required: true }}
                  />
                  <FieldError name="date" className="mt-1 text-red-500" />
                </div>
              </div>
              {/* Start Time */}
              <div className="sm:col-span-2">
                <Label
                  name="startTime"
                  className="block text-sm font-medium text-gray-200"
                >
                  Start Time*
                </Label>
                <div className="mt-2">
                  <TimeField
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                    validation={{ required: true }}
                  />
                  <FieldError name="startTime" className="mt-1 text-red-500" />
                </div>
              </div>
              {/* End Time */}
              <div className="sm:col-span-2">
                <Label
                  name="endTime"
                  className="block text-sm font-medium text-gray-200"
                >
                  End Time*
                </Label>
                <div className="mt-2">
                  <TimeField
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                    validation={{ required: true }}
                  />
                  <FieldError name="endTime" className="mt-1 text-red-500" />
                </div>
              </div>
              {/* Whom To Contact */}
              <div className="sm:col-span-3">
                <Label
                  name="whomToContact"
                  className="block text-sm font-medium text-gray-200"
                >
                  Whom To Contact
                </Label>
                <div className="mt-2">
                  <TextField
                    name="whomToContact"
                    value={formData.whomToContact}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              {/* Title */}
              <div className="sm:col-span-6">
                <Label
                  name="title"
                  className="block text-sm font-medium text-gray-200"
                >
                  Title*
                </Label>
                <div className="mt-2">
                  <TextField
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                    validation={{ required: true }}
                  />
                  <FieldError name="title" className="mt-1 text-red-500" />
                </div>
              </div>
              {/* Description */}
              <div className="sm:col-span-6">
                <Label
                  name="description"
                  className="block text-sm font-medium text-gray-200"
                >
                  Description*
                </Label>
                <div className="mt-2">
                  <TextAreaField
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                    validation={{ required: true }}
                  />
                  <FieldError
                    name="description"
                    className="mt-1 text-red-500"
                  />
                </div>
              </div>
              {/* Inspection Type */}
              <div className="sm:col-span-3">
                <Label
                  name="inspectionType"
                  className="block text-sm font-medium text-gray-200"
                >
                  Inspection Type*
                </Label>
                <div className="mt-2">
                  <SelectField
                    name="inspectionType"
                    value={formData.inspectionType}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                    validation={{ required: true }}
                  >
                    <option value="PRE_STORM">Pre Storm</option>
                    <option value="DURING_STORM">During Storm</option>
                    <option value="POST_STORM">Post Storm</option>
                    <option value="REGULAR">Regular</option>
                  </SelectField>
                  <FieldError
                    name="inspectionType"
                    className="mt-1 text-red-500"
                  />
                </div>
              </div>
              {/* Severity */}
              <div className="sm:col-span-3">
                <Label
                  name="severity"
                  className="block text-sm font-medium text-gray-200"
                >
                  Severity*
                </Label>
                <div className="mt-2">
                  <SelectField
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                    validation={{ required: true }}
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </SelectField>
                  <FieldError name="severity" className="mt-1 text-red-500" />
                </div>
              </div>
              {/* Checkboxes */}
              <div className="sm:col-span-3">
                <Label
                  name="permitOnSite"
                  className="block text-sm font-medium text-gray-200"
                >
                  Permit on Site
                </Label>
                <div className="mt-2">
                  <CheckboxField
                    name="permitOnSite"
                    checked={formData.permitOnSite}
                    onChange={handleChange}
                    className="checkbox-field"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Label
                  name="swpppOnSite"
                  className="block text-sm font-medium text-gray-200"
                >
                  SWPPP on Site
                </Label>
                <div className="mt-2">
                  <CheckboxField
                    name="swpppOnSite"
                    checked={formData.swpppOnSite}
                    onChange={handleChange}
                    className="checkbox-field"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Label
                  name="bmpsInstalledPerSwppp"
                  className="block text-sm font-medium text-gray-200"
                >
                  BMPs Installed per SWPPP
                </Label>
                <div className="mt-2">
                  <CheckboxField
                    name="bmpsInstalledPerSwppp"
                    checked={formData.bmpsInstalledPerSwppp}
                    onChange={handleChange}
                    className="checkbox-field"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Label
                  name="siteInspectionReports"
                  className="block text-sm font-medium text-gray-200"
                >
                  Site Inspection Reports
                </Label>
                <div className="mt-2">
                  <CheckboxField
                    name="siteInspectionReports"
                    checked={formData.siteInspectionReports}
                    onChange={handleChange}
                    className="checkbox-field"
                  />
                </div>
              </div>
              {/* Violations/Notes */}
              <div className="sm:col-span-6">
                <Label
                  name="violationsNotes"
                  className="block text-sm font-medium text-gray-200"
                >
                  Violations/Notes
                </Label>
                <div className="mt-2">
                  <TextAreaField
                    name="violationsNotes"
                    value={formData.violationsNotes}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Weather Information */}
          <div className="border-b border-gray-700 pb-12">
            <h2 className="text-2xl font-bold text-gray-100">
              Weather Information
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Please fill out the weather details.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-6">
              {/* Weather at time */}
              <div className="sm:col-span-4">
                <Label
                  name="weatherAtTime"
                  className="block text-sm font-medium text-gray-200"
                >
                  Weather at time of inspection*
                </Label>
                <div className="mt-2">
                  <SelectField
                    name="weatherAtTime"
                    value={formData.weatherAtTime}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                    validation={{ required: true }}
                  >
                    <option value="CLEAR">Clear</option>
                    <option value="CLOUDY">Cloudy</option>
                    <option value="FOG">Fog</option>
                    <option value="HIGH_WINDS">High Winds</option>
                    <option value="RAIN">Rain</option>
                    <option value="SLEET">Sleet</option>
                    <option value="SNOWING">Snowing</option>
                    <option value="OTHER">Other</option>
                  </SelectField>
                  <FieldError
                    name="weatherAtTime"
                    className="mt-1 text-red-500"
                  />
                </div>
              </div>
              {/* Temperature */}
              <div className="sm:col-span-2">
                <Label
                  name="temperature"
                  className="block text-sm font-medium text-gray-200"
                >
                  Temperature
                </Label>
                <div className="mt-2">
                  <TextField
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              {/* New Storm Event */}
              <div className="sm:col-span-6">
                <Label
                  name="newStormEvent"
                  className="block text-sm font-medium text-gray-200"
                >
                  Has there been a storm event since the last inspection?
                </Label>
                <div className="mt-2">
                  <CheckboxField
                    name="newStormEvent"
                    checked={formData.newStormEvent}
                    onChange={handleChange}
                    className="checkbox-field"
                  />
                </div>
              </div>
              {/* Storm Date-Time */}
              <div className="sm:col-span-3">
                <Label
                  name="stormDateTime"
                  className="block text-sm font-medium text-gray-200"
                >
                  Storm Date-Time
                </Label>
                <div className="mt-2">
                  <DatetimeLocalField
                    name="stormDateTime"
                    value={formData.stormDateTime}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              {/* Storm Duration */}
              <div className="sm:col-span-3">
                <Label
                  name="stormDuration"
                  className="block text-sm font-medium text-gray-200"
                >
                  Storm Duration
                </Label>
                <div className="mt-2">
                  <TextField
                    name="stormDuration"
                    value={formData.stormDuration}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              {/* Approximate Precipitation */}
              <div className="sm:col-span-3">
                <Label
                  name="approximatePrecipitation"
                  className="block text-sm font-medium text-gray-200"
                >
                  Approximate Precipitation (in.)
                </Label>
                <div className="mt-2">
                  <TextField
                    name="approximatePrecipitation"
                    value={formData.approximatePrecipitation}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              {/* Discharge Information */}
              <div className="sm:col-span-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      name="previousDischarge"
                      className="block text-sm font-medium text-gray-200"
                    >
                      Previous Discharge
                    </Label>
                    <CheckboxField
                      name="previousDischarge"
                      checked={formData.previousDischarge}
                      onChange={handleChange}
                      className="checkbox-field"
                    />
                  </div>
                  <div>
                    <Label
                      name="newDischarges"
                      className="block text-sm font-medium text-gray-200"
                    >
                      New Discharges
                    </Label>
                    <CheckboxField
                      name="newDischarges"
                      checked={formData.newDischarges}
                      onChange={handleChange}
                      className="checkbox-field"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      name="dischargeAtThisTime"
                      className="block text-sm font-medium text-gray-200"
                    >
                      Discharge at This Time
                    </Label>
                    <CheckboxField
                      name="dischargeAtThisTime"
                      checked={formData.dischargeAtThisTime}
                      onChange={handleChange}
                      className="checkbox-field"
                    />
                  </div>
                  <div>
                    <Label
                      name="currentDischarges"
                      className="block text-sm font-medium text-gray-200"
                    >
                      Current Discharges
                    </Label>
                    <CheckboxField
                      name="currentDischarges"
                      checked={formData.currentDischarges}
                      onChange={handleChange}
                      className="checkbox-field"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BMP Section */}
          <div className="border-b border-gray-700 pb-12">
            <h2 className="text-2xl font-bold text-gray-100">Standard BMPs</h2>
            <p className="mt-2 text-sm text-gray-400">
              Review and update the standard BMPs.
            </p>
            <BmpsCell isStandard={true} />
          </div>

          {formData.siteId && (
            <div className="border-b border-gray-700 pb-12">
              <h2 className="text-2xl font-bold text-gray-100">Site BMPs</h2>
              <p className="mt-2 text-sm text-gray-400">
                Review and update the site-specific BMPs.
              </p>
              <BmpsCell
                isStandard={false}
                siteId={parseInt(formData.siteId, 10)}
              />
            </div>
          )}

          {/* Media Upload Section */}
          <CloudinaryUploadWidget uwConfig={uwConfig} addMedia={addMedia} />

          <div className="mt-8">
            <Label
              name="media"
              className="block text-sm font-medium text-gray-200"
            >
              Uploaded Images
            </Label>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {media.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-gray-900 p-4 shadow-inner"
                >
                  <img
                    src={item.url}
                    alt={`Uploaded ${item.original_filename}`}
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                  <TextField
                    name={`media-description-${index}`}
                    value={item.description}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    placeholder="Enter description"
                    className="input-field mt-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-12 flex justify-end">
            <Submit
              disabled={loading}
              className="rounded-md bg-indigo-600 px-6 py-2 font-semibold text-gray-100 hover:bg-indigo-500"
            >
              Save Inspection
            </Submit>
          </div>

          {error && <div className="mt-4 text-red-500">{error.message}</div>}
        </div>
      </Form>

      {selectedImage && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <button
              className="close"
              onClick={() => setSelectedImage(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedImage(null)
                }
              }}
              tabIndex={0}
              aria-label="Close"
            >
              &times;
            </button>
            <img src={selectedImage} alt="Full size" />
          </div>
        </div>
      )}

      <style>{`
        .modal {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgb(0, 0, 0);
          background-color: rgba(0, 0, 0, 0.4);
        }
        .modal-content {
          background-color: #fefefe;
          margin: auto;
          padding: 20px;
          border: 1px solid #888;
          width: 80%;
        }
        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
        }
        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default NewInspectionPage
