import React, { useState } from 'react'
import './TopNav.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import Dropdown from './UI/Dropdown'
import { useStore } from '../stores/helpers/UseStore'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'

function TopNav() {
  const { auth } = useStore();

  const [showDropdown, setShowDropdown] = useState(false);

  const history = useHistory();

  const collapse = () => {
    if (showDropdown) {
      setTimeout(() => {
        setShowDropdown(false);
      }, 0);
    }
  }
  const logout = () => {
    auth.logout(() => history.push('/login'));
  }

  const expand = () => {
    if (!showDropdown) {
      setShowDropdown(true);
    }
  }
  return (
    <div id="topnav">
      <div className="notifications">
        <FontAwesomeIcon icon={faBell} />
      </div>
      <div className="profile">
        <div onClick={() => !showDropdown && expand()} className="profile__information flex align-center">
          <img src="/displaypic.png" alt="" />
          <span style={{textTransform: 'capitalize'}}>{auth.username} <FontAwesomeIcon icon={faCaretDown} /></span>
        </div>
        {showDropdown ? <Dropdown logout={logout} collapse={collapse} /> : ''}
      </div>
    </div>
  )
}
export default observer(TopNav);