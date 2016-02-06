import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import h from '../helpers';

var formatPrice = function(cents) {
  return '$' + ( (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") );
};


var pendingBills = React.createClass({
  getInitialState: function() {
    this.loadBills();
    this.getUsers(); 
    this.loadPayments();
    this.loadBillHistory();
    this.loadPaymentHistory();
    var userId = localStorage.getItem('userId');
    this.userId = userId;
    return {
      bills: [],
      // payments: [],
      paymentsOwed: [], 
      billHistory: [],
      paymentHistory: [],
      users: [],
      //eventually need to get real houseId/userId - use Justin's login to query
      //database with userId to get that user's houseId
    }
  },

  loadBillHistory: function() {
    $.ajax({
      url: '/payment/completed',
      type: 'GET',
      headers: {'token': localStorage.getItem('obie')},
      contentType: 'application/json',
      success: function(bills) {
        this.state.billHistory = bills;
        this.setState({billHistory: this.state.billHistory});
      }.bind(this)
    });
  },

  loadPaymentHistory: function() {
    $.ajax({
      url: '/payment/completed/owed',
      headers: {'token': localStorage.getItem('obie')},
      type: 'GET',
      contentType: 'application/json',
      success: function(payments) {
        this.state.paymentHistory = payments; 
        this.setState({paymentHistory: this.state.paymentHistory}); 
      }.bind(this)
    });
  },

  getUsers: function() {
    $.ajax({
      //eventually need to replace 1 with houseId. 
      url: '/users/',
      type: 'GET',
      contentType: 'application/json',
      headers: {'token': localStorage.getItem('obie')},
      success: function(users) {
        this.state.users = users; 
        this.setState({users: this.state.users}); 
      }.bind(this)
    });
  },

  //addBill is a function that will take a new created bill and post it
  //to the database. However, we don't have that route set up yet,
  //and need to verify schema as well. This should go in finance container. 

  //userId will be the user who created the bill
  //total 
  //name
  //dueDate
  //also need info on who owes what for the bill (checklist)
  
  addBill: function(bill) {
    console.log("Add Bill")
    $.ajax({
      url: '/payment/bill',
      headers: {'token': localStorage.getItem('obie')},
      type: 'POST',
      data: JSON.stringify(bill),
      contentType: 'application/json',
      success: function(id) {
        this.createPayments(id)
        this.loadBills();
      }.bind(this)
    });
  },

  addPayment: function(payment) {
    console.log("Add Payment")
    $.ajax({
      url: '/payment',
      headers: {'token': localStorage.getItem('obie')},
      type: 'POST',
      data: JSON.stringify(payment),
      contentType: 'application/json',
      success: function(data) {
        // this.loadPayments()
        console.log("payment added");
      }
    });
  },

  createPayments: function(billId) {
    // event.preventDefault();
    var users = this.state.users;
    //iterate through users
    for(var i = 0; i < users.length; i++) {
      //console.log('USER', users[i]);
      //find the ones selected
      if(users[i].selected === true) {
        //create payment object
        var payment = {
          billId: billId, //need to figure this out
          userId: users[i].id,
          amount: users[i].total
        }
        this.addPayment(payment);
        this.getUsers();
        setTimeout(this.loadPayments, 500);
        // console.log(users[i]);
        // console.log('PAYMENT', payment)
      }
    }
  },

  // name
  // total
  // dueDate
  // payee_username
  // payee_userId

  loadBills: function() {
    var token = localStorage.getItem('obie'); 
    $.ajax({
      url: '/payment/pay',
      type: 'GET',
      contentType: 'application/json',
      headers: {'token': token},
      success: function(bills) {
        console.log("bills", bills)
        this.state.bills = bills; 
        this.setState({bills: this.state.bills});
      }.bind(this),
      error: function(err) {
        console.log(err);
      }
    })
  },
  
  loadPayments: function () {
    var token = localStorage.getItem('obie');
    $.ajax({
      url: '/payment/owed',
      type: 'GET',
      contentType: 'application/json',
      headers: {'token': token},
      success: function(payments) {
        this.setState({paymentsOwed: payments});
      }.bind(this),
      error: function(err) {
        console.log(err);
      }
    })
  },

  render: function() {
    var context = this;
    var billList = this.state.bills.map(function(item, i) {
      return <BillEntry loadBills={context.loadBills} key={i} bill={item} />
    }); 
    var paymentsOwedList = this.state.paymentsOwed.map(function(item, i) {
      return <PaymentOwedEntry key={i} paymentOwed={item} />
    });
    var billHistoryList = this.state.billHistory.map(function(item, i) {
      return <BillHistory key={i} history={item} />
    });
    var paymentHistoryList = this.state.paymentHistory.map(function(item, i) {
      return <PaymentHistory key={i} history={item} />
    });
    return (
      <div className="finance-container">
        <h2 className="text-center">Finance</h2>
        <div className="finance-list">
          <div className='bill-list'>
            <h4 className="text-center">Bills Tenant</h4>
            {billList}
          </div>
          <div className='payments-owed-list'>
            <h4 className="text-center">Payments Owed</h4>
            {paymentsOwedList}
          </div>
          <div className='bill-history-list'>
            <h4 className="text-center">Bill History</h4>
            {billHistoryList}
          </div>
          <div className='payment-history-list'>
            <h4 className="text-center">Payment History</h4>
            {paymentHistoryList}
          </div>
        </div>
        <BillForm createPayments={this.createPayments} addPayment={this.addPayment} addBill={this.addBill} users={this.state.users}/>
      </div>
    )
  }
});

var BillEntry = React.createClass({
  getDate: function() {
    var date = h.getDate(this.props.bill.dueDate);
    console.log(date);
    return `${date.month}/${date.day}/${date.year}`;
  },

  createVenmoPayment: function(event) {
    event.preventDefault();
    var obj = {};
    obj.id = this.props.bill.paymentId;
    obj.email = this.props.bill.whoIsOwedEmail;
    obj.amount = this.props.bill.amount;
    obj.note = this.props.bill.billName;
    this.makeVenmoPayment(obj);
  },

  makeVenmoPayment: function(venmoData) {
    console.log("venmo DATA", venmoData);
    $.ajax({
      url: '/auth/venmo/payment',
      headers: {'token': localStorage.getItem('obie')},
      type: 'POST',
      data: JSON.stringify(venmoData),
      contentType: 'application/json',
      success: function(data) {
        console.log("venmo paid", "venmo data id", venmoData.id);
        this.markPaymentAsPaid(venmoData.id);
      }.bind(this)
    });
  },

  markPaymentAsPaid: function(paymentId) {
    $.ajax({
      url: '/payment/' + paymentId,
      type: 'PUT',
      headers: {'token': localStorage.getItem('obie')},
      contentType: 'application/json',
      success: function(data) {
        console.log("payment marked");
        this.props.loadBills();
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div className="bill-entry-container">
        <div className="row">
          <div className="col-xs-8">
            <p>You owe <span className="who-is-owed">{this.props.bill.whoIsOwed}</span></p> 
            <p><span className="who-is-owed">{formatPrice(this.props.bill.amount * 100)}</span> for <span className="who-is-owed">{this.props.bill.billName}</span></p>
            <p> by {this.getDate()}</p>
          </div>
          <div className="col-xs-4">
            <button className='pay-button btn btn-default' onClick={this.createVenmoPayment}>Pay</button>
          </div>
        </div>
      </div>
    )
  }
}); 

var PaymentOwedEntry = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.paymentOwed.ower} owes you ${this.props.paymentOwed.amount} for {this.props.paymentOwed.billName}
      </div>
    )
  }
})

var BillHistory = React.createClass({
  render: function() {
    return (
      <div>
        You paid {this.props.history.whoIsOwed} ${this.props.history.amount} for {this.props.history.billName} 
      </div>
    )
  }
})

var PaymentHistory = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.history.ower} paid you ${this.props.history.amount} for {this.props.history.billName}
      </div>
    )
  }
})

var BillForm = React.createClass({
  getInitialState: function() {
    return {
      splitEvenly: false
    }
  },
  splitEvenly: function(event) {
    event.preventDefault();
    console.log("SPLIT EVENLY");
    //access this.refs.amount.value
    var amount = this.refs.total.value;
    //divide total by number of roommates 
    var costPerUser = amount/this.props.users.length;
    var costPerUser = Math.ceil(costPerUser * 100) / 100;
    //iterate through users
    for(var i = 0; i < this.props.users.length; i++) {
      //set the user total to costPerUser
      this.props.users[i].total = costPerUser;
      //invert selected property
      this.props.users[i].selected = true;
    };
    console.log('USERS', this.props.users);
    this.createBill();
  },
  customSplit: function(event) {
    event.preventDefault();
    console.log("CUSTOM SPLIT");
    var updateSplitEvenly = this.state.splitEvenly ? false : true;
    if (this.state.splitEvenly) {
      updateSplitEvenly = false;
      $('.interface-container').css('min-height', '330px')
    } else {
      updateSplitEvenly = true;
      $('.interface-container').css('min-height', '590px')
    }
    this.setState({
      splitEvenly: updateSplitEvenly
    });
  },
  createBill: function(event) {
    //prevent default event action
    console.log("CREATE BILL");
    if (event) {
      event.preventDefault();
    }
    var totalsArray = this.props.users.map(function(item, i) {
      return parseInt(item.total); 
    });
    var customTotal = totalsArray.reduce(function(acc, curr) {
      if (!curr) {
        curr = 0;
      }
      return acc += curr; 
    }, 0); 
    //var userId = localStorage.getItem('userId');
    //create bill object based on user input
    var bill = {
      //on top of these, need access to the userId of
      //the person who created and access to all of the
      //users checked on the form and what they owe.
      //think about creating separate payment objects
      //in a different payment function for these. 
      //userId: userId,
      total: this.refs.total.value,
      name: this.refs.name.value,
      dueDate: this.refs.dueDate.value
    };
    if(customTotal !== parseInt(bill.total)) {
      // $('<div id="failure" class="alert alert-danger"><strong>Nerd!</strong> Get better at math.</div>').insertBefore('#bill-submit');
      $('#failure').show();
    } else {
      //call addBill with this object. 
      this.props.addBill(bill); 
      //reset input fields
      this.refs.billForm.reset();
      $( "#failure" ).hide();
      this.state.splitEvenly = false;
      // this.setState({
      //   splitEvenly: this.state.splitEvenly
      // });
      // $('.interface-container').css('min-height', '330px')
    }
  },

  render: function() {
    var userList = this.props.users.map(function(item, i) {
      item.selected = false; 
      return <UserEntry key={i} user={item} />
    }); 
    return (
      <div className='bill-form'>
        <form action="submit" ref='billForm' className="form-group form-bottom" onSubmit=''>
          <div className='input'>
            <div className="input-group full-width-input">
              <label htmlFor="bill-name">Bill Name</label>
              <input type="text" id="bill-name" ref='name' className="form-control" />
            </div>
            <div className="row">
              <div className="col-sm-6">
                <label htmlFor="bill-amount">Total</label> 
                <div className="input-group">
                  <div className="input-group-addon">$</div>
                  <input type="number" id="bill-amount" ref='total' className="form-control" />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="input-group">
                  <label htmlFor="bill-due-date">Due Date</label>
                  <input type="date" id="bill-due-date" ref='dueDate' className="form-control" />
                </div>
              </div>
            </div>
            <button className="btn btn-info btn-left" onClick={this.splitEvenly}>Split Evenly</button>
            <button className="btn btn-info btn-right" onClick={this.customSplit}>Custom Split</button>
            {this.state.splitEvenly ? <CustomSplitForm createBill={this.createBill} userList={userList} users={this.props.users} /> : null}
          </div>
        </form>
      </div>
    )
  }
});

var CustomSplitForm = React.createClass({
  render: function() {
    return (
      <div className="custom-split-container">
        <ul className='split-bill-user-list'>
          {this.props.userList}
        </ul>
        <div id="failure" className="alert alert-danger"><strong>Nerd!</strong> Get better at math.</div>
        <button id='bill-submit' className="btn btn-info" onClick={this.props.createBill}>Submit Bill</button>
      </div>
    )
  }
})

var UserEntry = React.createClass({
  setValue: function(id) {
    this.props.user.selected = true;
    this.props.user.total = this.refs[id].value;
    console.log('this.refs[id].value', !this.refs[id].value);
    if (!this.refs[id].value) {
      this.props.user.selected = false;
    }
  },

  render: function() {
    return (
      <li className="split-bill-user-entry">
        <div className="form-group custom-split-user">
          <p className="lead">{this.props.user.name}</p>
          <div className="input-group">
            <div className="input-group-addon">$</div>
            <input className="form-control" id="user-split-input" onKeyUp={this.setValue.bind(this, this.props.user.id)} ref={this.props.user.id} type='number'/>
          </div>
        </div>
      </li>
    )
  }
})

export default pendingBills;