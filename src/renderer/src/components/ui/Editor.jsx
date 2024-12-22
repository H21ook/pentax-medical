import JoditEditor from 'jodit-react'
import { useRef } from 'react'

const Editor = ({ id, name, placeholder = 'Энд тэкст бичнэ', value, onChange = () => {} }) => {
  const editorRef = useRef(null)

  const handleChangeContent = (newContent) => {
    const res = removeAttributesFromHtml(newContent)
    if (res !== '<p><br></p>') {
      onChange(res)
    } else {
      onChange('')
    }
  }

  const removeAttributesFromHtml = (htmlString) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')

    doc.body.querySelectorAll('*').forEach((element) => {
      Array.from(element.attributes).forEach((attr) => {
        element.removeAttribute(attr.name)
      })
    })

    return doc.body.innerHTML
  }

  const config = {
    placeholder: placeholder,
    readonly: false,
    buttons: ['bold', 'italic', 'underline', '|', 'align', 'undo', 'redo'],
    removeButtons: ['br'],
    toolbarAdaptive: false,
    toolbarSticky: false,
    addNewLine: false,
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    containerStyle: {
      border: 'none'
    },
    askBeforePasteFromWord: false,
    askBeforePasteHTML: false,
    style: {
      fontFamily: 'Inter, sans-serif', // Backup font family for non-Tailwind environments
      fontSize: '14px'
    },
    clipboard: {
      enable: true // Enable clipboard support
    },
    allowClipboard: true,
    events: {
      paste: (event) => {
        const pastedContent =
          event.clipboardData.getData('text/html') || event.clipboardData.getData('text/plain')
        const res = removeAttributesFromHtml(pastedContent)
        onChange(res)
      }
    }
  }
  return (
    <div className="w-full rounded-md border border-input bg-body shadow-sm overflow-hidden text-sm">
      <JoditEditor
        ref={editorRef}
        value={value}
        name={name}
        onBlur={(newContent) => handleChangeContent(newContent)}
        id={id}
        config={config}
      />
    </div>
  )
}

export default Editor
