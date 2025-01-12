import React from 'react'
import TimeSlider from '../components/TimeSlider'
import Minimap from '../components/Minimap'
import PlayerTable from '../components/PlayerTable'

class Overview extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedGameData: props.game[0],
      timer: null,
      timerSpeed: '1'
    }
  }

  onSliderChange (val) {
    let time = parseInt(val[0], 10)
    let closest = this.props.game.reduce((prev, curr) => (Math.abs(curr.t - time) < Math.abs(prev.t - time) ? curr : prev))

    this.setState({
      selectedGameData: closest
    })
  }

  _createTimer (speed) {
    let timer = setInterval(() => {
      let id = this.props.game.indexOf(this.state.selectedGameData)
      this.setState({
        selectedGameData: this.props.game[id + 1]
      })
    }, 1000 / parseInt(speed))
    this.setState({ timer })
  }

  toggleTimer () {
    if (this.state.timer) {
      clearInterval(this.state.timer)
      this.setState({
        timer: null
      })
    } else {
      this._createTimer(this.state.timerSpeed)
    }
  }

  changeSpeed (ev) {
    let newValue = ev.target.value

    this.setState({
      timerSpeed: newValue
    })

    if (this.state.timer !== null) {
      clearInterval(this.state.timer)
      this._createTimer(newValue)
    }
  }

  render () {
    let { game } = this.props
    if (game.length === 0) return null
    let min = game[0].t
    let max = game[game.length - 1].t
    let start = this.state.selectedGameData.t

    return (
      <div className='overview'>
        <TimeSlider seeking={this.state.timer !== null} min={min} max={max} start={start} onSlide={this.onSliderChange.bind(this)} />
        <button className='pure-button pure-button-primary play-button' onClick={this.toggleTimer.bind(this)}>{this.state.timer !== null ? 'Pause' : 'Play'}</button>
        <div className='pure-form speed-form'>
          <label for='speed-select'>Playback Speed: </label>
          <select id='speed-select' value={this.state.timerSpeed} onChange={this.changeSpeed.bind(this)}>
            <option value='1'>1x</option>
            <option value='2'>2x</option>
            <option value='5'>5x</option>
            <option value='10'>10x</option>
          </select>
        </div>
        <Minimap data={this.state.selectedGameData} />
        <PlayerTable data={this.state.selectedGameData} />
      </div>
    )
  }
}

export default Overview
