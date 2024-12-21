import { DragOverlay, useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'

const DraggableOverlay = () => {
  const [activeItem, setActiveItem] = useState()

  useDndMonitor({
    onDragStart: (item) => {
      setActiveItem(item?.active?.data?.current)
    },
    onDragEnd: () => {
      setActiveItem(undefined)
    },
    onDragCancel: () => {
      setActiveItem(undefined)
    }
  })

  if (!activeItem) {
    return null
  }

  return (
    <DragOverlay>
      <div className="relative border rounded-md overflow-hidden">
        <img
          src={activeItem?.path}
          alt={`image_${activeItem?.index}`}
          className="w-full bg-black/50 object-cover"
        />
        {!activeItem?.orderIndex && (
          <div className="absolute top-0 left-0 size-5 flex items-center justify-center bg-white text-xs text-black font-bold">
            {activeItem?.order}
          </div>
        )}
      </div>
    </DragOverlay>
  )
}

export default DraggableOverlay
