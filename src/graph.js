import React from 'react'
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';


function Graph({ width, height, graph, selectedElement, setSelectedElement, newPoint, setNewPoint, setEditMode }) {

  const [dragging, setDragging] = React.useState(0)

  const handleElementMouseDown = (e, elementId) => {
    setDragging(elementId)
  }

  const handleElementMouseUp = (e, elementId) => {
    setDragging(0)
    setNewPoint({ active: false, x: 0, y: 0 })
    setEditMode(false)
    if (e.metaKey) {
      if (elementId !== selectedElement) {
        const entry = { id: selectedElement, children: [elementId] }
        fetch('/element', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(entry)
        })
          .then(response => {
            if (response.ok) {
              graph[graph.indexOf(graph.filter((x) => x.id === selectedElement)[0])].children.push(elementId)
            }
          })
      }
    } else {
      setSelectedElement(elementId)
    }
  }

  const handleBackgroundMouseUp = (e, zoom) => {
    if (dragging) {
      const point = localPoint(e)
      point.x = Math.round((point.x - zoom.transformMatrix.translateX) / zoom.transformMatrix.scaleX / 10) * 10
      point.y = Math.round((point.y - zoom.transformMatrix.translateY) / zoom.transformMatrix.scaleY / 10) * 10

      const entry = { id: dragging, x: point.x, y: point.y }
      fetch('/element', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
      })
        .then(response => {
          if (response.ok) {
            console.log('PLACEHOLDER')
          }
        })
      setDragging(0)

    } else {
      if (e.metaKey) {
        const point = localPoint(e)
        point.x = Math.round((point.x - zoom.transformMatrix.translateX) / zoom.transformMatrix.scaleX / 10) * 10
        point.y = Math.round((point.y - zoom.transformMatrix.translateY) / zoom.transformMatrix.scaleY / 10) * 10

        setSelectedElement(0)
        setNewPoint({ active: true, x: point.x, y: point.y })
      } else {
        zoom.dragEnd(e)
      }
    }
  }

  return (
    <Zoom
      width={width}
      height={height}
      scaleXMin={1 / 2}
      scaleXMax={4}
      scaleYMin={1 / 2}
      scaleYMax={4}
    >
      {zoom => (
        <div>
          <svg
            width={width}
            height={height}
          >
            <defs>
              <marker id="dot" viewBox="0 0 10 10" refX="25" refY="5"
                markerWidth="10" markerHeight="10" orient="auto">
                <polygon points='0,0 0,10 5,5' fill='hotpink' />
              </marker>
              <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1" />
              </pattern>
            </defs>

            <g transform={zoom.toString()}>
              <rect
                x={-width * 5}
                y={-height * 5}
                width={width * 10}
                height={height * 10}
                fill="url(#grid)"
              />
            </g>

            <rect
              width={width}
              height={height}
              fill="transparent"
              // onTouchStart={(e) => { handleBackgroundMouseDown(e, zoom) }}
              onTouchStart={zoom.dragStart}
              onTouchMove={zoom.dragMove}
              // onTouchEnd={zoom.dragEnd}
              onTouchEnd={(e) => { handleBackgroundMouseUp(e, zoom) }}
              // onMouseDown={(e) => { handleBackgroundMouseDown(e, zoom) }}
              onMouseDown={zoom.dragStart}
              onMouseMove={zoom.dragMove}
              // onMouseUp={zoom.dragEnd}
              onMouseUp={(e) => { handleBackgroundMouseUp(e, zoom) }}
              onMouseLeave={() => {
                if (zoom.isDragging) zoom.dragEnd();
              }}
              style={{ cursor: zoom.isDragging ? 'grabbing' : 'default' }}
            />
            <g transform={zoom.toString()}>

              {graph.map(element => {
                return (<>
                  {element.children.map(child => {
                    const childElement = graph.filter((element) => element.id === child)[0]
                    return (
                      <line x1={element.x} y1={element.y} x2={childElement.x} y2={childElement.y} stroke='hotpink' markerEnd='url(#dot)' />
                    )
                  })}
                </>)
              })}

              {graph.map(element => {
                return (<>
                  <circle cx={element.x} cy={element.y} r='20' fill='hotpink' onMouseDown={(e) => { handleElementMouseDown(e, element.id) }} onMouseUp={(e) => { handleElementMouseUp(e, element.id) }} />
                </>)
              })}

              {newPoint.active && <circle cx={newPoint.x} cy={newPoint.y} r='20' fill='hotpink' opacity='0.66' />}

              {graph.map(element => {
                return (<>
                  <text className='not-selectable' x={element.x} y={element.y - 25} fill='white'>{element.header}</text>
                </>)
              })}
            </g>
          </svg>
        </div>
      )
      }
    </Zoom >
  )
}

export default Graph
