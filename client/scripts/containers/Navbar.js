import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeView } from '../actions/index'

// navbar components:
import NavMenu from '../components/navbar/NavMenu'
import views from '../components/config/views'

// TODO: import action creators to update view and manage counters

/*

old state: {
    newMessages: 0,
    newLandlordMessages: 0,
    newFinance: 0,
    newChores: 0
  }

old props: {
  view: 'Finances',
  changeView: function,
  isLandlord: boolean,
  links: [{render:}]
}

*/

// <NavMenu counters={this.props.counters} ui={this.props.ui} changeView={this.props.changeView} />

class NavBar2 extends Component {
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
          <div className="navbar-header">
            <NavMenu 
              count={this.props.counters}
              changeView={this.props.changeView}
              links={views}
              currentView={ui.currentView}
            />
          </div>
        </div>
      </nav>
    )
  }
}

// gives props to this container
const mapStateToProps = (state) => {
  return {
    counters: state.context.counters,
    ui: state.ui
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ changeView }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar2)