import React, { Component } from 'react';
import AddTransaction from './components/AddTransaction';
import ListHistory from './components/ListHistory';
import GraphicalTransaction from './components/GraphicalTransaction';

class App extends Component {
  constructor(props) {
    super(props);

    this.showHistoryList = this.showHistoryList.bind(this);

    this.state = {
      showHistoryList: true,
    }
  }

  showHistoryList(showHistoryList) {
    this.setState({showHistoryList});
  }

  render() {
    return (
      <div className="wallet-container">
          <div className="add-transaction">
              <AddTransaction showHistoryList={this.showHistoryList} />
          </div>
          {this.state.showHistoryList &&
            <div className="list-history">
                <ListHistory />
            </div>
          }

          <GraphicalTransaction className="graphical-display" />

      </div>
    );
  }
}

export default App;
