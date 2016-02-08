import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


var PropertyAdder = React.createClass({
  createHouse: function(event) {
    event.preventDefault();
    var obj = {};
    obj.name = this.refs.houseName.value;
    obj.address = this.refs.address.value;
    console.log(obj, "OB");
    $.ajax({
      url: '/properties/create',
      type: 'POST',
      data: JSON.stringify(obj),
      contentType: 'application/json',
      headers: {'token': localStorage.getItem('obie')},
      success: function() {
        this.props.getHousesOwned();
        this.refs.addProp.reset();
      }.bind(this),
      error: function() {
        alert('Error Creating house. Please try again.');
      }
    });
  },
  addProperty: function(event) {
    event.preventDefault();
    $.ajax({
      url: '/properties/add/' + this.refs.houseCode.value,
      type: 'PUT',
      contentType: 'application/json',
      headers: {'token': localStorage.getItem('obie')},
      success: function() {
        this.props.getHousesOwned();
        alert("House added Successfully");
        this.refs.claimProp.reset();
      }.bind(this),
      error: function() {
        alert('Error adding house. Please check token.');
      }
    });
  },

  render: function() {
    return (
      <div className="message-container">
        <form className="propertyAdder-form" ref="addProp" onSubmit={this.createHouse}>
          <h4>Create / Manage new property</h4>
          <div className="form-group">
            <label htmlFor="house-name">Property Nickname</label>
            <input className="form-control propertyAdder-input" id="house-name" ref="houseName" type="text" placeholder="House Name"/>
            <label htmlFor="house-address">Address</label>
            <input className="form-control propertyAdder-input" id="house-address" ref="address" type="text" placeholder="Address"/>
            <button className="btn btn-info" type="submit">Submit</button>
          </div>
        </form>
        <form className="propertyAdder-form" ref="claimProp" onSubmit={this.addProperty}>
          <h4>Manage existing property</h4>
          <div className="form-group propertAdder-form">
            <input className="form-control propertyAdder-input" ref="houseCode" type="text" placeholder="Add House With Token"/>
            <button className="btn btn-info" type="submit">Submit</button>
          </div>
        </form>
      </div>
    )
  }
});



export default PropertyAdder;