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

  /**
  * method for child component to hide the History element
  */
  showHistoryList(showHistoryList) {
    this.setState({showHistoryList});
  }

  /**
  * Render 3 parts:
  * Part 1: AddTransaction for user to add transaction between wallet
  * Part 2: ListHistory to list all the transaction performed
  * Part 3: GraphicalTransaction to display the transactions in graphical format
  */
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
