import React from 'react'; // eslint-disable-line no-unused-vars
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
//ellipsis-v
const FactoryNode = (props) => {
  //{ children, branchId, branchName, minChildValue, maxChildValue, toggleBranch }
  return (
    <li className="branch">
      <div id={`branch-${props.branchId}`} className="branch-header">
        <i id={`branch-expand-${props.branchId}`}
          className="fa fa-plus-square-o branch-expander"
          aria-hidden="true"
          data-branch-id={props.branchId}
          onClick={props.toggleBranch}
        />
        <input
          className="branch-name-input"
          value={props.branchName}
          onChange={props.handleNameChange}
          data-branch-id={props.branchId}
        />
        <div className="factory-range grow" title="Click either number to change the min and max values for node generation.">
          <input type="text" className="number-range" defaultValue={props.minChildValue} data-branch-id={props.branchId} />
          :
          <input type="text" className="number-range" defaultValue={props.maxChildValue} data-branch-id={props.branchId} />
        </div>
        <button 
          className="delete-factory" 
          data-branch-id={props.branchId}
          onClick={props.handleDelete}
        >
          Delete
        </button>
        <button className="generate-nodes" 
          data-branch-id={props.branchId} 
          onClick={props.handleGenerateNodes}
        >
          Generate Nodes</button>
      </div>
      <ul>
        {props.children}
      </ul>
    </li>
  );
};

export default FactoryNode;
