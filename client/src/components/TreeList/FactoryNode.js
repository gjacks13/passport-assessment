import React from 'react'; // eslint-disable-line no-unused-vars

const FactoryNode = ({ children, branchId, branchName, minChildValue, maxChildValue }) => {
  return (
    <li className="branch">
      <div id={`branch-${branchId}`} className="branch-header">
        <i id={`branch-expand-${branchId}`} className="fa fa-plus-square-o branch-expander" aria-hidden="true" data-branch-id='branchId'></i>
        <input className="branch-name-input" defaultValue={branchName} />
        <div className="factory-range grow">
          <input type="text" className="number-range" defaultValue={minChildValue} />
          :
          <input type="text" className="number-range" defaultValue={maxChildValue} />
        </div>
      </div>
      <ul>
        {children}
      </ul>
    </li>
  );
};

export default FactoryNode;
