import {calEmi, currencyValue, formatValue} from "./utils.js";
import {updateChart} from "./chart.js";
import {BORDER_PX_ADJUST} from "./constants.js";

const getHelperName = (path) => {
  const sliderContainerEl = path.find(item => item.className === "sliderContainer");
  return sliderContainerEl.getAttribute("data-helper");
}

const updateStyles = (styleObj) => {
  const {
    dotEl,
    xPos,
    adjustDot,
    percentageEl,
    width
  } = styleObj;

  let translateX = xPos - adjustDot;
  let elWidth = xPos;

  if (translateX >= width) {
    translateX = width - adjustDot;
  } else if (translateX <= 0) {
    translateX = 0;
    elWidth = 0;
  }

  dotEl.style.transform = `translate(${translateX}px, 0)`;
  percentageEl.style.width = `${elWidth}px`;
}

const updateEmi = (emiVariables, amountEl) => {
  const {
    loanAmount,
    tenure,
    interestRate,
  } = emiVariables;
  const emiValue = calEmi(loanAmount, tenure, interestRate);
  amountEl.textContent = currencyValue(emiValue);
  return emiValue;
}

const updateTotalAmt = (emiValue, emiVariables, totalAmountValueEl) => {
  const {
    tenure
  } = emiVariables;
  const months = 12 * tenure;
  const totalAmt = emiValue * months;
  totalAmountValueEl.textContent = currencyValue(totalAmt);
  return totalAmt;
}

const updateValues = (width, xPos, adjustDot, helperName, inputEl, helpersObj, emiVariables, targetElObj, options = {}) => {
  // special case for loan amount
  const isSkipRoundOff = options[helperName] && options[helperName].skipRoundOff
  if(!isSkipRoundOff) {
    xPos = xPos - adjustDot <=0 ? 0 : xPos;
  }
  const percentage = xPos / width;
  let value = helpersObj[helperName].maxValue * percentage;

  let formattedValue = formatValue(helperName, value, options);
  inputEl.setAttribute("data-value", formattedValue);
  emiVariables[helperName] = formattedValue;
  inputEl.value = formattedValue;
  if (helperName === "loanAmount") {
    inputEl.value = currencyValue(formattedValue);
  }
  inputEl.setAttribute("value", formattedValue);
  updateCalculator(emiVariables, targetElObj);
}

const updateCalculator = (emiVariables, targetElObj) => {
  const {
    loanAmount,
  } = emiVariables;
  const {
    totalAmountValueEl,
    emiAmountEl,
    canvasEl
  } = targetElObj;

  const emiValue = updateEmi(emiVariables, emiAmountEl);
  const totalAmt = updateTotalAmt(emiValue, emiVariables, totalAmountValueEl);
  updateChart(canvasEl, loanAmount, totalAmt);
}

const preciseXPos = (width, pageX, offsetXAdjust) => {
  let xPos = pageX - offsetXAdjust;
  if (xPos <= 0) {
    xPos = 0;
  } else if (pageX - offsetXAdjust >= width) {
    xPos = width;
  }
  return xPos;
}

const isArrowKeys = (keyCode) => {
  return keyCode >= 37 && keyCode <= 40
}

const isBackSpace = (keyCode) => {
  return keyCode === 8;
}

const isKeyAllowed = (keyCode) => {
  return (keyCode >= 48 && keyCode <= 57) || isBackSpace(keyCode) || isArrowKeys(keyCode)
}

const handleBackSpace = (event, cursorStartPos) => {
  if(isBackSpace(event.keyCode) && (cursorStartPos - 1 >= 0) ) {
    if([",", "."].indexOf(event.target.value[cursorStartPos - 1]) > -1 ) {
      event.preventDefault();
      return true;
    }
  }
}

const isEditingAllowed = (helperName) => {
  return ["loanAmount", "tenure"].indexOf(helperName) > -1
}

const inValidCheck = (helperName, event) => {
  if(!isKeyAllowed(event.keyCode)) {
    event.preventDefault();
    return true;
  }

  if(isArrowKeys(event.keyCode)) return true;

  if(!isEditingAllowed(helperName)) {
    event.preventDefault();
    return true;
  }
}

const getOffsetX = () => {
  const calSliderEl = document.querySelector(".calSlider");
  const calSliderRect = calSliderEl.getBoundingClientRect();
  return calSliderRect.left - BORDER_PX_ADJUST;
}

export {
  getOffsetX,
  inValidCheck,
  isEditingAllowed,
  isBackSpace,
  isArrowKeys,
  handleBackSpace,
  isKeyAllowed,
  updateCalculator,
  preciseXPos,
  updateValues,
  getHelperName,
  updateStyles,
  updateEmi
}