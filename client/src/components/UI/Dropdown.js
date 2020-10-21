import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import enhanceWithClickOutside from 'react-click-outside'
import createReactClass from 'create-react-class'

const Dropdown = createReactClass({
  handleClickOutside() {
    this.props.collapse();
  },

  render() {
    return (
      <div className="profile__dropdown">
        <ul>
          <li className="profile__dropdown--link" onClick={this.props.logout}>
            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
            Logout
          </li>
        </ul>
      </div>
    )
  } 
})

export default enhanceWithClickOutside(Dropdown);