import { Button } from '../../ui/Button'
import { RxCross2 } from 'react-icons/rx'
import { useDndMonitor, useDroppable } from '@dnd-kit/core'
import { cn } from '../../../lib/utils'
import { Select, SelectContent, SelectTrigger, SelectValue } from '../../ui/Select'
import { useState } from 'react'

const ItemImage = ({
  index,
  defaultSlots = [],
  item,
  onRemove = () => {},
  onUpdate = () => {},
  onMove = () => {}
}) => {
  const [selectedSlot, setSelectedSlot] = useState(item?.position)

  const { isOver, setNodeRef } = useDroppable({
    id: `orderIndex-${index}`,
    data: {
      index
    }
  })

  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event
      if (!active || !over) {
        return
      }

      if (over?.data?.current) {
        if (active?.data?.current?.type === 'move') {
          if (over.data.current.index === index && active?.data?.current.fromIndex !== index) {
            onMove(active?.data?.current.fromIndex, over.data.current.index)
          }
        } else {
          if (over.data.current.index === index) {
            const slotData = defaultSlots.find((s) => s.orderIndex === selectedSlot)
            onUpdate(over.data.current.index, {
              path: active?.data?.current?.path,
              position: selectedSlot,
              name: slotData.name,
              imageChanged: true
            })
          }
        }
      }
    }
  })

  return (
    <div
      className={cn(
        'w-[264px] bg-black/50 rounded-md overflow-hidden transition-all duration-100',
        isOver ? 'border-2 border-primary' : 'border'
      )}
    >
      <div className="flex items-center justify-between gap-1 p-1 bg-white">
        <div className="flex-1">
          <Select
            value={selectedSlot}
            onValueChange={(e) => {
              const i = Number(e)
              setSelectedSlot(i)
              const slotData = defaultSlots.find((s) => s.orderIndex === i)
              onUpdate(index, {
                path: item.path,
                position: Number(e),
                name: slotData.name
              })
            }}
          >
            <SelectTrigger
              className={cn(
                'w-full truncate whitespace-nowrap',
                item?.path ? 'w-[224px]' : 'w-full'
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              data={defaultSlots?.map((item) => ({
                value: item?.orderIndex,
                label: `${item?.orderIndex} - ${item?.name}`
              }))}
            />
          </Select>
        </div>
        {/* <div className="flex-1 flex items-center gap-1">
          <div className="font-bold leading-none text-white text-xs size-5 rounded-full bg-primary flex items-center justify-center">
            {item.orderIndex}
          </div>
          <p className="flex-grow text-xs truncate whitespace-nowrap w-[134px]">{item.name}</p>
        </div> */}
        {item?.path && (
          <Button
            size="icon"
            variant="secondary"
            className="size-6 rounded-full"
            onClick={() => onRemove(index)}
          >
            <RxCross2 />
          </Button>
        )}
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'transition-all duration-100 aspect-[4/2.5] bg-black/50 object-cover',
          isOver ? 'opacity-50' : 'opacity-100'
        )}
      >
        {item?.path ? (
          <img
            src={item.path}
            alt={`image_placed_${index}`}
            className={cn('aspect-[4/2.5] bg-black/50 object-cover')}
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}
const ImagesComponent = ({ images = [], defaultSlots = [], removeItem, updateItem, moveItem }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-fit flex flex-wrap gap-1 xl:gap-4 ">
        {images.map((item, index) => {
          return (
            <ItemImage
              key={`image_${index}`}
              defaultSlots={defaultSlots}
              item={item}
              index={index}
              onRemove={removeItem}
              onUpdate={updateItem}
              onMove={moveItem}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ImagesComponent
