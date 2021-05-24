import React from 'react'
import Graph from './graph';
import { useWindowDimensions } from './utils.js'
import { ParentSize } from '@visx/responsive'

function ViewGraph({ selectedElement, setSelectedElement, graph, updateGraph, newPoint, setNewPoint, setEditMode }) {

  return <ParentSize>
    {({ width: visWidth, height: visHeight }) => (
      <Graph width={visWidth} height={visHeight} graph={graph} updateGraph={updateGraph} selectedElement={selectedElement} setSelectedElement={setSelectedElement} newPoint={newPoint} setNewPoint={setNewPoint} setEditMode={setEditMode} />
    )}
  </ParentSize>
}

export default ViewGraph
