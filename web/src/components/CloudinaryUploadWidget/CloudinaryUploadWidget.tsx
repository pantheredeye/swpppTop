import { createContext, useEffect, useState } from 'react'

// Extend the window interface to include cloudinary
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        config: object,
        callback: (
          error: Error | null,
          result: { event: string; info: unknown }
        ) => void
      ) => { open: () => void }
    }
  }
}

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext(null)

function CloudinaryUploadWidget({ uwConfig, addMedia }) {
  const [loaded, setLoaded] = useState(false)
  const [widget, setWidget] = useState(null)

  useEffect(() => {
    if (!loaded) {
      const uwScript = document.getElementById('uw')
      if (!uwScript) {
        const script = document.createElement('script')
        script.setAttribute('async', '')
        script.setAttribute('id', 'uw')
        script.src = 'https://upload-widget.cloudinary.com/global/all.js'
        script.addEventListener('load', () => setLoaded(true))
        document.body.appendChild(script)
      } else {
        setLoaded(true)
      }
    }
  }, [loaded])

  useEffect(() => {
    if (loaded && !widget) {
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === 'success') {
            console.log('Done! Here is the image info: ', result.info)
            addMedia(result.info)
          }
        }
      )
      setWidget(myWidget)
    }
  }, [loaded, widget, uwConfig, addMedia])

  const openWidget = (e) => {
    e.preventDefault()
    if (widget) {
      widget.open()
    }
  }

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        className="cloudinary-button"
        onClick={openWidget}
      >
        Upload
      </button>
    </CloudinaryScriptContext.Provider>
  )
}

export default CloudinaryUploadWidget
export { CloudinaryScriptContext }
