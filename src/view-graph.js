import React from 'react'
import SelectElementButton from './select-element-button'
import Graph from './graph';

function ViewGraph({ selectedElement, setSelectedElement }) {

  const width = 800
  const height = 800

  const [graph, setGraph] = React.useState([])

  const updateGraph = () => {
    fetch('/graph', { method: 'GET' }).then(res => {
      return (res.json())
    }).then(data => {
      data.elements.forEach(element => {
        element['x'] = Math.random() * width * 0.6 + width * 0.2
        element['y'] = Math.random() * height * 0.6 + height * 0.2
      });
      setGraph(data.elements)
    })
  }

  React.useEffect(updateGraph, [])



  return (
    <>
      {graph.filter((element) => element.id === selectedElement).map((element) => {
        return <div>
          <p>ID: {element.id} </p>
          <p>Created: {element.date_created} </p>
          <p>Last Edited: {element.date_edited} </p>
          <p>{element.content}</p>
          <p>Delete: <button onClick={
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
            }}>X</button></p>
        </div>
      })}

      <Graph width={width} height={height} graph={graph} setSelectedElement={setSelectedElement} />
    </>
  )
}

export default ViewGraph
