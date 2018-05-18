import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import { ButtonToolbar, Button, Grid, Row, Col, FormGroup, ControlLabel,
          FormControl } from 'react-bootstrap';
import { receiptWalletNames, ownWalletNames, paymentWalletNames } from '../data/walletNames';
import { processTrans } from '../store/actions';
import { transaction } from '../data/transaction';
import idGenerator from 'react-id-generator';

class AddTransaction extends Component {
  constructor(props) {
    super(props);

    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.handleChangeWallet = this.handleChangeWallet.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleAmtChange = this.handleAmtChange.bind(this);
    this.onToggleHistory = this.onToggleHistory.bind(this);
    this.showHistoryListNow = this.showHistoryListNow.bind(this);
    this.validateEntries = this.validateEntries.bind(this);
    this.state = {
      returns: false,
      optReceiptWallet: null,
      optOwnWallet: null,
      optPaymentWallet: null,
      from: '',
      to: '',
      optFromWallet: [],
      optToWallet: [],
      title: 'WALLET TRANSACTIONS',
      showHistoryList: true,
      transType: '',
      w_fromWallet: '',
      w_toWallet: '',
      amount: '',
      minAmt: '',
      maxAmt: '',
    }
  }

  onToggleHistory(event) {
    event.preventDefault();
    this.setState({showHistoryList: !this.state.showHistoryList}, this.showHistoryListNow);
  }

  showHistoryListNow() {
    this.props.showHistoryList(this.state.showHistoryList);
  }

  handleChangeWallet(event) {
    event.preventDefault();
    let target = event.target;
    this.setState({[target.id]:target.value});
  }

  handleTypeChange(event) {
    event.preventDefault();
    let target = event.target;
    let optFromWallet = this.state.optFromWallet;
    let optToWallet = this.state.optToWallet;
    let from = this.state.from;
    let to = this.state.to;
    if (target.id === 'transType') {
      if (target.value === 'Receipt') {
        from = 'Receipt Wallet';
        to = 'Your Wallet';
        optFromWallet = this.state.optReceiptWallet;
        optToWallet = this.state.optOwnWallet;
      } else {
        from = 'Your Wallet';
        to = 'Payment Wallet';
        optFromWallet = this.state.optOwnWallet;
        optToWallet = this.state.optPaymentWallet;
      }
    }
    this.setState({[target.id]:target.value, from, to, optFromWallet, optToWallet});
  }

  handleAmtChange(event) {
    event.preventDefault();
    let target = event.target;
    if (isNaN(target.value)) return;
    let value = target.value? parseInt(target.value):target.value;
    this.setState({[target.id]:value});
  }

  onSave() {
    let trans = {
      transId: idGenerator(),
      transType: this.state.transType,
      source: this.state.w_fromWallet,
      target: this.state.w_toWallet,
      amount: this.state.amount,
      minAmt: this.state.minAmt,
      maxAmt: this.state.maxAmt,
    }
    this.props.dispatch(processTrans(this.state.transType, trans))
                    .then(()=>this.setState({ transType:'', from:'', to:'',
                                              optFromWallet:[], optToWallet:[],
                                              w_fromWallet:'', w_toWallet:'',
                                              amount:'', minAmt:'', maxAmt:''}));
  }

  onCancel() {
    this.setState({returns:true});
  }

  componentWillMount() {
    let optReceiptWallet = receiptWalletNames.map(item=>
      <option key={item['name']} value={item['name']}>{item['name']}</option>
    );
    let optOwnWallet = ownWalletNames.map(item=>
      <option key={item['name']} value={item['name']}>{item['name']}</option>
    );
    let optPaymentWallet = paymentWalletNames.map(item=>
      <option key={item['name']} value={item['name']}>{item['name']}</option>
    );
    this.setState({optReceiptWallet, optOwnWallet, optPaymentWallet});
  }

  validateEntries() {
    if (this.state.transType &&
        this.state.w_fromWallet &&
        this.state.w_toWallet &&
        this.state.amount &&
        this.state.minAmt &&
        this.state.maxAmt) {
            if (this.state.amount >= this.state.minAmt && this.state.amount <= this.state.maxAmt) {
              return true;
            }
    }
    return false;
  }

  render() {
    if (this.state.returns) {
      let param = {
        pathname: '/'
      }
      return <Redirect to={param} />;
    }
    return (
      <Grid className='add-transaction'>
        <Row>
          <Col md={4}>
            <h3>{this.state.title}</h3>
          </Col>
          <Col md={6}>
            <Button onClick={this.onToggleHistory}>{this.state.showHistoryList? 'Hide History':'Show History'}</Button>
          </Col>
          <Col md={2}>
            <ButtonToolbar>
              <Button disabled={!this.validateEntries()} onClick={this.onSave}>Transfer</Button>
              <Button onClick={this.onCancel}>Cancel</Button>
            </ButtonToolbar>
          </Col>

        </Row>
        <Row>
          <Col md={2}>
              <FormGroup controlId="transType">
                <ControlLabel>Type</ControlLabel>
                <FormControl value={this.state['transType']} onChange={this.handleTypeChange} componentClass="select" placeholder="select">
                  <option value=''></option>
                  <option value='Receipt'>Receipt</option>
                  <option value='Payment'>Payment</option>
                </FormControl>
              </FormGroup>
          </Col>
          <Col md={2}>
              <FormGroup controlId="w_fromWallet">
                <ControlLabel>{this.state.from}</ControlLabel>
                <FormControl  value={this.state['w_fromWallet']}
                              onChange={this.handleChangeWallet}
                              componentClass="select"
                              disabled={!this.state['transType']}
                              placeholder="select">
                  <option value=''></option>
                  {this.state.optFromWallet}
                </FormControl>
              </FormGroup>
          </Col>
          <Col md={2}>
              <FormGroup controlId="w_toWallet">
                <ControlLabel>{this.state.to}</ControlLabel>
                <FormControl  value={this.state['w_toWallet']}
                              onChange={this.handleChangeWallet}
                              componentClass="select"
                              disabled={!this.state['transType']}
                              >
                  <option value=''></option>
                  {this.state.optToWallet}
                </FormControl>
              </FormGroup>
          </Col>

          <Col md={2}>
              <FormGroup controlId="amount" key="amount">
        				<ControlLabel>Amount</ControlLabel>
        				<FormControl 	type={this.props.type}
        							key="amount"
        							value={this.state.amount}
        							onChange={this.handleAmtChange}
                      disabled={!this.state['transType']}
                />
        			</FormGroup>
          </Col>
          <Col md={2}>
              <FormGroup controlId="minAmt" key="minAmt">
                <ControlLabel>Min Amt</ControlLabel>
                <FormControl 	type="text"
                      key="minAmt"
                      value={this.state.minAmt}
                      onChange={this.handleAmtChange}
                      disabled={!this.state['transType']}
                />
              </FormGroup>
          </Col>
          <Col md={2}>
              <FormGroup controlId="maxAmt" key="maxAmt">
                <ControlLabel>Max Amt</ControlLabel>
                <FormControl 	type="text"
                      key="maxAmt"
                      value={this.state.maxAmt}
                      onChange={this.handleAmtChange}
                      disabled={!this.state['transType']}
                />
              </FormGroup>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(connect()(AddTransaction));
