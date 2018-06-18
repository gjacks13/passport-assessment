import React from 'react';
import './TreeList.css';

class TreeList extends React.Component {
  render() {
    return (
      <ul class="tree-list">
        <div>
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
