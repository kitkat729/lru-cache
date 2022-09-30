export interface ListNode<K, V> {
  key: K;
  value: V | undefined;
  prev: ListNode<K, V> | null;
  next: ListNode<K, V> | null;
}
