import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TreeList from './components/TreeList/TreeList';
import FactoryNode from './components/TreeList/FactoryNode';
import FactoryChildNode from './components/TreeList/FactoryChildNode';
import treeApi from './util/treeApi';
import configSocketListeners from './util/configSocketListeners';
import toastr from 'toastr';
import io from 'socket.io-client';
import numberUtil from './util/numberUtil';
import clientValidate from './util/clientValidate';

// config toastr
toastr.options.preventDuplicates = true;

class App extends Component {
  state = {
    containerName: '',
    containerId: '',
    factories: [],
    showModal: false,
  }; // eslint-disable-line

  openModal() {
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  componentDidMount() {
    this.loadState();

    // set all socket event listeners
    const socket = io('http://localhost:3001');
    configSocketListeners(socket, this);
  }

  loadState() {
    treeApi.getContainers()
      .then((res) => {
        let data = res.data;
        if (data.length > 0) {
          /*
          * We're going to grab the first container here.
          * There are no backendroutes that allow you to create containers.
          * So, we'll only have the one container we created for this assesment.
          * */
          let container = data[0];
          this.setState({
            containerName: container.name,
            containerId: container._id,
            factories: container.children,
          });
        };
      })
      .catch(err => toastr.error('Failed to load tree-list. :-('));
  }

  handleFactoryNameChange(e) {
    let newName = e.target.value;
    const branchId = e.target.dataset['branchId'];
    const request = {
      name: newName
    };
    console.log(newName);
    treeApi.updateFactory(this.state.containerId, branchId, request)
      .catch(err => toastr.error('Failed to change factory name.'));
  }

  handleMinThresholdChange(e) {
    const request = {};
    treeApi.updateFactory()
      .catch(err => toastr.error('Failed to change factory name.'));
  }

  handleMaxThresholdChange(request) {
    treeApi.updateFactory(this.state.containerId, request)
      .catch(err => toastr.error('Failed to change factory name.'));
  }

  handleAddFactoryBranch() {
    const DEFAULT_FACTORY_NAME = 'New Factory';
    treeApi.addFactory(this.state.containerId, DEFAULT_FACTORY_NAME)
      .catch(err => toastr.error('Failed to add factory.'));
  }

  handleGenerateFactoryNodes(e) {
    const factoryId = e.target.dataset['branchId'];
    const factoryIndex = this.state.factories.findIndex(factory => factory._id === factoryId);
    if (factoryIndex !== -1) {
      const factory = this.state.factories[factoryIndex];

      // grab max value, min value, and total node values from the dom
      const minValue = factory.minChildValue;
      const maxValue = factory.maxChildValue;
      const totalNodes = 3;

      // check to see if the ranges are valid
      let errorMsg;
      if (errorMsg = clientValidate.validateNodeValueRange(minValue, maxValue)) {
        toastr.error(errorMsg);
        return;
      }

      const factoryChildLimit = factory.maxChildCount;
      const nodeValues = numberUtil.getRandomIntegers(minValue, maxValue, totalNodes);
      if (nodeValues.length > factoryChildLimit) {
        toastr.error(`The number of nodes specified for generation should be less than ${factoryChildLimit}.`)
        return;
      }

      // delete all node, and then add new nodes
      treeApi.deleteNodes(this.state.containerId, factoryId)
        .then((res) => {
          treeApi.addNodes(this.state.containerId, factoryId, minValue, maxValue, nodeValues)
          .catch(err => toastr.error('Failed to add factory nodes.'));
        })
        .catch(err => toastr.error('Failed to delete factory nodes'))
    } else {
      toastr.error('Failed to generate factory nodes.')
    }
  }

  handleDeleteFactoryNodes(factoryId, nodeId) {
    // treeApi.deleteNodes(this.state.containerId, factoryId)
    //   .then(res => toastr.info('Successfully deleted factory nodes.'))
    //   .catch(err => toastr.error('Failed to delete factory nodes.'));
  }

  handleDeleteFactoryBranch(e) {
    const factoryId = e.target.dataset['branchId'];
    treeApi.deleteFactory(this.state.containerId, factoryId)
      .catch(err => toastr.error('Failed to delete factory.'));
  }

  toggleBranch(e) {
    e.target.classList.toggle('fa-minus-square-o');
    e.target.classList.toggle('fa-plus-square-o');
    const branchId = e.target.dataset['branchId'];
    const branchElem = document.getElementById(`branch-${branchId}`);
    branchElem.classList.toggle('expanded');
  }

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
          treeName={this.state.containerName}
        >
          {
            this.state.factories ? this.state.factories.map((branch) => (
              <FactoryNode
                key={branch._id}
                branchId={branch._id}
                branchName={branch.name}
                minChildValue={branch.minChildValue}
                maxChildValue={branch.maxChildValue}
                toggleBranch={e => this.toggleBranch(e)}
                handleNameChange={e => this.handleFactoryNameChange(e)}
                handleDelete={e => this.handleDeleteFactoryBranch(e)}
                handleGenerateNodes={e => this.handleGenerateFactoryNodes(e)}
              >
                {
                  branch.children ? branch.children.map((branchChild) => (
                    <FactoryChildNode
                      key={branchChild._id}
                      deleteNode={(e) => this.handleDeleteFactoryNode(branch._id, branchChild._id)}
                    >
                      {branchChild.value}
                    </FactoryChildNode>
                  )) : null
                }
              </FactoryNode>
            ))
              : null
          }
        </TreeList>
        <div id="add-branch-div">
          <button className="add-branch" onClick={() => this.handleAddFactoryBranch()}>Add Branch</button>
        </div>

        {/* <button onClick={() => this.openModal()}>Open Modal</button> */}

      </div>
    );
  }
}

export default App;
