import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [todoList, setTodoList] = React.useState([])
  const [newContent, setNewContent] = React.useState('')

  const updateList = () => {
    fetch('/todo', { method: 'GET' }).then(res => {
      return (res.json())
    }).then(data => {
      setTodoList(data.tasks)
    })
  }

  React.useEffect(updateList, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <form onSubmit={async e => {
          e.preventDefault()
          const entry = { content: newContent }
          const response = await fetch('/todo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
          })

          updateList()
          setNewContent('')

          if (response.ok) {
            console.log('Response worked!')
          }
        }}>
          <input type="text" value={newContent} onChange={e => setNewContent(e.target.value)} />
          <input type="submit" value="Add Task" />
        </form>
        <ul>
          {todoList.map(element =>
            <li key={element.id}>
              {element.date_created} {element.id}: {element.content}
              <button onClick={
                async e => {
                  const entry = { id: element.id }
                  const response = await fetch('/todo', {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entry)
                  })

                  if (response.ok) {
                    console.log('Deleted!')
                    setTodoList(todoList.filter(x => x.id !== element.id))
                  }
                }}>X</button>
            </li>)}
        </ul>
      </header>
    </div>
  );
}

export default App;
