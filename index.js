'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _reactSvgGradient = require('react-svg-gradient');

var _reactSvgGradient2 = _interopRequireDefault(_reactSvgGradient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// generate a path's arc data parameter
// http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
var arcParameter = function arcParameter(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
    return [rx, ',', ry, ' ', xAxisRotation, ' ', largeArcFlag, ',', sweepFlag, ' ', x, ',', y].join('');
}; // import {generatePathData} from './generatePathData'


var cornerArcParam = function cornerArcParam(x, y, radius) {
    return arcParameter(radius, radius, 0, 0, 1, x, y);
};

/*
 * Generate a path's data attribute
 *
 * @param {Number} width Width of the rectangular shape
 * @param {Number} height Height of the rectangular shape
 * @param {Number} radius Border radius of the rectangular shape
 * @param {Object} arrow Arrow data (props: width, direction, center)
 * @return {String} a path's data attribute value
 */

var generatePathData = function generatePathData(width, height, radius, arrow) {
    var data = [];

    var arrowHalf = arrow.width / 2;
    var arrowCenter = radius;

    if (arrow.direction % 2) {
        var heightMultiplier = height - radius * 2;
        arrowCenter += heightMultiplier * arrow.center;
    } else {
        var widthMultiplier = width - radius * 2;
        arrowCenter += widthMultiplier * arrow.center;
    }

    var cornerArc = function cornerArc(x, y) {
        return cornerArcParam(x, y, radius);
    };

    if (arrow.direction == 0) {
        data.push('M' + (arrowCenter - arrowHalf) + ',' + 0);
        data.push('l' + arrowHalf + ',' + -arrow.length);
        data.push('l' + arrowHalf + ',' + arrow.length);
    } else {
        data.push('M' + width / 2 + ',' + 0);
    }

    data.push('H' + (width - radius));

    // Top Right
    if (radius > 0) {
        data.push('A' + cornerArc(width, radius));
    }

    if (arrow.direction == 1) {
        data.push('V' + (arrowCenter - arrowHalf));
        data.push('l' + arrow.length + ',' + arrowHalf);
        data.push('l' + -arrow.length + ',' + arrowHalf);
    }

    data.push('V' + (height - radius));

    // Lower Right
    if (radius > 0) {
        data.push('A' + cornerArc(width - radius, height));
    }

    if (arrow.direction == 2) {
        data.push('H' + (arrowCenter + arrowHalf));
        data.push('l' + -arrowHalf + ',' + arrow.length);
        data.push('l' + -arrowHalf + ',' + -arrow.length);
    }

    data.push('H' + radius);

    // Lower Left
    if (radius > 0) {
        // now we draw the arc in the lower-left corner
        data.push('A' + cornerArc(0, height - radius));
    }

    if (arrow.direction == 3) {
        data.push('V' + (arrowCenter + arrowHalf));
        data.push('l' + -arrow.length + ',' + -arrowHalf);
        data.push('l' + arrow.length + ',' + -arrowHalf);
    }

    data.push('V' + radius);

    // Top Left
    if (radius > 0) {
        data.push('A' + cornerArc(radius, 0));
    }

    // Close Path
    data.push('Z');

    return data.join(' ');
};

// Popover Component

var Popover = function Popover(props) {
    var style = _underscore2.default.defaults(props.style, {
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
    });

    var className = props.className;
    var arrowCenter = style.arrowCenter;
    var arrowLength = style.arrowLength;
    var arrowWidth = style.arrowWidth;
    var borderRadius = style.borderRadius;
    var stroke = style.stroke;
    var strokeWidth = style.strokeWidth;
    var arrowDirection = style.arrowDirection;
    var width = style.width;
    var height = style.height;


    var svgSize = { width: width, height: height };
    var pathSize = { width: width, height: height };

    if (_underscore2.default.isString(arrowDirection)) {
        arrowDirection = Popover.direction[arrowDirection];
    }

    if (style.boxSizing == 'border-box') {
        if (arrowDirection % 2) {
            pathSize.width -= arrowLength;
        } else {
            pathSize.height -= arrowLength;
        }
    } else if (style.boxSizing == 'content-box') {
        if (arrowDirection % 2) {
            svgSize.width = svgSize.width + arrowLength;
        } else {
            svgSize.height = svgSize.height + arrowLength;
        }
    }

    pathSize.width -= strokeWidth * 2;
    pathSize.height -= strokeWidth * 2;

    var arrow = {
        width: arrowWidth,
        length: arrowLength,
        direction: arrowDirection,
        center: arrowCenter
    };

    var pathData = generatePathData(pathSize.width, pathSize.height, borderRadius, arrow);

    var pathOrigin = { x: strokeWidth, y: strokeWidth };

    if (arrowDirection == 0) {
        pathOrigin.y += arrowLength;
    } else if (arrowDirection == 3) {
        pathOrigin.x += arrowLength;
    }

    var gradientID = 'popoverGrad';
    var hasGradient = style.background.indexOf('linear-gradient') === 0;
    var fill = hasGradient ? 'url(#' + gradientID + ')' : style.background;
    var transform = 'translate(' + pathOrigin.x + ', ' + pathOrigin.y + ')';

    var linearGradient = null;

    if (hasGradient) {
        linearGradient = _react2.default.createElement(_reactSvgGradient2.default, { id: gradientID, fill: style.background });
    }

    var pathProps = {
        fill: fill, transform: transform, stroke: stroke, strokeWidth: strokeWidth, d: pathData
    };

    var contentStyle = {
        position: 'absolute',
        top: arrowDirection === 0 ? strokeWidth + arrowLength : strokeWidth,
        left: arrowDirection === 3 ? strokeWidth + arrowLength : strokeWidth,
        width: pathSize.width,
        height: pathSize.height,
        padding: style.padding || 0,
        boxSizing: 'border-box'
    };

    var divStyle = {
        position: style.position,
        top: style.top,
        left: style.left,
        right: style.right,
        bottom: style.bottom,
        width: width,
        height: height
    };

    // Apply drop shadow
    if (style.dropShadow) {
        var filter = 'drop-shadow(' + style.dropShadow + ')';

        divStyle.WebkitFilter = filter;
        divStyle.filter = filter;
    }

    if (style.color) {
        divStyle.color = style.color;
    }

    return _react2.default.createElement(
        'div',
        { className: className, style: divStyle },
        _react2.default.createElement(
            'svg',
            svgSize,
            _react2.default.createElement(
                'defs',
                { key: 'defs' },
                linearGradient
            ),
            _react2.default.createElement('path', pathProps)
        ),
        _react2.default.createElement(
            'div',
            { style: contentStyle },
            props.children
        )
    );
};

Popover.direction = {
    top: 0,
    right: 1,
    bottom: 2,
    left: 3
};

Popover.defaultProps = {
    style: {},
    className: 'svg-popover'
};

exports.default = Popover;
