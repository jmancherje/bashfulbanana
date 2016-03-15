import React, { PropTypes } from 'react'

const NavLink = ({
  onClick,
  currentView,
  text,
  key,
  count
}) => (
  <li 
    className="inner-flex"
    style={{
      fontWeight: currentView === text ? 'bold' : 'normal'
    }}
    >
    <a onClick={onClick} >
      {text}
      <span className="notification-count">
        3
      </span>
    </a>
  </li>
)

// NavLink.propTypes = {
//   onClick: PropTypes.func.isRequired,
//   currentView: PropTypes.string.isRequired,
//   text: PropTypes.string.isRequired
// }

export default NavLink