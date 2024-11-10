import { useState } from 'react'
import GeneralInformation from './new-tab/GeneralInformation'
import MediaInformation from './new-tab/MediaInformation'
import { useNewData } from '../../context/new-data-context'

const NewTab = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const { newData } = useNewData()

  return (
    <div className="space-y-6 px-2">
      {currentStep === 2 ? (
        <MediaInformation
          key={newData.uuid}
          prevStep={() => {
            setCurrentStep(1)
          }}
        />
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
