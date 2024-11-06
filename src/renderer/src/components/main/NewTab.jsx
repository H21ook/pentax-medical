import { useState } from 'react'
import GeneralInformation from './new-tab/GeneralInformation'
import MediaInformation from './new-tab/MediaInformation'

const NewTab = () => {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <div className="space-y-6 px-2">
      {currentStep === 2 ? (
        <MediaInformation />
      ) : (
        <GeneralInformation
          nextStep={() => {
            setCurrentStep(2)
          }}
        />
      )}
    </div>
  )
}

export default NewTab
