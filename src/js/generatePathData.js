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

export const generatePathData = function(width, height, radius, arrow) {
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