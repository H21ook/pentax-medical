import { useState } from 'react'
import ChangePasswordModal from '../change-password'
import ProfileForm from '../profile-form'

const ProfileSettings = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  return (
    <div>
      <h1 className="font-semibold mb-4 mt-2">Хувийн мэдээлэл</h1>
      <ProfileForm
        openPasswordModal={() => {
          setIsOpenModal(true)
        }}
      />
      <ChangePasswordModal
        open={isOpenModal}
        onHide={() => {
          setIsOpenModal(false)
        }}
      />
    </div>
  )
}

export default ProfileSettings
