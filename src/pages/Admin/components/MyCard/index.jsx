import React, { Component } from 'react'
import './index.less'

export default class MyCard extends Component {
  render() {
		const {left,right,content,footer} = this.props
    return (
      <div className="card_container">
				<header className="header">
					<div className="left">{left}</div>
					<div className="right">{right}</div>
				</header>
				<section className="content">
					{content}
				</section>
        <hr className="hr"/>
				<footer className="footer">
					{footer}
				</footer>
			</div>
    )
  }
}
