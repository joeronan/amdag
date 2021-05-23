import React, { useState } from 'react';
import './App.css';
import ViewGraph from './view-graph';
import ViewIntervals from './view-intervals';
import ViewAdjacent from './view-adjacent';

function App() {

  const [viewType, setViewType] = React.useState('graph')
  const [graph, setGraph] = React.useState([])
  const [selectedElement, setSelectedElement] = React.useState(1)
  const [newContent, setNewContent] = React.useState('')
  const [newHeader, setNewHeader] = React.useState('')
  const [newPoint, setNewPoint] = useState({ active: false, x: 0, y: 0 })
  const [editMode, setEditMode] = React.useState(false)

  React.useEffect(() => {
    setNewContent('')
    setNewHeader('')
  }, [newPoint])


  const handleViewType = () => {
    switch (viewType) {
      case 'graph':
        return <ViewGraph selectedElement={selectedElement} setSelectedElement={setSelectedElement} graph={graph} setGraph={setGraph} newPoint={newPoint} setNewPoint={setNewPoint} setEditMode={setEditMode} />

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
      <div style={{
        width: 'calc(40vw - 40px)',
        position: 'absolute',
        left: 0,
        padding: '20px 20px 20px 20px',
        overflowY: 'auto'
      }}>


        <button onClick={() => { setViewType('graph') }}>Graph</button>
        <button onClick={() => { setViewType('intervals') }}>Intervals</button>
        <button onClick={() => { setViewType('adjacent') }}>Adjacent</button>

        {selectedElement && graph.filter((element) => element.id === selectedElement).map((element) => {
          if (!editMode) {
            return <>
              <p>{element.header} </p>
              <p>ID: {element.id} </p>
              <p>Created: {element.date_created} </p>
              <p>Last Edited: {element.date_edited} </p>
              <p>{element.content}</p>
              <p>Edit: <button onClick={() => {
                setEditMode(!editMode)
                setNewHeader(element.header)
                setNewContent(element.content)
              }}>E</button></p>
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
                  .then(response => (response.json()))
                  .then(data => { setSelectedElement(data.id) })

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
                    setGraph(graph.filter(x => x.id !== element.id).map(x => x.parents.filter(y => y !== element.id)))
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
              .then(response => (response.json()))
              .then(data => { setSelectedElement(data.id) })

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
        width: '60vw',
        height: '100vh',
        position: 'absolute',
        right: 0,
        overflow: 'hidden',
        borderLeft: '3px solid black'
      }}>
        {handleViewType()}
      </div>
    </div>
  );
}

export default App;
