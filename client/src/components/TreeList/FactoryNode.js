import React from 'react'; // eslint-disable-line no-unused-vars

const FactoryNode = ({ children, branchId, branchName }) => {
  return (
    <li className="branch">
      <div id={`branch-${branchId}`} className="branch-header">
        <i id={`branch-expand-${branchId}`} className="fa fa-plus-square-o branch-expander" aria-hidden="true" data-branch-id='branchId'></i>
        <span>{branchName}</span>
        <div className="factory-range grow">
          32 : 7898
        </div>
      </div>
      <ul>
        {children}
      </ul>
    </li>
  );
};

export default FactoryNode;
