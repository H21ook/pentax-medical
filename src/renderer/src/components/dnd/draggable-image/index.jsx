import { useDraggable } from '@dnd-kit/core'
import { cn } from '../../../lib/utils'
import { Button } from '../../ui/Button'
import { RxCross2 } from 'react-icons/rx'

const DraggableImage = ({ item, index, deletable = true, onRemove = () => {} }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable_${index}`,
    data: {
      index,
      order: index + 1,
      ...item
    }
  })

  return (
    <div
      className={cn(
        'rounded-md overflow-hidden',
        isDragging ? 'border-2 border-primary' : 'border'
      )}
    >
      <div className="p-1 flex items-center justify-between">
        <div
          className={cn(
            'size-5 flex items-center justify-center bg-white text-xs text-black font-bold rounded-sm'
          )}
        >
          {index + 1}
        </div>
        {deletable && (
          <Button
            size="icon"
            variant="secondary"
            className="size-5"
            onClick={() => onRemove(index)}
          >
            <RxCross2 />
          </Button>
        )}
      </div>
      <div
        ref={setNodeRef}
        className={cn('relative overflow-hidden')}
        {...listeners}
        {...attributes}
      >
        <img src={item.path} alt={`image_${index}`} className="w-full bg-black/50 object-cover" />
      </div>
    </div>
  )
}

export default DraggableImage
