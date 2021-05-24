import React from 'react'
import Graph from './graph';
import { useWindowDimensions } from './utils.js'

function ViewGraph({ selectedElement, setSelectedElement, graph, updateGraph, newPoint, setNewPoint, setEditMode }) {

  const { fullWidth, fullHeight } = useWindowDimensions()
  const width = fullWidth * 0.6
  const height = fullHeight * 1.0

  return <Graph width={width} height={height} graph={graph} updateGraph={updateGraph} selectedElement={selectedElement} setSelectedElement={setSelectedElement} newPoint={newPoint} setNewPoint={setNewPoint} setEditMode={setEditMode} />
}

export default ViewGraph
