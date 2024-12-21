import { Button } from '../../ui/Button'
import { RxCross2 } from 'react-icons/rx'
import { useDndMonitor, useDroppable } from '@dnd-kit/core'
import { cn } from '../../../lib/utils'
import DraggableImageTwo from '../../dnd/draggable-image-two'

const ItemImage = ({
  item,
  index,
  onRemove = () => {},
  onUpdate = () => {},
  onMove = () => {}
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `orderIndex-${item.orderIndex}`,
    data: {
      ...item,
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
          if (over.data.current.index === index) {
            onMove(active?.data?.current.fromIndex, over.data.current.index)
          }
        } else {
          onUpdate(over.data.current.index, active?.data?.current?.path)
        }
      }
    }
  })

  return (
    <div
      className={cn(
        'max-w-[200px] bg-black/50 rounded-md overflow-hidden transition-all duration-100',
        isOver ? 'border-2 border-primary' : 'border'
      )}
    >
      <div className="w-full p-1 flex items-center bg-white gap-2">
        <div className="flex-1 flex items-center gap-1">
          <div className="font-bold leading-none text-white text-xs size-5 rounded-full bg-primary flex items-center justify-center">
            {item.orderIndex}
          </div>
          <p className="flex-grow text-xs truncate whitespace-nowrap w-[134px]">{item.name}</p>
        </div>
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
        {item?.path ? <DraggableImageTwo item={item} index={index} /> : <div></div>}
      </div>
    </div>
  )
}
const ImagesComponent = ({ images = [], removeItem, updateItem, moveItem }) => {
  return (
    <div className="w-fit grid lg:grid-cols-4 gap-1 xl:gap-4 ">
      {images.map((item, index) => {
        return (
          <ItemImage
            key={`image_${index}`}
            item={item}
            index={index}
            onRemove={removeItem}
            onUpdate={updateItem}
            onMove={moveItem}
          />
        )
      })}
    </div>
  )
}

export default ImagesComponent
