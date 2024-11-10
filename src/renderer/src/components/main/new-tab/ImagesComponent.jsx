import { Button } from '../../ui/Button'
import { RxCross2 } from 'react-icons/rx'
import { LuFileImage } from 'react-icons/lu'

const ImagesComponent = ({ images = [], removeItem, updateItem, swapItems }) => {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
      {images.map((item, index) => {
        if (item?.path) {
          return (
            <div
              key={`image_${index}`}
              className="w-full bg-black/50 rounded-md border overflow-hidden"
            >
              <div className="w-full p-2 flex items-center justify-between bg-white">
                <div>{item.name}</div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-6 w-6 rounded-full"
                  onClick={() => removeItem(index)}
                >
                  <RxCross2 />
                </Button>
              </div>
              <img
                src={item.path}
                alt={`image_${index}`}
                className="w-full bg-black/50 object-contain"
              />
            </div>
          )
        }
        return (
          <div
            key={`image_${index}`}
            className="w-full bg-black/50 rounded-md overflow-hidden border"
          >
            <div className="w-full p-2 flex items-center justify-between bg-white">
              <div>{item.name}</div>
            </div>
            <div className="w-full aspect-video bg-black/50 flex items-center justify-center">
              <button
                type="button"
                className="border rounded-lg flex gap-2 p-2 text-white items-center hover:bg-black/20"
                onClick={async () => {
                  const latestSelectPath = localStorage.getItem('latestFilePath')
                  const selectedFile = await window.electron.ipcRenderer.invoke('dialog:openFile', {
                    path: latestSelectPath,
                    filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png'] }]
                  })
                  localStorage.setItem('latestFilePath', selectedFile.folder)

                  updateItem(index, selectedFile.path)
                }}
              >
                <LuFileImage className="text-white" /> Файл сонгох
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ImagesComponent
