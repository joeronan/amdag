import React, { useState } from 'react';
import './App.css';
import ViewGraph from './view-graph';
import ViewIntervals from './view-intervals';
import ViewAdjacent from './view-adjacent';
import Split from 'react-split';

function App() {

  const [viewType, setViewType] = React.useState('graph')
  const [graph, setGraph] = React.useState([])
  const [selectedElement, setSelectedElement] = React.useState(-1)
  const [newContent, setNewContent] = React.useState('')
  const [newHeader, setNewHeader] = React.useState('')
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

  React.useEffect(() => {
    setNewContent('')
    setNewHeader('')
  }, [newPoint])

  React.useEffect((e) => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        if (editMode) {
          setEditMode(false)
        } else {
          setSelectedElement(-1)
          setNewPoint({ active: false, x: 0, y: 0 })
        }
      }
    }
    window.addEventListener('keydown', handleEsc);

    return () => { window.removeEventListener('keydown', handleEsc); };
  }, [editMode])

  const handleViewType = () => {
    switch (viewType) {
      case 'graph':
        return <ViewGraph selectedElement={selectedElement} setSelectedElement={setSelectedElement} graph={graph} updateGraph={updateGraph} newPoint={newPoint} setNewPoint={setNewPoint} setEditMode={setEditMode} />

      case 'intervals':
        return <ViewIntervals selectedElement={selectedElement} setSelectedElement={setSelectedElement} />

      case 'adjacent':
        return <ViewAdjacent selectedElement={selectedElement} setSelectedElement={setSelectedElement} />

      default:
        return <div>Invalid viewType</div>
    }
  }

  return (
    <div className="App">
      <Split className="split" gutterSize="3" sizes={[40, 60]}>
        <div style={{
          padding: '20px 20px 20px 20px',
          overflowY: 'auto'
        }}>


          {/* <button onClick={() => { setViewType('graph') }}>Graph</button>
          <button onClick={() => { setViewType('intervals') }}>Intervals</button>
          <button onClick={() => { setViewType('adjacent') }}>Adjacent</button> */}

          {selectedElement < 0 && <>
            <p>Welcome!</p>
            <p>Click on a DAG to select it. Hold CMD and click on empty space to create a new element. With one element selected, CMD click on another to create a new link.</p>
          </>}

          {selectedElement !== 0 && graph.filter((element) => element.id === selectedElement).map((element) => {

            if (!editMode) {
              return <>
                <p>{element.header} </p>
                <p>ID: {element.id} </p>
                <p>Created: {element.date_created} </p>
                <p>Last Edited: {element.date_edited} </p>
                <p dangerouslySetInnerHTML={{ __html: element.content }}></p>
                <p>Edit: <button onClick={() => {
                  setEditMode(!editMode)
                  setNewHeader(element.header)
                  setNewContent(element.content)
                }}>E</button></p>
                <p>Duplicate: <button onClick={() => {
                  const entry = { id: selectedElement, header: element.header, content: element.content, x: element.x + 45, y: element.y, parents: element.parents, children: element.children }
                  fetch('/element', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entry)
                  })
                    .then(response => {
                      if (response.ok) {
                        updateGraph()
                        return response.json()
                      }
                    }).then(data => { if (data) { setSelectedElement(data.id) } else { setSelectedElement(-1) } })

                }}>D</button></p>
              </>
            } else {
              return <>
                <form onSubmit={async e => {
                  e.preventDefault()
                  const entry = { id: selectedElement, header: newHeader, content: newContent }
                  fetch('/element', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entry)
                  })
                    .then(response => { if (response.ok) { updateGraph() } })

                  setEditMode(!editMode)

                  setNewContent('')
                  setNewHeader('')
                  setNewPoint({ active: false, x: 0, y: 0 })
                }}>
                  <p><input className="input-text" type="text" value={newHeader} onChange={e => setNewHeader(e.target.value)} /></p>
                  <p>ID: {element.id} </p>
                  <p>Created: {element.date_created} </p>
                  <p>Last Edited: {element.date_edited} </p>
                  <p><textarea rows="10" value={newContent} onChange={e => setNewContent(e.target.value)} /></p>
                  <p>Save: <input type="submit" value="S" /></p>
                </form>
                <p>Cancel: <button onClick={() => { setEditMode(!editMode) }}>C</button></p>
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
                      updateGraph()
                      setSelectedElement(-1)
                    }
                  }}>X</button></p>
              </>
            }
          })}
          {!selectedElement && <>
            <p>New Element</p>

            <form onSubmit={async e => {
              e.preventDefault()
              const entry = { header: newHeader, content: newContent, x: newPoint.x, y: newPoint.y }
              fetch('/element', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(entry)
              })
                .then(response => {
                  if (response.ok) {
                    updateGraph()
                    return response.json()
                  }
                }).then(data => { if (data) { setSelectedElement(data.id) } else { setSelectedElement(-1) } })

              setNewContent('')
              setNewHeader('')
              setNewPoint({ active: false, x: 0, y: 0 })
            }}>
              <p>Header: <input className="input-text" type="text" value={newHeader} onChange={e => setNewHeader(e.target.value)} /></p>
              <p>Content:<textarea rows="10" value={newContent} onChange={e => setNewContent(e.target.value)} /></p>
              <input type="submit" value="Add Element" />
            </form>
          </>}
        </div>

        <div style={{
          height: '100vh',
          overflow: 'hidden',
        }}>
          {handleViewType()}
        </div>
      </Split>
    </div>
  );
}

export default App;
