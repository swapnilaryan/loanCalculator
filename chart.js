import {currencyValue, getRad} from "./utils.js";

const LINE_WIDTH = 75;
const RADIUS = 125;
const TEXT_COLOR = "#4D4D4D";
const AMOUNT_COLOR = "#000000"
const X_POS = 200;
const Y_POS = 165;
const START_ANGLE = getRad(0);
const END_ANGLE = 2 * Math.PI
const PRINCIPAL_AMT_OBJ = {
  color: '#ED7765',
  radius: 7,
  arcXPos: 40,
  arcYPos: 365,
  fillTextXPos: 50,
  fillTextYPos: 370,
  currencyValueXPos: 100,
  currencyValueYPos: 395,
  displayText: 'Principal Amount'
};

const INTEREST_AMT_OBJ = {
  color: '#4B4968',
  radius: 7,
  arcXPos: 250,
  arcYPos: 365,
  fillTextXPos: 260,
  fillTextYPos: 370,
  currencyValueXPos: 305,
  currencyValueYPos: 395,
  displayText: 'Interest Amount'
};

const drawLabelsNText = (canvasCtx, principalAmt, interestAmt) => {
  canvasCtx.fillStyle = PRINCIPAL_AMT_OBJ.color;
  canvasCtx.beginPath();
  canvasCtx.arc(PRINCIPAL_AMT_OBJ.arcXPos, PRINCIPAL_AMT_OBJ.arcYPos, PRINCIPAL_AMT_OBJ.radius, START_ANGLE, END_ANGLE);
  canvasCtx.fill();

  canvasCtx.fillStyle = INTEREST_AMT_OBJ.color;
  canvasCtx.beginPath();
  canvasCtx.arc(INTEREST_AMT_OBJ.arcXPos, INTEREST_AMT_OBJ.arcYPos, INTEREST_AMT_OBJ.radius, START_ANGLE, END_ANGLE);
  canvasCtx.fill();

  canvasCtx.fillStyle = TEXT_COLOR;
  canvasCtx.font = "0.9rem Arial";
  canvasCtx.textAlign = "start";
  canvasCtx.fillText(PRINCIPAL_AMT_OBJ.displayText, PRINCIPAL_AMT_OBJ.fillTextXPos, PRINCIPAL_AMT_OBJ.fillTextYPos);
  canvasCtx.fillText(INTEREST_AMT_OBJ.displayText, INTEREST_AMT_OBJ.fillTextXPos, INTEREST_AMT_OBJ.fillTextYPos);

  canvasCtx.fillStyle = AMOUNT_COLOR;
  canvasCtx.font = "1rem Arial";
  canvasCtx.textAlign = "center";
  canvasCtx.fillText(`₹${currencyValue(principalAmt)}`, PRINCIPAL_AMT_OBJ.currencyValueXPos, PRINCIPAL_AMT_OBJ.currencyValueYPos);
  canvasCtx.fillText(`₹${currencyValue(interestAmt)}`, INTEREST_AMT_OBJ.currencyValueXPos, INTEREST_AMT_OBJ.currencyValueYPos);
}

const updateChart = (canvasEl, principalAmt, totalAmt) => {
  const canvasWidth = canvasEl.width;
  const canvasCtx = canvasEl.getContext('2d');

  const principalDeg = Math.round(principalAmt / totalAmt * 360);
  let interestAmt = totalAmt - principalAmt;
  interestAmt = interestAmt > 0 ? interestAmt : 0;
  const interestAmtDeg = 360 - principalDeg;
  const principalEndAngle = getRad(principalDeg);
  const interestStartAngle = principalEndAngle;

  if (!principalAmt || !totalAmt) {
    canvasCtx.clearRect(0, 0, canvasWidth, canvasWidth);
    drawLabelsNText(canvasCtx, principalAmt, interestAmt);
    return
  }

  // principal amount
  canvasCtx.beginPath();
  canvasCtx.lineWidth = LINE_WIDTH;
  canvasCtx.strokeStyle = PRINCIPAL_AMT_OBJ.color;
  canvasCtx.arc(X_POS, Y_POS, RADIUS, START_ANGLE, principalEndAngle);
  canvasCtx.globalCompositeOperation = 'copy'
  canvasCtx.stroke();

  // interest amount
  canvasCtx.beginPath();
  canvasCtx.lineWidth = LINE_WIDTH;
  canvasCtx.strokeStyle = INTEREST_AMT_OBJ.color;
  canvasCtx.arc(X_POS, Y_POS, RADIUS, interestStartAngle, getRad(interestAmtDeg) + interestStartAngle);
  canvasCtx.globalCompositeOperation = 'source-over'
  canvasCtx.stroke();

  drawLabelsNText(canvasCtx, principalAmt, interestAmt);
};

export {
  updateChart
}