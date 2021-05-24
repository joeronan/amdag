import React, { useState } from 'react';
import './app.css';
import Split from 'react-split';
import Graph from './graph';
import ViewPanel from './view-panel'
import { ParentSize } from '@visx/responsive'

function App() {

  const [graph, setGraph] = React.useState([])
  const [selectedElement, setSelectedElement] = React.useState(-1)
  const [newPoint, setNewPoint] = useState({ active: false, x: 0, y: 0 })
  const [editMode, setEditMode] = React.useState(false)

  const updateGraph = () => {
    fetch('/graph', { method: 'GET' }).then(res => {
      return (res.json())
    }).then(data => {
      setGraph(data.elements)
    })
  }

  React.useEffect(updateGraph, [setGraph])

  return (
    <div className="App">
      <Split className="split" gutterSize={3} sizes={[40, 60]}>
        <div style={{
          padding: '0px 20px 0px 20px',
          maxHeight: '100vh',
          overflowY: 'auto'
        }}>
          <ViewPanel graph={graph} updateGraph={updateGraph} selectedElement={selectedElement} setSelectedElement={setSelectedElement} newPoint={newPoint} setNewPoint={setNewPoint} editMode={editMode} setEditMode={setEditMode} />
        </div>

        <div style={{
          height: '100vh',
          overflow: 'hidden',
        }}>
          <ParentSize>
            {({ width: visWidth, height: visHeight }) => (
              <Graph width={visWidth} height={visHeight} graph={graph} updateGraph={updateGraph} selectedElement={selectedElement} setSelectedElement={setSelectedElement} newPoint={newPoint} setNewPoint={setNewPoint} setEditMode={setEditMode} />
            )}
          </ParentSize>
        </div>
      </Split>
    </div>
  );
}

export default App;
