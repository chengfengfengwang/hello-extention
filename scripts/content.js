console.log('hello world');


var parentElement = document.querySelector('body');
//获得第一个子节点的引用
var theFirstChild = parentElement.firstChild;

//创建新元素
const h1 = document.createElement('h1');
h1.innerHTML = 'hello world11'

//在第一个子节点之前插入新元素
parentElement.insertBefore(h1, theFirstChild);