import React, { PropTypes } from 'react'
import NavLink from './NavLink'

// linkNames for navbar
const linkNames = ['Messages', 'Contact Landlord', 'Finances', 'Chores']

const NavMenu = ({
  currentView: ui.currentView,
  isLandlord: ui.isLandlord,
  changeView,
  counters
}) => (
  <ul className="nav navbar-nav flexbox">
    <li className="flex-children">
      <img src="./images/obie_logo.png" height="30px" />
    </li>
    {linkNames.map(link => 
      <NavLink 
        onClick={() => changeView(link)}
        currentView={currentView}
        text={link.text}
        key={link.render}
        count={counters[currentView.render]}
      />
    )}
    <li>
      <a href="/logout">Logout</a>
    </li>
  </ul>
)

// NavMenu.propTypes = {
//   onClick: PropTypes.func.isRequired,
//   key: PropTypes.string.isRequired,
//   currentView: PropTypes.string.isRequired,
//   text: PropTypes.string.isRequired
// }

export default NavMenu