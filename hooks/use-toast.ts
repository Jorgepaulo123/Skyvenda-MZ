import * as React from "react"

// Basic toast types
export type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  duration?: number
  variant?: "default" | "destructive"
}

export type Toast = ToastProps & {
  open: boolean
}

type ToastInput = Omit<ToastProps, "id" | "open"> & { id?: string }

type ToastState = {
  toasts: Toast[]
}

type ToastListeners = Set<(state: ToastState) => void>

let count = 0
const genId = () => `toast-${++count}`

const state: ToastState = {
  toasts: []
}

const listeners: ToastListeners = new Set()

function setState(nextState: Partial<ToastState>) {
  Object.assign(state, nextState)
  listeners.forEach((l) => l(state))
}

export function toast(input: ToastInput) {
  const id = input.id ?? genId()
  const t: Toast = {
    id,
    title: input.title,
    description: input.description,
    action: input.action,
    duration: input.duration ?? 3000,
    variant: input.variant ?? "default",
    open: true,
  }
  setState({ toasts: [...state.toasts, t] })
  if (t.duration && t.duration > 0) {
    setTimeout(() => dismiss(id), t.duration)
  }
  return {
    id,
    dismiss: () => dismiss(id)
  }
}

export function dismiss(id?: string) {
  if (!id) {
    setState({ toasts: state.toasts.map((t) => ({ ...t, open: false })) })
    setTimeout(() => setState({ toasts: [] }), 200)
    return
  }
  setState({ toasts: state.toasts.map((t) => t.id === id ? { ...t, open: false } : t) })
  setTimeout(() => setState({ toasts: state.toasts.filter((t) => t.id !== id) }), 200)
}

export function useToast() {
  const [s, setS] = React.useState<ToastState>(state)

  React.useEffect(() => {
    listeners.add(setS)
    return () => void listeners.delete(setS)
  }, [])

  return {
    // state
    toasts: s.toasts,
    // actions
    toast,
    dismiss,
  }
}
