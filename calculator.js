import {
  getHelperName,
  preciseXPos,
  updateStyles,
  updateValues,
  handleBackSpace,
  isBackSpace,
  inValidCheck, getOffsetX,
} from "./browserUtils.js";
import {setValue} from "./utils.js";
import {ADJUST_DOT, BORDER_PX_ADJUST} from "./constants.js";

const calculator = (helpersObj) => {
  const sliderClass = ['sliderBar', 'sliderBarPercentage', 'sliderDot'];
  const sliderTemplateEl = document.getElementById("sliderTemplate");
  const canvasEl = document.getElementById("canvas");
  const calSliderEl = document.getElementsByClassName("calSlider")[0];
  const emiAmountEl = document.getElementsByClassName("emiAmount")[0];
  const totalAmountValueEl = document.getElementsByClassName("totalAmountValue")[0];

  const emiVariables = {
    loanAmount: 0,
    tenure:0,
    interestRate: 0
  };
  let dragVariables =  {
    isPressed: false,
    xPos: 0,
    width: 0,
    helperName: '',
    inputEl: null
  };

  const targetElObj =  {
    totalAmountValueEl,
    emiAmountEl,
    canvasEl
  }

  const options = {}; // for handling special cases update

  const onMouseDown = (event) => {
    if (sliderClass.indexOf(event.target.className) !== -1) {
      const sliderContainerEl = event.path.find(item => item.className === "sliderContainer");
      const width = event.target.parentNode.offsetWidth;
      const helperName = sliderContainerEl.getAttribute("data-helper");
      const targetClass = event.target.className;
      const targetEl = event.target;
      const inputEl = sliderContainerEl.querySelector(".inputBox");
      const offsetXAdjust = getOffsetX();

      if(!dragVariables.isPressed) {
        dragVariables.isPressed = true;
        dragVariables.sliderDotEl = sliderContainerEl.querySelector(".sliderDot");
        dragVariables.helperName = helperName;
        dragVariables.width = width;
        dragVariables.inputEl = inputEl;
        dragVariables.offsetXAdjust = offsetXAdjust;
      }

      if (sliderClass.indexOf(targetClass) !== -1) {

        if(event.touches) {
          event.pageX = event.touches[0].pageX;
        }
        let xPos = preciseXPos(width, event.pageX, offsetXAdjust);
        let sliderBarPercentageEl = null;
        if(targetClass === "sliderBar") {
          sliderBarPercentageEl = targetEl.nextElementSibling;
        } else if (targetClass === "sliderBarPercentage") {
          sliderBarPercentageEl = targetEl
        }
        if (sliderBarPercentageEl) {
          const styleObj = {
            dotEl: sliderBarPercentageEl.nextElementSibling,
            xPos,
            percentageEl: sliderBarPercentageEl,
            adjustDot: ADJUST_DOT,
            width,
            borderPxAdjust: BORDER_PX_ADJUST
          };
          updateStyles(styleObj);
          updateValues(width, xPos, ADJUST_DOT, helperName, inputEl, helpersObj, emiVariables, targetElObj);
        }
      }
    }
  };
  const onMouseMove = (event) => {
    if(!dragVariables.isPressed) return;
    const {
      isPressed,
      sliderDotEl,
      width,
      helperName,
      inputEl,
      offsetXAdjust
    } = dragVariables;

    if (isPressed) {
      if(event.touches) {
        event.pageX = event.touches[0].pageX;
      }
      let xPos = preciseXPos(width, event.pageX, offsetXAdjust);
      if(xPos <= 0) {
        xPos = helpersObj[helperName].minValue;
      }
      const styleObj = {
        dotEl: sliderDotEl,
        xPos,
        percentageEl: sliderDotEl.previousElementSibling,
        adjustDot: ADJUST_DOT,
        width,
        borderPxAdjust: BORDER_PX_ADJUST
      };
      updateStyles(styleObj); 
      updateValues(width, xPos, ADJUST_DOT, helperName, inputEl, helpersObj, emiVariables, targetElObj);
    }
  };
  const onMouseUp = () => {
    dragVariables.isPressed = false;
  };

  const onKeyUp = (event) => {
    const helperName = getHelperName(event.path);
    if(inValidCheck(helperName, event)) {
      return;
    }

    const inputBoxEl = event.target;
    let curStartPos = isBackSpace(event.keyCode) ? inputBoxEl.selectionStart + 1 : inputBoxEl.selectionStart;

    let currVal;
    if(handleBackSpace(event, curStartPos)) {
      inputBoxEl.value = setValue(inputBoxEl.value);
      return;
    }

    const oldValList = event.target.value.split("");
    if(!isBackSpace(event.keyCode)) {
      oldValList.splice(curStartPos, 0, event.key);
    }

    currVal = setValue(inputBoxEl.value);

    if(isNaN(currVal)) {
      currVal = 0;
    }

    inputBoxEl.setAttribute("data-value", `${currVal}`);
    inputBoxEl.setAttribute("value", `${currVal}`);
    inputBoxEl.value = currVal;

    const sliderContainerEl = event.path.find(item => item.className === "sliderContainer");
    const width = sliderContainerEl.offsetWidth
    const percentage = inputBoxEl.value / helpersObj[helperName].maxValue;
    let xPos = width * percentage;

    const styleObj = {
      dotEl: sliderContainerEl.querySelector(".sliderDot"),
      xPos,
      percentageEl: sliderContainerEl.querySelector(".sliderBarPercentage"),
      adjustDot: ADJUST_DOT,
      width,
      borderPxAdjust: BORDER_PX_ADJUST
    };
    updateStyles(styleObj);
    if(helperName === "loanAmount") {
      options[helperName].skipRoundOff = true;
    }
    updateValues(width, xPos, ADJUST_DOT, helperName, inputBoxEl, helpersObj, emiVariables, targetElObj, options);
  }
  const onKeyDown = (event) => {
    const helperName = getHelperName(event.path);
    if(inValidCheck(helperName, event)) {
      return;
    }

    if(isBackSpace(event.keyCode) && event.target.value === "0") {
      event.preventDefault();
      return true;
    }

    const keyVal = event.key;
    const inputBoxEl = event.target;
    const cursorStartPos = inputBoxEl.selectionStart;
    const cursorEndPos = inputBoxEl.selectionEnd;
    const helper = helpersObj[helperName]

    if(handleBackSpace(event, cursorStartPos)) {
      return;
    }

    const oldValList = event.target.value.split("");

    if(!isBackSpace(event.keyCode)) {
      oldValList.splice(cursorStartPos, 0, keyVal);
    }
    const currVal = setValue(oldValList.join(""));

    if(isNaN(currVal)) {
      return;
    }

    if(currVal > helper.maxValue) {
      event.preventDefault();
    }
  }

  const buildHelpers = () => {
    const helperList = Object.keys(helpersObj);
    const fragment = new DocumentFragment();
    helperList.forEach(item => {
      const helper = helpersObj[item];
      const templateContent = sliderTemplateEl.content.cloneNode(true);
      const sliderTextEl = templateContent.querySelector(".sliderText");
      sliderTextEl.innerText = helper.displayText;

      if(item === "loanAmount") {
        const rupeeEl = templateContent.querySelector(".rupee");
        rupeeEl.style.visibility = "visible";
      }

      const inputBoxEl = templateContent.querySelector(".inputBox");

      inputBoxEl.addEventListener('keyup', onKeyUp);
      inputBoxEl.addEventListener('keydown', onKeyDown);
      inputBoxEl.setAttribute("data-value", helper.defaultValue);
      inputBoxEl.setAttribute("value", helper.defaultValue);
      helper.width ? inputBoxEl.style.width = `${helper.width}rem` : "";

      const sliderUnitEl = templateContent.querySelector(".sliderUnit");
      sliderUnitEl.innerText = helper.unit;

      const sliderContainerEl = templateContent.querySelector(".sliderContainer");
      calSliderEl.addEventListener('mousedown', onMouseDown);
      calSliderEl.addEventListener('mousemove', onMouseMove);
      calSliderEl.addEventListener('mouseup', onMouseUp);

      calSliderEl.addEventListener('touchstart', onMouseDown);
      calSliderEl.addEventListener('touchmove', onMouseMove);
      calSliderEl.addEventListener('touchend', onMouseUp);

      sliderContainerEl.setAttribute("data-helper", item);

      fragment.appendChild(templateContent);
    });
    return fragment;
  }

  const render = () => {
    calSliderEl.prepend(buildHelpers());

    const sliderContainerList = document.getElementsByClassName("sliderContainer");
    for(let i=0;i<sliderContainerList.length;i++) {
      const item = sliderContainerList[i];
      const helperName = item.getAttribute("data-helper");
      const width = item.offsetWidth;
      const inputEl = item.querySelector(".inputBox");
      const value = inputEl.getAttribute("value");
      let xPos = value / helpersObj[helperName].maxValue * width;

      const styleObj = {
        dotEl: item.querySelector(".sliderDot"),
        xPos,
        percentageEl: item.querySelector(".sliderBarPercentage"),
        adjustDot: ADJUST_DOT,
        width,
        borderPxAdjust: BORDER_PX_ADJUST
      };
      updateStyles(styleObj);
      options[helperName] = {}
      if(helperName === "loanAmount") {
        options[helperName].skipRoundOff = true;
      }
      updateValues(width, xPos, ADJUST_DOT, helperName, inputEl, helpersObj, emiVariables, targetElObj, options);
    }
  }

  render();
}

export  {
  calculator
}