import { ListNode } from './types';
import { DEFAULT_CAPACITY } from './constants';

class LruCache<K, V> {
  private _capacity = DEFAULT_CAPACITY;
  private storageHead: ListNode<K, V> | null;
  private storageTail: ListNode<K, V> | null;
  private map: Map<K, ListNode<K, V>>;
  private _size = 0;

  constructor(capacity = DEFAULT_CAPACITY) {
    this.capacity = capacity;
    this.storageHead = null; // most accessed node stored at the front
    this.storageTail = null;
    this.map = new Map<K, ListNode<K, V>>();
  }

  protected set capacity(capacity: number) {
    this._capacity = capacity < DEFAULT_CAPACITY ? DEFAULT_CAPACITY : capacity;
  }

  protected get capacity() {
    return this._capacity;
  }

  get size() {
    return this._size;
  }

  init() {
    this.storageHead = null; // most accessed node stored at the front
    this.storageTail = null;
    this.map.clear();
    this._size = 0;
  }

  /**
   * Insert new key with item or overwrite existing key with item
   *
   * @param {K} key
   * @param {V | undefined} value
   * @return {boolean} True if successful, otherwise false
   */
  put(key: K, value: V | undefined) {
    let node = this.map.has(key) ? this.map.get(key) : null;
    let isSuccess = false;

    // Considerations:
    // key exists
    // _capacity is full
    // _capacity is 0

    if (node) {
      node.value = value;
      this.storageHead && this.moveNodeBefore(node, this.storageHead);
      isSuccess = true;
    } else {
      // Cache not empty and reached capacity
      if (this.isFull() && this.storageTail) {
        // bring the size below the capacity by removing a least recently used item
        const n = this.removeNode(this.storageTail);

        n.key && this.map.delete(n.key);
        this._size--;
      }

      if (this._size < this.capacity) {
        node = { key, value } as ListNode<K, V>;
        this.prependNode(node);
        this._size++;
        this.map.set(key, node);
        isSuccess = true;
      }
    }

    return isSuccess;
  }
  /**
   * Get the item associated with the key
   *
   * @param {K} key
   * @return {V | undefined}
   */
  get(key: K): V | undefined {
    const node = this.map.has(key) ? this.map.get(key) : null;

    if (node) {
      this.storageHead && this.moveNodeBefore(node, this.storageHead);

      return node.value;
    }

    return undefined;
  }

  isFull() {
    return this._size === this.capacity;
  }

  /**
   * Add the node to the list front
   *
   * @param {ListNode} node
   * @return {ListNode}
   */
  protected prependNode(node: ListNode<K, V>) {
    if (this.storageHead) {
      this.storageHead.prev = node;
      node.next = this.storageHead;
    }
    this.storageHead = node;
    if (!this.storageTail) {
      this.storageTail = node;
    }

    return node;
  }
  // appendNode(node: ListNode<K, V>) {
  //   if (this.storageTail) {
  //     this.storageTail.next = node;
  //     node.prev = this.storageTail;
  //   }
  //   this.storageTail = node;
  //   if (!this.storageHead) {
  //     this.storageHead = node;
  //   }

  //   return node;
  // }
  /**
   * Remove the node from list
   *
   * @param {ListNode} node
   * @return {ListNode}
   */
  protected removeNode(node: ListNode<K, V>) {
    // Detach the node from the list
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;

    // Adjust head and tail pointers
    if (this.storageHead === node) {
      if (node.next) {
        // This condition is not reachable if the node being removed is always the last node.
        // It can be reached if the node being removed is the head node and the node also links to a second node
        this.storageHead = node.next;
      } else {
        this.storageHead = null;
      }
    }
    if (this.storageTail === node) {
      if (node.prev) {
        this.storageTail = node.prev;
      } else {
        this.storageTail = null;
      }
    }

    node.prev = null;
    node.next = null;

    return node;
  }
  /**
   * Move the node in front of the target node. Does not increment size.
   *
   * @param {ListNode} node
   * @param {ListNode} target
   */
  protected moveNodeBefore(node: ListNode<K, V>, target: ListNode<K, V>) {
    if (node === target) return;

    // Node in the correct position
    if (node.next === target) return;

    node = this.removeNode(node);

    // Attach node
    // links between node and the node before target
    if (target.prev) {
      // This condition is not reachable if the target node is always the head node.
      target.prev.next = node;
    }
    node.prev = target.prev;

    // links between node and target
    target.prev = node;
    node.next = target;

    if (this.storageHead === target) {
      this.storageHead = node;
    }
  }
  getMruValue() {
    return this.storageHead ? this.storageHead.value : undefined;
  }
  getLruValue() {
    return this.storageTail ? this.storageTail.value : undefined;
  }
  /**
   * Remove all cached items
   */
  clear() {
    this.init();
  }
  // printMap() {
  //   this.map.forEach((node, key) => {
  //     console.log(`key = ${key}`);
  //     //console.log(node);
  //     console.log(node.value);
  //   });
  // }
  // printList() {
  //   let node = this.storageHead;

  //   while (node) {
  //     console.log(node.value);
  //     node = node.next;
  //   }
  // }
}

export default LruCache;
