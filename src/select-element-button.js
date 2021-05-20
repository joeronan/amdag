import React from 'react'

function SelectElementButton({ element, selectedElement, setSelectedElement }) {
  return (
    <button
      onClick={() => {
        setSelectedElement(element)
      }}
    >
      S
    </button>
  )
}

export default SelectElementButton
