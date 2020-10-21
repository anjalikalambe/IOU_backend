import React from 'react'
import './SideNav.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons'
import { faGift } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { faScroll } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
// import {  withRouter } from 'react-router-dom'

class Home extends React.Component {
  render = () =>
    <div id="sidenav">
      <div className="logo">
        <span style={{marginRight: '6px'}}>IOU</span>
        <FontAwesomeIcon icon={faHeart} />
      </div>
      <div className="links">
        <NavLink to="/give-someone">
          <div className="link">
            <FontAwesomeIcon icon={faGift} />
            <span>Gift favours</span>
          </div>
        </NavLink>
        <NavLink to="/get-someone">
          <div className="link">
            <FontAwesomeIcon icon={faHandHoldingUsd} />
            <span>Claim rewards</span>
          </div>
        </NavLink>
        <NavLink to="/public-requests">
          <div className="link">
            <FontAwesomeIcon icon={faUsers} />
            <span>Public requests</span>
          </div>
        </NavLink>
        <NavLink to="/leaderboard">
          <div className="link">
            <FontAwesomeIcon icon={faScroll} />
            <span>Leaderboard</span>
          </div>
        </NavLink>
        
      </div>
    </div>
}

export default Home