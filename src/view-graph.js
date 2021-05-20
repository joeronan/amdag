import React from 'react'
import SelectElementButton from './select-element-button'

function ViewGraph({ selectedElement, setSelectedElement }) {

  const [graph, setGraph] = React.useState([])

  const updateGraph = () => {
    fetch('/graph', { method: 'GET' }).then(res => {
      return (res.json())
    }).then(data => {
      setGraph(data.elements)
    })
  }

  React.useEffect(updateGraph, [])

  return (
    <ul>
      {graph.map(element =>
        <li key={element.id}>
          {element.id}: {element.content} {element.parents}
          <button onClick={
            async e => {
              const entry = { id: element.id }
              const response = await fetch('/element', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(entry)
              })

              if (response.ok) {
                console.log('Deleted!')
                setGraph(graph.filter(x => x.id !== element.id))
              }
            }}>X</button>
          <SelectElementButton element={element.id} selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
        </li>)}
    </ul>
  )
}

export default ViewGraph
