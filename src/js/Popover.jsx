// import {generatePathData} from './generatePathData'
import React from 'react'
import _ from 'underscore'
import LinearGradient from 'react-svg-gradient'

// generate a path's arc data parameter
// http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
const arcParameter = function(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
    return [rx,
            ',',
            ry,
            ' ',
            xAxisRotation,
            ' ',
            largeArcFlag,
            ',',
            sweepFlag,
            ' ',
            x,
            ',',
            y].join('')
}

const cornerArcParam = (x, y, radius) => arcParameter(radius, radius, 0, 0, 1, x, y)

/*
 * Generate a path's data attribute
 *
 * @param {Number} width Width of the rectangular shape
 * @param {Number} height Height of the rectangular shape
 * @param {Number} radius Border radius of the rectangular shape
 * @param {Object} arrow Arrow data (props: width, direction, center)
 * @return {String} a path's data attribute value
 */

const generatePathData = function(width, height, radius, arrow) {
    var data = []

    const arrowHalf = (arrow.width / 2)
    let arrowCenter = radius

    if (arrow.direction % 2) {
        const heightMultiplier = height - (radius * 2)
        arrowCenter += (heightMultiplier * arrow.center)
    } else {
        const widthMultiplier = width - (radius * 2)
        arrowCenter += (widthMultiplier * arrow.center)
    }
    
    const cornerArc = (x, y) => cornerArcParam(x, y, radius)

    if (arrow.direction == 0) {
        data.push('M' + (arrowCenter - arrowHalf) + ',' + 0)
        data.push('l' + arrowHalf + ',' + -arrow.length)
        data.push('l' + arrowHalf + ',' + arrow.length)
    } else {
        data.push('M' + (width / 2) + ',' + 0)
    }

    data.push('H' + (width - radius))

    // Top Right
    if (radius > 0) {
        data.push('A' + cornerArc(width, radius))
    }

    if (arrow.direction == 1) {
        data.push('V' + (arrowCenter - arrowHalf))
        data.push('l' + arrow.length + ',' + arrowHalf)
        data.push('l' + -arrow.length + ',' + arrowHalf)
    }

    data.push('V' + (height - radius))

    // Lower Right
    if (radius > 0) {
        data.push('A' + cornerArc(width - radius, height))
    }

    if (arrow.direction == 2) {
        data.push('H' + (arrowCenter + arrowHalf))
        data.push('l' + -arrowHalf + ',' + arrow.length)
        data.push('l' + -arrowHalf + ',' + -arrow.length)
    }

    data.push('H' + radius)

    // Lower Left
    if (radius > 0) {
        // now we draw the arc in the lower-left corner
        data.push('A' + cornerArc(0, height - radius))
    }

    if (arrow.direction == 3) {
        data.push('V' + (arrowCenter + arrowHalf))
        data.push('l' + -arrow.length + ',' + -arrowHalf)
        data.push('l' + arrow.length + ',' + -arrowHalf)
    }

    data.push('V' + radius)

    // Top Left
    if (radius > 0) {
        data.push('A' + cornerArc(radius, 0))
    }

    // Close Path
    data.push('Z')

    return data.join(' ')
}

// Popover Component

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
        linearGradient = <LinearGradient id={ gradientID } fill={ style.background } />
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
        width: svgSize.width,
        height: svgSize.height
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