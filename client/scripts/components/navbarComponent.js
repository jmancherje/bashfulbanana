import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import h from '../helpers';

// create classes
var NavBar = React.createClass({
  render: function(){
    return(
      <nav className="navbar navbar-default">
        <div className="container-fluid col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
          <div className="navbar-header">
            <NavMenu changeView={this.props.changeView} links={this.props.links} />
          </div>
        </div>
      </nav>
    );
  }
});

var NavMenu = React.createClass({
  logout: function() {
    window.localStorage.removeItem('obie');
    window.location.href = "/logout";
  },
  render: function(){
    var changeView = this.props.changeView;
    var links = this.props.links.map(function(link, i){
      if(link.dropdown) {
        return (
          <NavLinkDropdown links={link.links} key={i} text={link.text} />
        );
      }
      else {
        return (
          <NavLink changeView={changeView} className="flex-children" linkTo={link.linkTo} key={i} text={link.text} render={link.render} />
        );
      }
    });
    return (
      <ul className="nav navbar-nav flexbox">
        <li className="flex-children">
          <img src="../../images/obie_logo.png" height="30px" />
        </li>
        {links}
        <li>
          <a onClick={this.logout}>Logout</a>
        </li>
      </ul>
    );
  }
});

var NavLink = React.createClass({
  changeView: function() {
    this.props.changeView(this.props.text);
  },
  render: function(){
    return(
      <li className="inner-flex"><a onClick={this.changeView}>{this.props.text}</a></li>
    );
  }
});

// set data
var navbar = {};
navbar.brand = {linkTo: "#", text: "React Bootstrap Navbar"};
navbar.links = [
  {render: "Message", text: "Messages"},
  {render: "Finance", text: "Finances"},
  {render: "Chore", text: "Chores"}
];


export default NavBar;
