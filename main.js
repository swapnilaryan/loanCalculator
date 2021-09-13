import {calculator} from './calculator.js'
const helpersObj = {
  loanAmount: {
    minValue: 0,
    maxValue: 100000000,
    displayText: "Loan Amount",
    step: 100000,
    unit: "",
    width: "10",
    defaultValue: "7000000"
  },
  tenure: {
    minValue: 1,
    maxValue: 30,
    displayText: "Tenure",
    step: 1,
    unit: "years",
    width: "",
    defaultValue: "10"
  },
  interestRate: {
    minValue: 0,
    maxValue: 15,
    displayText: "Interest Rate (p.a.)",
    step: 0.1,
    unit: "%",
    width: "",
    defaultValue: "8.5"
  }
};

calculator(helpersObj);