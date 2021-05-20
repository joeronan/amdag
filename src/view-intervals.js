import React from 'react'
import SelectElementButton from './select-element-button'

function ViewIntervals({ selectedElement, setSelectedElement }) {

  const [upperSubgraph, setUpperSubgraph] = React.useState()
  const [lowerSubgraph, setLowerSubgraph] = React.useState()

  const updateUpperSubgraph = () => {
    fetch(`/subgraph?id=${selectedElement}&type=upper`, { method: 'GET' }).then(res => {
      return (res.json())
    }).then(data => {
      setUpperSubgraph(data)
    })
  }

  const updateLowerSubgraph = () => {
    fetch(`/subgraph?id=${selectedElement}&type=lower`, { method: 'GET' }).then(res => {
      return (res.json())
    }).then(data => {
      setLowerSubgraph(data)
    })
  }

  React.useEffect(updateUpperSubgraph, [selectedElement])
  React.useEffect(updateLowerSubgraph, [selectedElement])


  return (
    <div>
      {upperSubgraph && <p>
        Upper: {upperSubgraph.elements.map((element) => (<>{element.id} <SelectElementButton element={element.id} selectedElement={selectedElement} setSelectedElement={setSelectedElement} /></>))}
      </p>}
      <p>{selectedElement}</p>
      {lowerSubgraph && <p>
        Lower: {lowerSubgraph.elements.map((element) => (<>{element.id} <SelectElementButton element={element.id} selectedElement={selectedElement} setSelectedElement={setSelectedElement} /></>))}
      </p>}
    </div>
  )
}

export default ViewIntervals
