import {Component, default as React} from 'react'
import ReactDOM from 'react-dom'
import Popover from './Popover.jsx'

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			arrowDirection: 0,
			popoverWidth: 200,
			popoverHeight: 200,
			arrowWidth: 32,
			arrowLength: 16,
			showDropShadow: true,
			showDark: false
		}
	}

	render() {
		const changeDirection = (arrowDirection) => {
			return (event) => {
				this.setState({ arrowDirection })
			}
		}

		const handleChange = (key) => {
			return (event) => {
				let state = {}
				state[key] = event.target.value
				this.setState(state)
			}
		}

		const handleToggle = (key) => {
			return (event) => {
				let state = {}
				state[key] = !this.state[key]
				this.setState(state)
			}
		}

		const {arrowDirection, showDark, showDropShadow, arrowWidth, arrowLength, popoverWidth, popoverHeight} = this.state

		let popoverStyle = {
			arrowDirection, top: '50%', left: '50%',
			width: Number(popoverWidth),
			height: Number(popoverHeight),
			arrowWidth: Number(arrowWidth),
			arrowLength: Number(arrowLength),
			dropShadow: (showDropShadow) ? '0px 1px 5px rgba(0,0,0,0.1)' : null
		}

		if (showDark) {
			popoverStyle.background = 'linear-gradient(90deg, rgb(60, 60, 60), rgb(48, 48, 48))'
			popoverStyle.stroke = 'rgb(40,40,40)'
			popoverStyle.color = 'rgb(255,255,255)'
		}

		const directions = ['Top', 'Right', 'Bottom', 'Left']
		const renderDirectionButton = (direction, index) => {
			let buttonProps = {
				key: `direction-${ index }`, onClick: changeDirection(index)
			}

			if (index === this.state.arrowDirection) {
				buttonProps.className = 'active'
			}

			return <button {...buttonProps}>{ direction }</button>
		}

		return <div>
			<div id="options">
				<div className="form-group">
					<label>Arrow Direction: </label>
					<div className="btn-group">
						{ directions.map(renderDirectionButton) }
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="arrowWidth">Arrow Width: </label>
					<input id="arrowWidth" type="number" value={ arrowWidth } max={ popoverWidth } onChange={ handleChange('arrowWidth') } />
				</div>
				<div className="form-group">
					<label htmlFor="arrowLength">Arrow Length: </label>
					<input id="arrowLength" type="number" value={ arrowLength } onChange={ handleChange('arrowLength') } />
				</div>
				<div className="form-group">
					<label htmlFor="popoverWidth">Popover Width: </label>
					<input id="popoverWidth" type="number" min={ arrowWidth } value={ popoverWidth } onChange={ handleChange('popoverWidth') } />
				</div>
				<div className="form-group">
					<label htmlFor="popoverHeight">Popover Height: </label>
					<input id="popoverHeight" type="number" min={ arrowWidth } value={ popoverHeight } onChange={ handleChange('popoverHeight') } />
				</div>
				<div className="form-separator" />
				<div className="form-group center">
					<input type="checkbox" checked={ showDropShadow } onChange={ handleToggle('showDropShadow') } /> Show drop shadow
				</div>
				<div className="form-group center">
					<input type="checkbox" checked={ showDark } onChange={ handleToggle('showDark') } /> Use dark background
				</div>
			</div>
			<div id="preview">
				<Popover style={ popoverStyle }>
					This is a popover!
				</Popover>
			</div>
		</div>
	}
}

ReactDOM.render(<App />, document.getElementById('content'))
