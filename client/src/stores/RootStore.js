import { create } from 'mobx-persist'

// import DataStore from "./data/DataStore";
import AuthStore from './data/auth'
import UiStore from "./ui/UiStore";

const hydrate = create({
  storage: localStorage
})

export default class RootStore {
  auth = new AuthStore();
  uiStore = new UiStore();

  constructor() {
    hydrate('data', this.auth)
  }
}