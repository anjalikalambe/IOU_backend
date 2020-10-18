const data = [
  {
    id: 1,
    item: "cookie",
    owed_by: "David",
    owed_to: "Anjali",
  },
  {
    id: 2,
    item: "cookie",
    owed_by: "Anjali",
    owed_to: "Zac",
  },
];
const newFavour = {
  id: 3,
  item: "cookie",
  owed_by: "Zac",
  owed_to: "David",
};
data.push(newFavour);

isCyclical(data) ? console.log("cycle exists") : console.log("no cycle exists");

function isCyclical(data) {
  let currentNode = data.find(
    (node) => node.id === newFavour.id
  );

  while (currentNode) {
    if (currentNode.owed_to === newFavour.owed_by) {
      return true;
    }
    currentNode = data.find((node) => node.owed_by === currentNode.owed_to);
  }
  return false;
}
