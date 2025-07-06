import * as HeroIcons from '@heroicons/react/24/outline'

import { Link, routes } from '@cedarjs/router'

import background from './Daytime Background.png'

const features = [
  {
    id: 1,
    icon: 'ClipboardDocumentCheckIcon',
    title: 'Digital Inspections',
    description:
      'Quickly enter inspection reports from your phone, ensuring accurate and timely data.',
  },
  {
    id: 2,
    icon: 'MapPinIcon',
    title: 'GPS Tagging',
    description:
      'Automatically tag inspection locations with GPS for precise tracking and accountability.',
  },
  {
    id: 3,
    icon: 'PhotoIcon',
    title: 'Photo Upload',
    description:
      'Capture and upload site images directly into your inspection reports for comprehensive documentation.',
  },
  {
    id: 4,
    icon: 'BellIcon',
    title: 'Real-Time Notifications',
    description:
      'Receive instant alerts for overdue inspections and corrective actions.',
  },
]

const futureFeatures = [
  {
    id: 1,
    icon: 'ChatBubbleBottomCenterTextIcon',
    title: 'Developer Communication',
    description:
      'Seamlessly communicate with developers, tracking compliance updates and corrective actions.',
  },
  {
    id: 2,
    icon: 'CloudIcon',
    title: 'Weather Impact Tracking',
    description:
      'Overlay inspections with weather data to assess environmental impacts on compliance.',
  },
  {
    id: 3,
    icon: 'UsersIcon',
    title: 'Team Management',
    description:
      'Coordinate inspections across teams, assign tasks, and monitor compliance efforts.',
  },
  {
    id: 4,
    icon: 'BookOpenIcon',
    title: 'Terminology Glossary',
    description:
      'A built-in glossary for onboarding new inspectors with stormwater terminology.',
  },
]

const HomePage = () => {
  const IconRenderer = ({ iconName }) => {
    const IconComponent = HeroIcons[iconName]
    return IconComponent ? (
      <IconComponent className="mx-auto h-12 w-12 text-indigo-500" />
    ) : null
  }

  return (
    <>
      <div className="relative min-h-screen bg-gray-900">
        <img
          src={background}
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4 p-8 text-center">
          <h1 className="text-4xl font-semibold text-gray-200">
            Effortless Compliance, Today and Tomorrow
          </h1>
          <p className="text-lg text-black-900">
            Track stormwater inspections with ease and prepare for a new level
            of communication
          </p>

          <Link
            to={routes.signup()}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-lg font-medium text-white shadow-lg hover:bg-indigo-500 focus:outline-none"
          >
            Get Started Today
          </Link>
        </div>
      </div>

      <div className="py-16 px-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-200">
          Ready for Your Next Inspection
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="rounded-xl bg-gray-800 p-6 shadow-lg"
            >
              <IconRenderer iconName={feature.icon} />
              <h3 className="mt-4 text-xl font-semibold text-gray-200">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-16 px-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-200">
          The Future of Compliance is Connected
        </h2>
        <div className="mt-8 flex space-x-4 overflow-x-auto">
          {futureFeatures.map((feature) => (
            <div
              key={feature.id}
              className="min-w-[200px] rounded-xl bg-gray-800 p-6 shadow-lg"
            >
              <IconRenderer iconName={feature.icon} />
              <h3 className="mt-4 text-lg font-semibold text-gray-200">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-16 px-4 text-center bg-gray-800 rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-200">
          What Inspectors Are Saying
        </h2>
        <p className="mt-4 italic text-gray-400">
          &quot;This app makes stormwater inspections easier than ever!&quot; -
          Placeholder Quote
        </p>
      </div>

      <div className="py-16 px-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-200">
          Ready to Start Your Compliance Journey?
        </h2>
        <div className="mt-6 flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <Link
            to={routes.signup()}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg hover:bg-indigo-500"
          >
            Get Started Today
          </Link>

          <button className="rounded-xl bg-gray-700 px-6 py-3 font-medium text-white shadow-lg hover:bg-gray-600">
            Learn More About Future Features
          </button>
        </div>
      </div>
    </>
  )
}

export default HomePage
