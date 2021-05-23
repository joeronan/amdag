import React from 'react'
import Graph from './graph';
import { useWindowDimensions } from './utils.js'

function ViewGraph({ selectedElement, setSelectedElement, graph, setGraph, newPoint, setNewPoint, setEditMode }) {

  const { fullWidth, fullHeight } = useWindowDimensions()
  const width = fullWidth * 0.6
  const height = fullHeight * 1.0

  const updateGraph = () => {
    fetch('/graph', { method: 'GET' }).then(res => {
      return (res.json())
    }).then(data => {
      setGraph(data.elements)
    })
  }

  React.useEffect(updateGraph, [])

  return <Graph width={width} height={height} graph={graph} selectedElement={selectedElement} setSelectedElement={setSelectedElement} newPoint={newPoint} setNewPoint={setNewPoint} setEditMode={setEditMode} />
}

export default ViewGraph
