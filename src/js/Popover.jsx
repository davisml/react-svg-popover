import {generatePathData} from './generatePathData'
import React from 'react'
import _ from 'underscore'

const Popover = (props) => {
    const style = _.defaults(props.style, {
        arrowCenter: 0.5,
        arrowDirection: Popover.direction.bottom,
        arrowLength: 16,
        arrowWidth: 32,
        borderRadius: 8,
        width: 200,
        height: 200,
        stroke: 'rgb(210,210,210)',
        strokeWidth: 1,
        padding: 10,
        boxSizing: 'content-box',
        position: 'absolute',
        dropShadow: '0px 1px 5px rgba(0,0,0,0.1)'
    })

    //'content-box'

    const {className} = props
    const {arrowCenter, arrowLength, arrowWidth, borderRadius, stroke, strokeWidth} = style
    let {arrowDirection} = style
    let {width, height} = style

    let svgSize = {width, height}
    let pathSize = {width, height}

    if (_.isString(arrowDirection)) {
        arrowDirection = Popover.direction[arrowDirection]
    }

    if (style.boxSizing == 'border-box') {
	    if (arrowDirection % 2) {
	        pathSize.width -= arrowLength
	    } else {
	        pathSize.height -= arrowLength
	    }
	} else if (style.boxSizing == 'content-box') {
		if (arrowDirection % 2) {
	        svgSize.width = (svgSize.width + arrowLength)
	    } else {
	        svgSize.height = (svgSize.height + arrowLength)
	    }
	}

    pathSize.width -= (strokeWidth * 2)
    pathSize.height -= (strokeWidth * 2)

    const arrow = {
        width: arrowWidth,
        length: arrowLength,
        direction: arrowDirection,
        center: arrowCenter
    }

    const pathData = generatePathData(pathSize.width, pathSize.height, borderRadius, arrow)

    let pathOrigin = { x: strokeWidth, y: strokeWidth }

    if (arrowDirection == 0) {
        pathOrigin.y += arrowLength
    } else if (arrowDirection == 3) {
        pathOrigin.x += arrowLength
    }

    const gradientID = 'popoverGrad'

    const pathProps = {
        fill: (style.background || `url(#${ gradientID })`),
        transform: `translate(${ pathOrigin.x }, ${ pathOrigin.y })`,
        stroke, strokeWidth, d: pathData
    }

    const contentStyle = {
        position: 'absolute',
        top: (arrowDirection === 0) ? (strokeWidth + arrowLength) : strokeWidth,
        left: (arrowDirection === 3) ? (strokeWidth + arrowLength) : strokeWidth,
        width: pathSize.width,
        height: pathSize.height,
        padding: style.padding || 0
    }

    let divStyle = {
        position: style.position,
        top: style.top,
        left: style.left,
        right: style.right,
        bottom: style.bottom,
        width,
        height
    }

    // Apply drop shadow
    if (style.dropShadow) {
    	let filter = `drop-shadow(${ style.dropShadow })`

    	divStyle.WebkitFilter = filter
    	divStyle.filter = filter
    }

    return <div className={ className } style={ divStyle }>
        <svg {...svgSize}>
            <defs key="defs">
                <linearGradient id="popoverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(252, 252, 252)"/>
                    <stop offset="100%" stopColor="rgb(246, 246, 246)"/>
                </linearGradient>
            </defs>
            <path {...pathProps} />
        </svg>
        <div style={ contentStyle }>
            { props.children }
        </div>
    </div>
}

Popover.direction = {
    top: 0,
    right: 1,
    bottom: 2,
    left: 3
}

Popover.defaultProps = {
    style: {},
    className: 'svg-popover'
}

export default Popover