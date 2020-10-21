import { flow, makeAutoObservable } from "mobx";
import { persist } from "mobx-persist";
import axios from "axios";
export default class Auth {
  @persist
  loggedIn = false;

  @persist
  username = false;

  @persist
  token = "";

  loading = true;

  constructor() {
    makeAutoObservable(this, {
      validateToken: flow,
    });
  }

  login({ username, token }, cb) {
    this.loggedIn = true;
    this.username = username;
    this.token = token;
    if (cb) {
      cb();
    }
  }

  *validateToken() {
    if (!localStorage.data) return null;
    let res = yield axios.get("/api/auth/verifyToken", {
      headers: {
        authorization: JSON.parse(localStorage.data).token,
      },
    });
    if (!res.data.success) {
      this.logout();
    }
  }

  logout(cb) {
    this.loggedIn = false;
    this.username = "";
    this.token = "";
    localStorage.clear();
    if (cb) {
      cb();
    }
  }
}
