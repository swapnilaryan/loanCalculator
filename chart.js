import {currencyValue, getRad} from "./utils.js";

const LINE_WIDTH = 75;
const RADIUS = 125;
const INTEREST_AMT_COLOR = '#4B4968';
const PRINCIPAL_AMT_COLOR = '#ED7765';
const TEXT_COLOR = "#4D4D4D";
const AMOUNT_COLOR = "#000000"
const X_POS = 200;
const Y_POS = 165;
const START_ANGLE = getRad(0);

const drawLabelsNText = (canvasCtx, principalAmt, interestAmt) => {
  canvasCtx.fillStyle = PRINCIPAL_AMT_COLOR;
  canvasCtx.beginPath();
  canvasCtx.arc(40, 365, 7, 0, 2 * Math.PI);
  canvasCtx.fill();

  canvasCtx.fillStyle = INTEREST_AMT_COLOR;
  canvasCtx.beginPath();
  canvasCtx.arc(250, 365, 7, 0, 2 * Math.PI);
  canvasCtx.fill();

  canvasCtx.fillStyle = TEXT_COLOR;
  canvasCtx.font = "0.9rem Arial";
  canvasCtx.textAlign = "start";
  canvasCtx.fillText("Principal Amount", 50, 370);
  canvasCtx.fillText("Interest Amount", 260, 370);

  canvasCtx.fillStyle = AMOUNT_COLOR;
  canvasCtx.font = "1rem Arial";
  canvasCtx.textAlign = "center";
  canvasCtx.fillText(`₹${currencyValue(principalAmt)}`, 100, 395);
  canvasCtx.fillText(`₹${currencyValue(interestAmt)}`, 305, 395);
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
  canvasCtx.strokeStyle = PRINCIPAL_AMT_COLOR;
  canvasCtx.arc(X_POS, Y_POS, RADIUS, START_ANGLE, principalEndAngle);
  canvasCtx.globalCompositeOperation = 'copy'
  canvasCtx.stroke();

  // interest amount
  canvasCtx.beginPath();
  canvasCtx.lineWidth = LINE_WIDTH;
  canvasCtx.strokeStyle = INTEREST_AMT_COLOR;
  canvasCtx.arc(X_POS, Y_POS, RADIUS, interestStartAngle, getRad(interestAmtDeg) + interestStartAngle);
  canvasCtx.globalCompositeOperation = 'source-over'
  canvasCtx.stroke();

  drawLabelsNText(canvasCtx, principalAmt, interestAmt);
};

export {
  updateChart
}