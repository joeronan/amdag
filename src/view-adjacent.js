import React from 'react'
import SelectElementButton from './select-element-button'

function ViewAdjacent({ selectedElement, setSelectedElement }) {

  const [subgraph, setSubgraph] = React.useState()

  const updateSubgraph = () => {
    fetch(`/element?id=${selectedElement}`, { method: 'GET' }).then(res => {
      return (res.json())
    }).then(data => {
      setSubgraph(data)
    })
  }

  React.useEffect(updateSubgraph, [selectedElement])

  return (
    <div>
      {subgraph && <>
        <p>Parents: {subgraph.parents.map((parent) => {
          return <>
            {parent} <SelectElementButton element={parent} selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
          </>
        })}</p>
        <p>{subgraph.id}</p>
        <p>Children: {subgraph.children.map((child) => {
          return <>
            {child} <SelectElementButton element={child} selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
          </>
        })}</p>
      </>}
    </div>
  )
}

export default ViewAdjacent
