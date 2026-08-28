import { useEffect, useState } from 'react'

interface ToastMessage {
  id: number
  text: string
  tone: 'success' | 'error'
}

type Listener = (toasts: ToastMessage[]) => void

let toasts: ToastMessage[] = []
let nextId = 1
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((listener) => {
    listener(toasts)
  })
}

/** Fire-and-forget trigger usable from anywhere (mutation callbacks, event handlers) without a hook. */
// eslint-disable-next-line react-refresh/only-export-components -- intentionally paired with <Toaster>, not a component
export function showToast(text: string, tone: ToastMessage['tone'] = 'success') {
  const id = nextId++
  toasts = [...toasts, { id, text, tone }]
  emit()
  setTimeout(() => {
    toasts = toasts.filter((toast) => toast.id !== id)
    emit()
  }, 4000)
}

export function Toaster() {
  const [visible, setVisible] = useState<ToastMessage[]>(toasts)

  useEffect(() => {
    listeners.add(setVisible)
    return () => {
      listeners.delete(setVisible)
    }
  }, [])

  if (visible.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {visible.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`rounded-md px-4 py-2 text-sm text-white shadow-lg ${
            toast.tone === 'error' ? 'bg-red-600' : 'bg-navy-900'
          }`}
        >
          {toast.text}
        </div>
      ))}
    </div>
  )
}
