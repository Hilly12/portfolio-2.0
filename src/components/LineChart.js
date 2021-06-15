import React, {Component} from 'react'

class LineChart extends Component {
  getMinX() {
    const { data, x } = this.props;
    const only_x = data.map(obj => obj[x]);
    const min_x = Math.min.apply(null, only_x);
    return min_x;
  }

  getMinY() {
    const { data, y } = this.props;
    const only_y = data.map(obj => obj[y]);
    const min_y = Math.min.apply(null, only_y);
    return min_y * 0.95;
  }

  getMaxX() {
    const { data, x } = this.props;
    const only_x = data.map(obj => obj[x]);
    const max_x = Math.max.apply(null, only_x);
    return max_x;
  }

  getMaxY() {
    const { data, y } = this.props;
    const only_y = data.map(obj => obj[y]);
    const max_y = Math.max.apply(null, only_y);
    return max_y * 1.05;
  }

  getSvgX(x) {
    const { svgWidth } = this.props;
    return ((x - this.getMinX()) / (this.getMaxX() - this.getMinX())) * svgWidth;
  }

  getSvgY(y) {
    const { svgHeight } = this.props
    return svgHeight * (1 - ((y - this.getMinY()) / (this.getMaxY() - this.getMinY())));
    // return svgHeight * (1 - (y / this.getMaxY()))
  }

  makePath() {
    const { data, color, x, y } = this.props;
    let pathD = `M ${this.getSvgX(data[0][x])} ${this.getSvgY(data[0][y])} `

    pathD += data.map((point) => {
      return `L ${this.getSvgX(point[x])} ${this.getSvgY(point[y])}`
    }).join(' ');

    return (
      <path style={{ strokeWidth: 2, fill: 'none', stroke: color }} d={pathD}/>
    )
  }

  render() {
    const { data, svgHeight, svgWidth } = this.props;
    if (!data || (Array.isArray(data) && Array.from(data).length === 0)) return null;
    const minX = this.getMinX()
    const maxX = this.getMaxX()
    const minY = this.getMinY()
    const maxY = this.getMaxY()
    return (
      <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <g style={{ stroke: '#5a5959' }}>
          <line x1={this.getSvgX(minX)} y1={this.getSvgY(minY)} x2={this.getSvgX(maxX)} y2={this.getSvgY(minY)}/>
          <line x1={this.getSvgX(minX)} y1={this.getSvgY(minY)} x2={this.getSvgX(minX)} y2={this.getSvgY(maxY)}/>
        </g>
        {this.makePath()}
      </svg>
    )
  }
}

LineChart.defaultProps = {
  data: [],
  color: '#ff4500',
  svgHeight: 40,
  svgWidth: 200,
}

export default LineChart
