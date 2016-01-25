import React from 'react';
import ReactDOM from 'react-dom';

var App = React.createClass({
  getInitialState: function() {
    return {
      view: 'Message'
    }
  }, 
  render: function() {
    return (
      <div className="app-container">
        <div className="col-sm-5">Hi</div>
        <div className="col-sm-7">
          <ContentContainer view={this.state.view} />
        </div>
      </div>
    )
  }
});

var ContentContainer = React.createClass({
  render: function() {
    if (this.props.view === 'Message') {
      return <MessageContainer />
    } else if (this.props.view === 'Chore') {
      return <ChoreContainer />
    } else if (this.props.view === 'Finance') {
      return <FinanceContainer />
    }
  }
});

var MessageContainer = React.createClass({
  render: function() {
    return (
      <div className="message-container">
        <h2 className="text-center">Messages</h2>

      </div>
    )
  }
});

var ChoreContainer = React.createClass({
  render: function() {
    return (
      <div className="chore-container">
        <h2 className="text-center">Chores</h2>

      </div>
    )
  }
});

var FinanceContainer = React.createClass({
  render: function() {
    return (
      <div className="finance-container">
        <h2 className="text-center">Finance</h2>

      </div>
    )
  }
});

ReactDOM.render(<App />, document.querySelector('#app'));