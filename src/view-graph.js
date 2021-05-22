import React from 'react'
import Graph from './graph';
import { useWindowDimensions } from './utils.js'

function ViewGraph({ selectedElement, setSelectedElement, graph, setGraph }) {

  const { fullWidth, fullHeight } = useWindowDimensions()
  const width = fullWidth * 0.6
  const height = fullHeight * 1.0

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



  return <Graph width={width} height={height} graph={graph} setSelectedElement={setSelectedElement} />
}

export default ViewGraph
