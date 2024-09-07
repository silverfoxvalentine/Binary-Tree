class Node {
  constructor(data) {
    this.data = data;
  }
  left = null;
  right = null;
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree = function (array) {
    if (array.length <= 0) return null;
    array = array
      .sort(function (a, b) {
        return a - b;
      })
      .filter((item, index) => array.indexOf(item) === index);

    let mid = Math.floor(array.length / 2);
    let root = new Node(array[mid]);

    root.left = this.buildTree(array.slice(0, mid));
    root.right = this.buildTree(array.slice(mid + 1));
    return root;
  };

  insert(value, node = this.root) {
    if (node) {
      if (node.data === value) return node;
      else if (node.data < value) {
        node.right = this.insert(value, node.right);
      } else if (node.data > value) {
        node.left = this.insert(value, node.left);
      }
    } else {
      if (node === this.root) return (this.root = new Node(value));
      node = new Node(value);
      return node;
    }
    return node;
  }

  delete(value, node = this.root) {
    if (node) {
      if (node.data === value) {
        if (!node.right) {
          return node.left;
        } else if (!node.left) {
          return node.right;
        } else {
          let nextBiggestNode = node.right;
          while (nextBiggestNode.left) {
            nextBiggestNode = nextBiggestNode.left;
          }
          this.delete(nextBiggestNode.data, this.root);
          node.data = nextBiggestNode.data;
          return node;
        }
      } else if (node.data < value) {
        node.right = this.delete(value, node.right);
      } else if (node.data > value) {
        node.left = this.delete(value, node.left);
      }
    } else {
      throw new Error("value  not found");
    }
    return node;
  }

  find(value, node = this.root) {
    if (node) {
      if (node.data === value) return node;
      else if (node.data < value) {
        return this.find(value, node.right);
      } else if (node.data > value) {
        return this.find(value, node.left);
      }
    } else {
      throw new Error("value  not found");
    }
  }

  levelOrder(callback) {
    if (!callback) {
      throw new Error("Please provide a callback function for levelOrder");
    } else if (!this.root) throw new Error("No nodes found in Tree");
    else {
      let queue = [this.root];
      while (queue.length) {
        let current = queue.shift();
        if (current.left) queue.push(current.left);
        if (current.right) queue.push(current.right);
        callback(current);
      }
    }
  }

  inOrder(callback, node = this.root) {
    if (!callback) {
      throw new Error("Please provide a callback function for inOrder");
    } else {
      if (!node) return;
      this.inOrder(callback, node.left);
      callback(node);
      this.inOrder(callback, node.right);
    }
  }

  preOrder(callback, node = this.root) {
    if (!callback) {
      throw new Error("Please provide a callback function for preOrder");
    } else {
      if (!node) return;
      callback(node);
      this.inOrder(callback, node.left);
      this.inOrder(callback, node.right);
    }
  }

  postOrder(callback, node = this.root) {
    if (!callback) {
      throw new Error("Please provide a callback function for postOrder");
    } else {
      if (!node) return;
      this.inOrder(callback, node.left);
      this.inOrder(callback, node.right);
      callback(node);
    }
  }

  height(value, node = this.find(value)) {
    if (!node) return -1;
    return (
      1 +
      Math.max(this.height(value, node.left), this.height(value, node.right))
    );
  }

  depth(value, node = this.root, depth = 0) {
    if (node) {
      if (node.data === value) return depth;
      else if (node.data < value) {
        depth += 1;
        return this.depth(value, node.right, depth);
      } else if (node.data > value) {
        depth += 1;
        return this.depth(value, node.left, depth);
      }
    } else {
      throw new Error("value  not found");
    }
  }

  isBalanced(tree = this) {
    if (!this.root) throw new Error("no nodes in the tree");
    let isBalanced = true;
    let isNodeBalanced = function (node) {
      if (node) {
        let left = 1 + tree.height(node.data, node.left);
        let right = 1 + tree.height(node.data, node.right);
        if (left - right > 1 || left - right < -1) {
          return (isBalanced = false);
        }
      }
    };
    this.levelOrder(isNodeBalanced);
    return isBalanced;
  }

  rebalance() {
    let newArray = [];
    let getData = function (node) {
      newArray.push(node.data);
    };
    this.levelOrder(getData);
    this.root = this.buildTree(newArray);
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

function randomNumbersArray(length = 10) {
  return Array.from(Array(length), () => Math.floor(Math.random() * 100) + 1);
}

let tree = new Tree(randomNumbersArray());
prettyPrint(tree.root);
console.log("is tree balanced? " + tree.isBalanced());
tree.insert(122);
tree.insert(133);
tree.insert(144);
prettyPrint(tree.root);
console.log("is tree balanced? " + tree.isBalanced());
tree.rebalance();
prettyPrint(tree.root);
console.log("is tree balanced? " + tree.isBalanced());
