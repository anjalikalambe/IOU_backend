import React from "react";
import "./HomeNav.scss";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const HomeNav = () => {
  return (
    <header className="navbar">
      <div className="nav content-wrapper justify-between align-center">
        <div className="logo flex align-center">
          <div style={{ marginRight: "6px", fontSize: "30px" }}>IOU</div>
          <FontAwesomeIcon icon={faHeart} style={{ color: "#6030b1" }} />
        </div>
        <div className="links align-center justify-between">
          <NavLink to="/" exact className="link">
            Home
          </NavLink>
          <NavLink to="/home-requests" exact className="link">
            Public Requests
          </NavLink>
          <NavLink to="/home-leaderboard" exact className="link">
            Leaderboard
          </NavLink>
          <NavLink to="/login" exact className="btn-contact">
            LOGIN
          </NavLink>
        </div>
        {/* <PhoneMenu /> */}
      </div>
    </header>
  );
};

export default HomeNav;
