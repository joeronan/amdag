import React from 'react'

function ViewPanel({ graph, updateGraph, selectedElement, setSelectedElement, newPoint, setNewPoint, editMode, setEditMode }) {

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
  }, [editMode, setEditMode, setNewPoint, setSelectedElement])

  const [newContent, setNewContent] = React.useState('')
  const [newHeader, setNewHeader] = React.useState('')

  React.useEffect(() => {
    setNewContent('')
    setNewHeader('')
  }, [newPoint])

  // Functions for handling buttons

  const handleDuplicate = (element) => {
    const entry = { id: selectedElement, header: element.header, content: element.content, x: element.x + 50, y: element.y, parents: element.parents, children: element.children }
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

  }

  const handleEdit = (element) => {
    setEditMode(!editMode)
    setNewHeader(element.header)
    setNewContent(element.content)
  }

  const handleSubmitEdit = async e => {
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
  }

  const handleDelete = async e => {
    const entry = { id: selectedElement }
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
  }

  const handleNewElement = async e => {
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
  }

  return (
    <>
      {/* Default text if nothing is selected */}

      {selectedElement < 0 && <>
        <div style={{ margin: '10px 10px 10px 10px', padding: '0px 10px 10px 10px', border: '1px solid rgb(120, 120, 120)' }}>
          <p>Basic controls:</p>
          <p>Click on a note to view it. You can move around by dragging the background and by zooming. Drag the notes to move them around. Hold cmd or ctrl and click to create new notes and new connections.</p>
        </div>
      </>}

      {selectedElement !== 0 && graph.filter((element) => element.id === selectedElement).map((element) => {

        if (!editMode) {

          // Viewing a selected element

          return <>
            <p className='header'>{element.header}</p>
            <p className='info'>ID: {element.id} </p>
            <p className='info'>Created: {element.date_created} </p>
            <p className='info'>Last Edited: {element.date_edited} </p>
            <p className='info'>Edit: <button onClick={() => { handleEdit(element) }}>E</button></p>
            <p className='info'>Duplicate: <button onClick={() => { handleDuplicate(element) }}>D</button></p>
            <hr />
            <p dangerouslySetInnerHTML={{ __html: element.content }}></p>
            <br />
          </>
        } else {

          // Editing a selected element

          return <>
            <form onSubmit={handleSubmitEdit}>
              <p><input className="input-text header" type="text" value={newHeader} onChange={e => setNewHeader(e.target.value)} /></p>
              <p className='info'>ID: {element.id} </p>
              <p className='info'>Created: {element.date_created} </p>
              <p className='info'>Last Edited: {element.date_edited} </p>
              <p className='info'>Save: <input type="submit" value="S" /></p>
              <p className='info'>Cancel: <button onClick={() => { setEditMode(!editMode) }}>C</button></p>
              <p className='info'>Delete: <button onClick={handleDelete}>X</button></p>
              <hr />
              <p><textarea rows="20" value={newContent} onChange={e => setNewContent(e.target.value)} /></p>
              <br />
            </form>

          </>
        }
      })}

      {/* Creating a new element */}

      {!selectedElement && <>
        <p>New Element</p>

        <form onSubmit={handleNewElement}>
          <p>Header: <input className="input-text" type="text" value={newHeader} onChange={e => setNewHeader(e.target.value)} /></p>
          <p>Content:<textarea rows="10" value={newContent} onChange={e => setNewContent(e.target.value)} /></p>
          <input type="submit" value="Add Element" />
        </form>
      </>}
    </>
  )
}

export default ViewPanel
