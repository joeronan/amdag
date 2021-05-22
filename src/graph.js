import React from 'react'
import { Zoom } from '@visx/zoom';


function Graph({ width, height, graph, setSelectedElement }) {
  const handleClick = (elementId) => {
    setSelectedElement(elementId)
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
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="0.5" />
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke-width="1" />
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
              onTouchEnd={zoom.dragEnd}
              onMouseDown={zoom.dragStart}
              onMouseMove={zoom.dragMove}
              onMouseUp={zoom.dragEnd}
              onMouseLeave={() => {
                if (zoom.isDragging) zoom.dragEnd();
              }}
              style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab' }}
            />
            <g transform={zoom.toString()}>

              {graph.map(element => {
                return (<>
                  <circle cx={element.x} cy={element.y} r='20' fill='hotpink' onClick={() => { handleClick(element.id) }} />
                  <text className='not-selectable' x={element.x} y={element.y - 25} fill='hotpink'>{element.id}</text>
                  {element.children.map(child => {
                    const childElement = graph.filter((element) => element.id === child)[0]
                    return (
                      <line x1={element.x} y1={element.y} x2={childElement.x} y2={childElement.y} stroke='hotpink' marker-end='url(#dot)' />
                    )
                  })}
                </>)
              })}
            </g>
          </svg>
        </div>
      )}
    </Zoom>
  )
}

export default Graph
