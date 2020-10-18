const data = [
  {
    item: "cookie",
    owed_by: "David",
    owed_to: "Anjali",
  },
  {
    item: "cookie",
    owed_by: "Anjali",
    owed_to: "Zac",
  },
];
const newFavour = {
  item: "cookie",
  owed_by: "Zac",
  owed_to: "David",
};
data.push(newFavour);

if (isCyclical(data)) {
  console.log("cycle exists");
} else {
  console.log("no cycle exists");
}

function isCyclical(data) {
  let currentNode = data.find(
    (node) => node.item === newFavour.item && node.owed_by === newFavour.owed_by
  );

  while (currentNode) {
    if (currentNode.owed_to === newFavour.owed_by) {
      return true;
    }
    currentNode = data.find((node) => node.owed_by === currentNode.owed_to);
  }
  return false;
}
