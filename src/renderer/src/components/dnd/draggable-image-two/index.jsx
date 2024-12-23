import { useDraggable } from '@dnd-kit/core'
import { cn } from '../../../lib/utils'

const DraggableImageTwo = ({ item, index }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `placed_${index}`,
    data: {
      ...item,
      fromIndex: index,
      type: 'move'
    }
  })

  return (
    <div
      className={cn(
        'overflow-hidden',
        isDragging ? 'border-2 border-primary rounded-md' : 'border'
      )}
    >
      <div
        ref={setNodeRef}
        className={cn('relative overflow-hidden')}
        {...listeners}
        {...attributes}
      >
        <img
          src={item.path}
          alt={`image_placed_${index}`}
          className={cn('aspect-[4/2.5] bg-black/50 object-cover')}
        />
      </div>
    </div>
  )
}

export default DraggableImageTwo
