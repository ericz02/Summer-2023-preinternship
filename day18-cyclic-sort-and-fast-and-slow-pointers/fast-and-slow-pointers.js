class Node {
  constructor(value, next=null) {
    this.value = value;
    this.next = next;
  }
}

function hasCycle(head) {
  let fast = head;
  let slow = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next; // move one step
    fast = fast.next.next; // move two steps
    if (slow === fast) { // found the cycle
      return true;
    }
  }
  return false;

}

module.exports = {
  hasCycle,
  Node
};
