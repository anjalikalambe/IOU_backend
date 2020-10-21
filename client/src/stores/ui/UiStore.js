import GlobalView from "./GlobalView";

export default class UiStore {
  globalView;

  constructor(rootStore) {
    this.globalView = new GlobalView(rootStore);
  }
}