import React from 'react'
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';


function Graph({ width, height, graph, updateGraph, selectedElement, setSelectedElement, newPoint, setNewPoint, setEditMode }) {

  const [dragging, setDragging] = React.useState(0)
  const [seeDraggingGhost, setSeeDraggingGhost] = React.useState(false)
  const [hoverPoint, setHoverPoint] = React.useState({ x: 0, y: 0 })
  const [commandDown, setCommandDown] = React.useState(false)
  const [overElement, setOverElement] = React.useState(0)

  const handleMouseMove = (e, zoom) => {
    const point = localPoint(e)
    point.x = Math.round((point.x - zoom.transformMatrix.translateX) / zoom.transformMatrix.scaleX / 10) * 10
    point.y = Math.round((point.y - zoom.transformMatrix.translateY) / zoom.transformMatrix.scaleY / 10) * 10

    setHoverPoint({ x: point.x, y: point.y })
    if (e.metaKey) {
      setCommandDown(true)
    } else {
      setCommandDown(false)
    }
  }

  const handleElementMouseDown = (e, elementId) => {
    setDragging(elementId)
  }

  const handleElementMouseUp = (e, elementId) => {
    setDragging(0)
    setEditMode(false)
    if (e.metaKey) {
      if ((elementId !== selectedElement) && (selectedElement > 0)) {
        console.log(selectedElement)
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
              updateGraph()
            }
          })
      }
    } else {
      setNewPoint({ active: false, x: 0, y: 0 })
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
            updateGraph()
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
            onMouseMove={(e) => { handleMouseMove(e, zoom) }}
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
              onTouchStart={zoom.dragStart}
              onTouchMove={zoom.dragMove}
              onTouchEnd={(e) => { handleBackgroundMouseUp(e, zoom) }}
              onMouseDown={zoom.dragStart}
              onMouseMove={(e) => {
                zoom.dragMove(e)
                setSeeDraggingGhost(true)
              }}
              onMouseUp={(e) => { handleBackgroundMouseUp(e, zoom) }}
              onMouseLeave={() => {
                if (zoom.isDragging) zoom.dragEnd();
              }}
              style={{ cursor: zoom.isDragging ? 'grabbing' : 'default' }}
            />
            <g transform={zoom.toString()}>

              {/* Draw connections */}

              {graph.map(element => {
                return (<>
                  {element.children.map(child => {
                    const childElement = graph.filter((element) => element.id === child)[0]
                    if (!(commandDown && overElement === child && selectedElement === element.id)) {
                      return (
                        <line x1={element.x} y1={element.y} x2={childElement.x} y2={childElement.y} stroke='hotpink' markerEnd='url(#dot)' />
                      )
                    } else {
                      return (
                        <line x1={element.x} y1={element.y} x2={childElement.x} y2={childElement.y} stroke='hotpink' markerEnd='url(#dot)' opacity='0.33' />
                      )
                    }
                  })}
                </>)
              })}

              {/* Draw ghost when moving an element */}

              {(dragging !== 0 & seeDraggingGhost) && <>
                {graph.filter(x => x.id === dragging).map(element => {
                  return (
                    <>{element.parents.map(parent => {
                      const parentElement = graph.filter((element) => element.id === parent)[0]
                      return (
                        <line x1={parentElement.x} y1={parentElement.y} x2={hoverPoint.x} y2={hoverPoint.y} stroke='hotpink' markerEnd='url(#dot)' opacity='0.66' />
                      )
                    })}
                      {element.children.map(child => {
                        const childElement = graph.filter((element) => element.id === child)[0]
                        return (
                          <line x1={hoverPoint.x} y1={hoverPoint.y} x2={childElement.x} y2={childElement.y} stroke='hotpink' markerEnd='url(#dot)' opacity='0.66' />
                        )
                      })}
                    </>
                  )
                })}
                <circle onMouseUp={(e) => { handleBackgroundMouseUp(e, zoom) }} cx={hoverPoint.x} cy={hoverPoint.y} r='20' fill='hotpink' opacity='0.66' />
              </>}

              {/* Draw ghosts when making a new element */}

              {newPoint.active && <circle cx={newPoint.x} cy={newPoint.y} r='20' fill='hotpink' opacity='0.66' />}

              {/* Draw ghosts when holding command key */}

              {(commandDown && overElement === 0) && <circle onMouseUp={(e) => { handleBackgroundMouseUp(e, zoom) }} cx={hoverPoint.x} cy={hoverPoint.y} r='20' fill='hotpink' opacity='0.66' />}

              {(commandDown && overElement !== 0 && selectedElement > 0) && <line x1={graph.filter(x => x.id === selectedElement)[0].x} y1={graph.filter(x => x.id === selectedElement)[0].y} x2={graph.filter(x => x.id === overElement)[0].x} y2={graph.filter(x => x.id === overElement)[0].y} stroke='hotpink' markerEnd='url(#dot)' opacity='0.66' />}

              {/* Draw elements */}

              {graph.map(element => {
                return (<>
                  <circle cx={element.x} cy={element.y} r='20' fill='hotpink' onMouseMove={() => {
                    setSeeDraggingGhost(false)
                    setOverElement(element.id)
                  }}
                    onMouseLeave={() => { setOverElement(0) }}
                    onMouseDown={(e) => { handleElementMouseDown(e, element.id) }} onMouseUp={(e) => { handleElementMouseUp(e, element.id) }} />
                </>)
              })}

              {/* Draw text */}

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
