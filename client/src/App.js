import React, { useEffect } from "react";
import "./App.scss";
import TopNav from "./components/TopNav";
import SideNav from "./components/SideNav";
import Home from "./views/Home";
import HomeLeaderboard from "./views/HomeLeaderboard";
import HomeRequests from "./views/HomeRequests";
import Login from "./views/Login";
import ClaimRewards from "./views/ClaimRewards";
import GiftFavours from "./views/GiftFavours";
import PublicRequests from "./views/PublicRequests";
import Leaderboard from "./views/Leaderboard";
import { withRouter } from "react-router-dom";
import { useStore } from "./stores/helpers/UseStore";
import { observer } from "mobx-react-lite";
import ProtectedRoute from "./utils/ProtectedRoute";
import UnprotectedRoute from "./utils/UnprotectedRoute";

function App() {
  const { auth } = useStore();

  useEffect(() => {
    auth.validateToken();
  }, []);

  return (
    <div id="app">
      <UnprotectedRoute path="/" exact component={Home} />
      <UnprotectedRoute path="/home-leaderboard" component={HomeLeaderboard} />
      <UnprotectedRoute path="/home-requests" component={HomeRequests} />
      <UnprotectedRoute path="/login" component={Login} />
      <UnprotectedRoute path="/register" component={Login} />
      {auth.loggedIn && <SideNav />}
      <div
        className="main"
        style={{ display: auth.loggedIn ? "block" : "none" }}
      >
        {auth.loggedIn && <TopNav />}
        <div className="component-wrapper">
          <ProtectedRoute path="/get-someone" component={ClaimRewards} />
          <ProtectedRoute path="/give-someone" component={GiftFavours} />
          <ProtectedRoute path="/public-requests" component={PublicRequests} />
          <ProtectedRoute path="/leaderboard" component={Leaderboard} />
        </div>
      </div>
    </div>
  );
}

export default withRouter(observer(App));
