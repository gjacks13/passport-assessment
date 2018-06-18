import React from 'react'; // eslint-disable-line no-unused-vars

const FactoryChildNode = ({ children }) => {
  return (
    <li className="branch-node">
      {children}
    </li>
  );
};

export default FactoryChildNode;
