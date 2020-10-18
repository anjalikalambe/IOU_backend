const data = [
  {
    id: 1,
    item: "cookie",
    owed_by: "Bragg",
    owed_to: "Anjali",
  },
  {
    id: 2,
    item: "cookie",
    owed_by: "Anjali",
    owed_to: "Zac",
  },
  {
    id: 3,
    item: "cookie",
    owed_by: "Zac",
    owed_to: "Test",
  },
  {
    id: 4,
    item: "cookie",
    owed_by: "Test",
    owed_to: "David",
  },
];
const newFavour = {
  id: 5,
  item: "cookie",
  owed_by: "David",
  owed_to: "Bragg",
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