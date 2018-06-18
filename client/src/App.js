import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TreeList from './components/TreeList/TreeList';
import FactoryNode from './components/TreeList/FactoryNode';
import FactoryChildNode from './components/TreeList/FactoryChildNode';

import io from 'socket.io-client';
const socket = io('http://localhost:3001');

const branches = [
  {
    "children": [
      {
        "value": 66,
        "minValue": 1,
        "maxValue": 25,
        "_id": "5b27264699242e697c60e506",
        "name": "b1factory5",
        "factoryId": "5b26d5788f9cda62e8d7722c",
        "__v": 0
      },
      {
        "value": 66,
        "minValue": 1,
        "maxValue": 25,
        "_id": "5b27264699242e697c60e506",
        "name": "b1factory5",
        "factoryId": "5b26d5788f9cda62e8d7722c",
        "__v": 0
      }
    ],
    "maxChildCount": 15,
    "minChildValue": 1,
    "maxChildValue": 300,
    "_id": "5b26d5788f9cda62e8d7722c",
    "name": "branch1",
  },
  {
    "children": [

      {
        "value": 3,
        "minValue": 1,
        "maxValue": 25,
        "_id": "454356",
        "name": "b2factory5",
        "factoryId": "35445",
        "__v": 0
      }
    ],
    "maxChildCount": 15,
    "minChildValue": 1,
    "maxChildValue": 300,
    "_id": "5b26d5788f9cda62e8d7722c",
    "name": "branch2",
  },
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <TreeList
          treeName="root"
        >
          {
            branches ? branches.map((branch) => (
              <FactoryNode
                branchId={branch._id}
                branchName={branch.name}
              >
                {
                  branch.children ? branch.children.map((branchChild) => (
                    <FactoryChildNode>
                      {branchChild.value}
                    </FactoryChildNode>
                  )) : null
                }
              </FactoryNode>
            ))
              : null
          }
        </TreeList>
      </div>
    );
  }
}

export default App;
