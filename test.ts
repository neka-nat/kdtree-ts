import { KDTree } from "./";

let points = [[1.0, 0.0, 0.0], [0.0, 0.0, 1.0], [0.0, 1.0, 0.0]];
let tree = new KDTree(points, 3);
console.log(JSON.stringify(tree));

let ans = tree.knnSearch([1.0, 0.0, 0.0], 1);
console.log(ans);