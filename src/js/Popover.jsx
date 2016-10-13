import {generatePathData} from './generatePathData'
import React from 'react'
import _ from 'underscore'
import GradientParser from 'gradient-parser'
import LinearGradient from './LinearGradient.jsx'

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
        dropShadow: '0px 1px 5px rgba(0,0,0,0.1)',
        background: 'linear-gradient(90deg, rgb(252, 252, 252), rgb(246, 246, 246))'
    })
    
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
    const hasGradient = (style.background.indexOf('linear-gradient') === 0)
    const fill = hasGradient ? `url(#${ gradientID })` : style.background
    const transform = `translate(${ pathOrigin.x }, ${ pathOrigin.y })`
    
    let linearGradient = null

    if (hasGradient) {
        const gradientProps = GradientParser.parse(style.background)[0]
        linearGradient = <LinearGradient id={ gradientID } {...gradientProps} />
    }

    const pathProps = {
        fill, transform, stroke, strokeWidth, d: pathData
    }

    const contentStyle = {
        position: 'absolute',
        top: (arrowDirection === 0) ? (strokeWidth + arrowLength) : strokeWidth,
        left: (arrowDirection === 3) ? (strokeWidth + arrowLength) : strokeWidth,
        width: pathSize.width,
        height: pathSize.height,
        padding: style.padding || 0,
        boxSizing: 'border-box'
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

    if (style.color) {
    	divStyle.color = style.color
    }

    return <div className={ className } style={ divStyle }>
        <svg {...svgSize}>
            <defs key="defs">
                { linearGradient }
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