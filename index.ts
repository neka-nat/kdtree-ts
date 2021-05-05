import quickselect from "./quickselect";
import { BoundedPQueue } from "./boundedpqueue";

// https://github.com/gishi523/kd-tree/blob/master/kdtree.h
export class Node {
    index?: number;
    next: Node[];
    axis?: number;
    constructor() {
        this.next = [];
    }
}

export class KDTree {
    root?: Node;
    points: number[][];
    dim: number;
    constructor(points: number[][], dim: number) {
        this.points = points;
        this.dim = dim;
        this.buildTree();
    }

    buildTree() {
        const indices: number[] = [...Array(this.points.length)].map((_, i) => (i));;
        this.root = this.buildTreeRecurse(indices, this.points.length, 0);
    }

    buildTreeRecurse(indices: number[], npoints: number, depth: number): Node {
        if (npoints <= 0) {
            return new Node();
        }
        const axis = depth % this.dim;
        const mid = Math.floor((npoints - 1) / 2);
        quickselect<number>(indices, mid, 0, npoints - 1, (lhs: number, rhs: number) => {
            return this.points[lhs][axis] < this.points[rhs][axis] ? -1 : this.points[lhs][axis] > this.points[rhs][axis] ? 1 : 0;
        });
        let node = new Node();
        node.index = indices[mid];
        node.axis = axis;
        node.next.push(this.buildTreeRecurse(indices, mid, depth + 1));
        node.next.push(this.buildTreeRecurse(indices.slice(mid + 1), npoints - mid - 1, depth + 1));
        return node;
    }

    knnSearch(query: number[], k: number): number[] {
        let queue = new BoundedPQueue<number, number>(k);
        queue = this.knnSearchRecurse(query, this.root, queue, k);
        let indices = new Array<number>();
        for (let i = 0; i < queue.items().length; i++) {
            let max = queue.extractMax();
            if (typeof max !== 'undefined') {
                indices.push(max[1]);
            }
        }
        return indices;
    }

    distance(x: number[], y: number[]): number {
        let sum2 = 0;
        for (let i = 0; i < x.length; i++) {
            sum2 += (x[i] - y[i]) * (x[i] - y[i]);
        }
        return Math.sqrt(sum2);
    }

    knnSearchRecurse(query: number[], node: Node | undefined, queue: BoundedPQueue<number, number>, k: number): BoundedPQueue<number, number> {
        if (typeof node === 'undefined') {
            return queue;
        }
        if (typeof node.index !== 'undefined' && typeof node.axis !== 'undefined') {
            let train = this.points[node.index];
            let dist = this.distance(train, query);
            queue.add(dist, node.index);
            const dir = query[node.axis] < train[node.axis] ? 0 : 1;
            queue = this.knnSearchRecurse(query, node.next[dir], queue, k);
            const diff = Math.abs(query[node.axis] - train[node.axis]);
            if (queue.items().length < k || diff < queue.max()) {
                queue = this.knnSearchRecurse(query, node.next[1 - dir], queue, k);
            }
        }
        return queue;
    }
}

