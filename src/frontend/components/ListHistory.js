import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import { ButtonToolbar, Button, Grid, Row, Col, FormGroup, ControlLabel,
          FormControl } from 'react-bootstrap';
import Select from 'react-select';
import { ownWalletNames } from '../data/walletNames';
import { setShowTrans } from '../store/actions';

var ReactDataGrid = require('react-data-grid');


class ListHistory extends Component {
  constructor(props) {
    super(props);

    this.initColumns = this.initColumns.bind(this);
    this.getRowKey = this.getRowKey.bind(this);
    this.rowGetter = this.rowGetter.bind(this);
    this.loadDataFromStore = this.loadDataFromStore.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    let walletsToShow = '';
    let optOwnWallets = ownWalletNames.map(item=>{
      if (walletsToShow) walletsToShow = walletsToShow + "," + item.name;
      else walletsToShow = item.name;
      return {
                        value: item.name,
												label: item.name
      }
    })
    this.state={
      title: 'History',
      optOwnWallets,
      walletsToShow,
      rows: [],
      filters: {},
      columns: this.initColumns(),
    }
  }

  initColumns() {
    return [
              {
                key: 'transType',
                name: 'Type',
                editable: false,
                width: 150,
              },
              {
                key: 'source',
                name: 'Source Wallet',
                editable: false,
                width: 150,
              },
              {
                key: 'target',
                name: 'Target Wallet',
                editable: false,
                width: 150,
              },
              {
                key: 'amount',
                name: 'Amount',
                editable: false,
                width: 150,
              },
              {
                key: 'minAmt',
                name: 'Min Amount',
                editable: false,
                width: 150,
              },
              {
                key: 'maxAmt',
                name: 'Max Amount',
                editable: false,
                width: 150,
              },
          ];
  }

  componentWillMount() {
    this.loadDataFromStore();
  }

  componentDidMount() {
    this.handleFilterChange(this.state.walletsToShow);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (Object.keys(nextProps.transHistoryByTransId).length != Object.keys(this.props.transHistoryByTransId).length) {
      // this will update state
      this.loadDataFromStore(nextProps.transHistoryByTransId);
      // let changes to state to update component
      return false;
    }
    return true;
  }

  loadDataFromStore(transHistoryByTransId=this.props.transHistoryByTransId) {
//    let selectedKeys = {rowKey: this.getRowKey(), values:[]};
      let rows = Object.keys(transHistoryByTransId).map(transId=>{
                      let history = transHistoryByTransId[transId];
                      //selectedKeys.values[selectedKeys.values.length]=history[this.getRowKey()];
                      return {
                        transId: transId,
                        transType: history.transType,
                        source: history.source,
                        target: history.target,
                        amount: history.amount,
                        minAmt: history.minAmt,
                        maxAmt: history.maxAmt,
                      }
                    });

      this.setState({rows});

  }

  getRowKey() {
		return 'source';
	}

  rowGetter(i) {
    return this.state.rows[i];
  }

  handleFilterChange(event) {
    let walletsInArray = event.split(',');
    this.props.dispatch(setShowTrans(walletsInArray));
    this.setState({walletsToShow:event});
  }

  render() {

   return (
      <Grid>
        <Row>
          <Col md={5} className="history-title">
              <h4>{this.state.title}</h4>
          </Col>
          <Col md={7}>
              <FormGroup controlId={"walletsToShow"}>
      					<ControlLabel>Filter</ControlLabel>
      					<Select inline className="selectBasicData" id={"select_walletsToShow"}
      							multi={true}
      							simpleValue={true}
      							clearable={true} searchable={true}
      							value={this.state["walletsToShow"]}
      							options={this.state.optOwnWallets}
      							onChange={this.handleFilterChange}
      					/>
      				</FormGroup>
          </Col>
        </Row>
        <ReactDataGrid
  						rowKey ={this.getRowKey()}
  						columns={this.state.columns}
  						rowGetter={this.rowGetter}
  						rowsCount={this.state.rows.length}
  						minHeight={140}
  					/>
      </Grid>
    );
  }
}
const mapStateToProps = (state) => {
	return {
		transHistoryByTransId : state['walletTransactions']['byTransId']?state['walletTransactions']['byTransId']:{},
	};
};
export default connect(mapStateToProps)(ListHistory);
