import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ButtonToolbar, Button, Grid, Row, Col, FormGroup, ControlLabel,
          FormControl } from 'react-bootstrap';
import { receiptWalletNames, ownWalletNames } from '../data/walletNames';
import { processTrans } from '../store/actions';
import { transaction } from '../data/transaction';
import idGenerator from 'react-id-generator';

const line_thickness_radio = 1000;
const line_thickness_max = 10;
const dim_wallet_width = 80;
const dim_wallet_height = 30;
const dim_wallet_margin_vertical = 70;
const dim_wallet_margin_horizontal = 100;
const dim_wallet_margin = 10;
const wallet_color = ['#457FB2','#7C5194','#F93D66'];
const pos_col_start = [200,500,800];

function drawWallets(col, sourceDrawn, sourceWallet, targetWallet,
                      sourceWalletCnt, targetWalletCnt, walletInfo, pFromPos) {
    const {transIds, amount, minAmt, maxAmt} = walletInfo;
    let fromPos, toPos;
    if (!sourceDrawn) {
      fromPos = drawWallet(col, sourceWallet, sourceWalletCnt, walletInfo);
    } else {
      fromPos = pFromPos;
    }
    toPos = drawWallet(col+1, targetWallet, targetWalletCnt, walletInfo);

    drawLine(fromPos, toPos, amount);
    return toPos;
}

function drawLine(fromPos, toPos, amount) {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  ctx.beginPath();
  let fromX = fromPos[0]+dim_wallet_width;
  let fromY = fromPos[1]+(dim_wallet_margin_vertical/2);
  let toX = toPos[0];
  let toY = toPos[1]+(dim_wallet_margin_vertical/2);
  let lineWidth = ((amount/line_thickness_radio) >= 1)? (amount/line_thickness_radio):1 ;
  lineWidth = lineWidth > line_thickness_max?line_thickness_max:lineWidth;
  ctx.moveTo(fromX, fromY);
  ctx.lineWidth = lineWidth;
  ctx.lineTo(toX, toY);
  ctx.stroke();
}

// Draw the rectange, and return the x, y , width and height in array
function drawWallet(col, wallet, cnt, walletInfo) {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  let x = pos_col_start[col];
  let y = dim_wallet_margin_vertical + ((dim_wallet_margin_vertical + dim_wallet_height) * (cnt-1));
  ctx.fillStyle=wallet_color[col];
  ctx.fillRect(x, y, dim_wallet_width, dim_wallet_width);
  ctx.font="10px Georgia";
  ctx.textAlign="center";
  ctx.textBaseline = "middle";
  ctx.fillStyle='black';
  ctx.fillText(wallet,x+(dim_wallet_width/2),y+(dim_wallet_width/2));
  return [x, y, dim_wallet_width, dim_wallet_width];
}


class GraphicalTransaction extends Component {
  constructor(props) {
    super(props);

    this.drawTransaction = this.drawTransaction.bind(this);

    this.state = {
      dim_wallet_width: '60px',
      dim_wallet_height: '30px',
      dim_wallet_margin_vertical: '30px',
      dim_wallet_margin_horizontal: '100px',
      dim_wallet_margin: '10px',
      wallet_color: ['#457FB2','#7C5194','#F93D66'],
      pos_col_start: [10,400,800],
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(nextProps, nextState) {
    this.drawTransaction();
  }

  /**
    Loop 2 times. One time to loop for Receipt transaction
    Second time to loop for Payment transaction.
    1st loop, col=0, it will draw the Receipt and Own wallets, together with the line between them
    2nd loop, col=1, it will draw the Own and Payment wallets, and the lines.
    Combining of the amount when from-to wallets are the same, is already done in redux reducer
    Here we need to take care to ensure wallets in a given column is unique.
  */
  drawTransaction() {
    if (!this.props.transHistory || !this.props.transHistory['merged']) return;
    // clear canvas
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // the array of ownWallets that is to draw. Hide if not found here
    let walletsToShow = this.props.transHistory['show'];
    // count number of wallets drawn for each column, used to position the wallet
    let sourceWalletCnt, targetWalletCnt;
    //------------------------------------------------------------------------------------
    // ownWalletPos :
    // stores the wallet that has been drawn, and used for checking
    // to ensure unique wallet in each column
    // if wallet already drawn, reuse it.
    //
    // ownWalletPos structure:
    //   ownWalletPost[<col>][<wallet>][<info>]
    //     col: is either 0, 1, 2. It is an array. Representing Receipt, Own and Payment columns
    //     wallet: the wallet that has already drawn
    //     info: can be '_pos' and '_fromPos'.
    //                '_pos' store the position of the wallet
    //                '_fromPos' store the x,y,width,height of the wallet
    //------------------------------------------------------------------------------------
    let ownWalletPos = [{},{},{}];
    for (let col=0; col<2; col++) {
      // Get the wallets info process by redux reducer.
      let wallets = this.props.transHistory['merged'][col];
      sourceWalletCnt = 0;
      if (col == 1) {
        // When change from col 0 to 1, require to ensure the ownWallet column
        // has the wallet drawn information stored during col=0
        sourceWalletCnt = targetWalletCnt;
      }
      targetWalletCnt = 0;
      Object.keys(wallets).map(sourceWallet=>{

        let sourceDrawn = false;
        let sourcePos;
        if (col == 1) {
          if (ownWalletPos[1][sourceWallet]) {
            // wallet already drawn during col 0 loop, so reuse
            sourceDrawn = true;
            sourcePos = ownWalletPos[1][sourceWallet]['_pos'];
          }
        }
        if (!sourceDrawn) {
          ++sourceWalletCnt;
          sourcePos = sourceWalletCnt;
        }

        Object.keys(wallets[sourceWallet]).map(targetWallet=> {
            let targetDrawn = false;
            let targetPos;

            if (ownWalletPos[col+1][targetWallet]) {
              // wallet already drawn
              targetDrawn = true;
              targetPos = ownWalletPos[col+1][targetWallet]['_pos'];
            } else {
              ++targetWalletCnt;
              targetPos = targetWalletCnt;
              // capture the ownWallet and its position
              ownWalletPos[col+1][targetWallet] = {};
              ownWalletPos[col+1][targetWallet]['_pos'] = targetWalletCnt;
            }

            let walletInfo = wallets[sourceWallet][targetWallet];
            let ownWallet;
            if (col == 0) {
              ownWallet = targetWallet;
            } else {
              ownWallet = sourceWallet;
            }
            if (walletsToShow.indexOf(ownWallet) >=0) { // draw only if filter allow
              let fromPos = null;
              let toPos;
              // (1) 'fromPos' is generated when drawing the source wallet, and used when drawing the line
              // So if we are skipping drawing the source, we need to provide the previously generated
              // 'fromPos' for use when drawing the line.
              if (col==1 && sourceDrawn) fromPos = ownWalletPos[1][sourceWallet]['_fromPos'];
              toPos = drawWallets(col, sourceDrawn, sourceWallet, targetWallet,
                                        sourcePos, targetPos, walletInfo, fromPos);
              // (2) To store the toPos for use in (1) later
              if (col==0) ownWalletPos[1][targetWallet]['_fromPos'] = toPos;
            } else {
              // if filter hide the ownWallet, then move back the counters
              if (!sourceDrawn) {
                sourceWalletCnt--;
              }
              if (!targetDrawn) {
                targetWalletCnt--;
              }
            }

        });
      });
    }

  }

  render() {
    return(
      <canvas id="canvas" width="1200px" height="500px"></canvas>
    )
  }
}
const mapStateToProps = (state) => {
	return {
		transHistory : state['walletTransactions'],
	};
};
export default connect(mapStateToProps)(GraphicalTransaction);
