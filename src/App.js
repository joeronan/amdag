import React from 'react';
import './App.css';
import ViewGraph from './view-graph';
import ViewIntervals from './view-intervals';
import ViewAdjacent from './view-adjacent';

function App() {

  const [viewType, setViewType] = React.useState('graph')
  const [selectedElement, setSelectedElement] = React.useState(1)
  const [newContent, setNewContent] = React.useState('')
  const [graph, setGraph] = React.useState([])


  const handleViewType = () => {
    switch (viewType) {
      case 'graph':
        return <ViewGraph selectedElement={selectedElement} setSelectedElement={setSelectedElement} graph={graph} setGraph={setGraph} />

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
        width: '40vw',
        position: 'absolute',
        left: 0,
        padding: '20px 20px 20px 20px',
        overflowY: 'auto'
      }}>
        <form onSubmit={async e => {
          e.preventDefault()
          const entry = { content: newContent }
          const response = await fetch('/element', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
          })

          setNewContent('')

          if (response.ok) {
            console.log('Response worked!')
          }
        }}>
          <input type="text" value={newContent} onChange={e => setNewContent(e.target.value)} />
          <input type="submit" value="Add Task" />
        </form>

        <button onClick={() => { setViewType('graph') }}>Graph</button>
        <button onClick={() => { setViewType('intervals') }}>Intervals</button>
        <button onClick={() => { setViewType('adjacent') }}>Adjacent</button>

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
