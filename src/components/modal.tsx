import React, { useCallback, useEffect } from 'react'
import { AnimatePresence, Variants, motion } from 'framer-motion'

type BackdropProps = React.PropsWithChildren<{
  onClick: () => void
}>

const Backdrop: React.FC<BackdropProps> = ({ children, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className="fixed inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  )
}

type ModalProps = React.PropsWithChildren<{
  isOpen: boolean
  onClose: () => void
}>

const dropIn: Variants = {
  hidden: {
    opacity: 0,
    y: -50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 200
    }
  }
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const handleModalClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
    },
    []
  )

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
      {isOpen ? (
        <Backdrop onClick={onClose}>
          <motion.div
            onClick={handleModalClick}
            className="p-6 sm:p-8 mx-4 sm:mx-0 rounded-2xl flex flex-col items-center justify-center bg-white shadow-md"
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {children}
          </motion.div>
        </Backdrop>
      ) : null}
    </AnimatePresence>
  )
}
