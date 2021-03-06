const Node = require('./Node')

class Trie extends Node {

  constructor() {
    super(null);
    this.words = 0;
    this.root = new Node(null);
  }

  insert(string, node = this.root) {
    //base case 
    string = string.toLowerCase();

    if (!string.length) {
      if (node.isWord) {
        return; 
      } else {
        node.isWord = true;
        this.words++;
        return;
      }
    }
    
    if (!node.children[string[0]]) {
      node.children[string[0]] = new Node(string[0]);
    } 

    return this.insert(string.substr(1), node.children[string[0]]);
  }

  suggest(string) {
    string = string.toLowerCase();
    const suggestArray = [];
    let currentNode = this.traverse(string);

    return this.findSuggestions(string, currentNode, suggestArray);
  }

  findSuggestions(string, currentNode, suggestArray) {
    if (currentNode.isWord) {
      suggestArray.push({word: string, favor: currentNode.favor});
    }

    if (currentNode.children) {
      let nextLetter = Object.keys(currentNode.children);

      nextLetter.forEach((value) => {
        let newNode = currentNode.children[value];
        let newWord = string + newNode.value;

        return this.findSuggestions(newWord, newNode, suggestArray);
      });
    }
    return this.sort(suggestArray);
  }

  sort(suggestArray) {
    suggestArray.sort((a, b) => b.favor - a.favor);
    return suggestArray.map(object => object.word);
  }

  select(string) {
    let currentNode = this.traverse(string);

    currentNode.favor++;
  }

  delete(string) {
    let currentNode = this.traverse(string);

    currentNode.isWord = false;
  }

  traverse(string) {
    let stringArray = [...string];
    let currentNode = this.root;

    stringArray.forEach((letter) => {
      currentNode = currentNode.children[letter];
    });
    return currentNode; 
  }

  populate(array) {
     
    array.forEach((word)=>{
      this.insert(word);
    });
  }

  count() {
    return this.words;
  }

}

module.exports = Trie;
