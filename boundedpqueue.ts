
// https://github.com/jhagege/BoundedPriorityQueue/blob/master/bounded_priority_queue.py
export class BoundedPQueue<K, V> {
    private heap: [K, V][];
    private k: number;

    constructor(k: number) {
        this.heap = [];
        this.k = k;
    }

    items(): [K, V][] {
        return this.heap;
    }

    parent(index: number): number {
        return Math.floor(index / 2);
    }

    leftChild(index: number): number {
        return 2 * index + 1;
    }

    rightChild(index: number): number {
        return 2 * index + 2;
    }

    max(): K {
        return this.heap[0][0];
    }

    maxHeapify(index: number) {
        const left_index = this.leftChild(index);
        const right_index = this.rightChild(index);
        let largest = index;
        if (left_index < this.heap.length && this.heap[left_index][0] > this.heap[index][0]) {
            largest = left_index;
        }
        if (right_index < this.heap.length && this.heap[right_index][0] > this.heap[index][0]) {
            largest = right_index;
        }
        if (largest != index) {
            [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
            this.maxHeapify(largest);
        }

    }

    extractMax(): [K, V] {
       const max = this.heap[0];
       const data = this.heap.pop();
       if (typeof data !== 'undefined' && this.heap.length > 0) {
           this.heap[0] = data;
           this.maxHeapify(0);
       }
       return max;
    }

    propagateUp(index: number) {
        let cur_idx = index;
        while (cur_idx != 0 && this.heap[this.parent(cur_idx)][0] < this.heap[cur_idx][0]) {
            [this.heap[cur_idx], this.heap[this.parent(cur_idx)]] = [this.heap[this.parent(cur_idx)], this.heap[cur_idx]];
            cur_idx = this.parent(cur_idx);
        }
    }

    heapAppend(key: K, value: V) {
        this.heap.push([key, value]);
        this.propagateUp(this.heap.length - 1);
    }

    add(key: K, value: V) {
        const size = this.heap.length;
        if (size == this.k) {
            const max_elem = this.max();
            if (key < max_elem) {
                this.extractMax();
                this.heapAppend(key, value);
            }
        } else {
            this.heapAppend(key, value);
        }
    }
}