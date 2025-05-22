"use client"

import { useState } from "react"
import AddTokenModal from "./Add-Token-Modal"

export default function ModalButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <button
        onClick={openModal}
        className="cursor-pointer border-2 border-indigo-700 hover:bg-transparent font-semibold hover:text-indigo-700 bg-indigo-700 text-white px-4 py-2 text-center rounded-3xl"
      >
        ADD CREDIT TOKENS
      </button>
      <AddTokenModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}
