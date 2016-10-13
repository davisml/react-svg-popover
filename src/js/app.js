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
		// var updateButtonClass = 'btn btn-primary disabled'
		const changeDirection = (arrowDirection) => {
			return (event) => {
				console.log(`Set direction: ${ arrowDirection }`)
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

		return <div>
			<div id="options">
				<div className="form-group">
					<span>Arrow Direction: </span>
					<button onClick={ changeDirection(0) }>Top</button>
					<button onClick={ changeDirection(1) }>Right</button>
					<button onClick={ changeDirection(2) }>Bottom</button>
					<button onClick={ changeDirection(3) }>Left</button>
				</div>
				<div className="form-group">
					<span>Arrow Width: </span>
					<input type="number" value={ arrowWidth } onChange={ handleChange('arrowWidth') } />
				</div>
				<div className="form-group">
					<span>Arrow Length: </span>
					<input type="number" value={ arrowLength } onChange={ handleChange('arrowLength') } />
				</div>
				<div className="form-group">
					<span>Popover width: </span>
					<input type="number" value={ popoverWidth } onChange={ handleChange('popoverWidth') } />
				</div>
				<div className="form-group">
					<span>Popover Height: </span>
					<input type="number" value={ popoverHeight } onChange={ handleChange('popoverHeight') } />
				</div>
				<div className="form-separator" />
				<div className="form-group">
					<input type="checkbox" checked={ showDropShadow } onChange={ handleToggle('showDropShadow') } /> Show drop shadow
				</div>
				<div className="form-group">
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
