import React from 'react';
import './TreeList.css';

class TreeList extends React.Component {

  render() {
    return (
      <ul className="tree-list">
        <div className="container-name">
          <span>
            {this.props.treeName}
          </span>
        </div>
        {this.props.children}
      </ul>
    );
  }
}

export default TreeList;
