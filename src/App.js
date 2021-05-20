import React from 'react';
import logo from './logo.svg';
import './App.css';
import ViewGraph from './view-graph';
import ViewIntervals from './view-intervals';
import ViewAdjacent from './view-adjacent';

function App() {

  const [viewType, setViewType] = React.useState('graph')
  const [selectedElement, setSelectedElement] = React.useState(1)
  const [newContent, setNewContent] = React.useState('')


  const handleViewType = () => {
    switch (viewType) {
      case 'graph':
        return <ViewGraph selectedElement={selectedElement} setSelectedElement={setSelectedElement} />

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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

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

        {handleViewType()}

      </header>
    </div>
  );
}

export default App;
