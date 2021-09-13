const currencyValue = (number) => {
  let num = (Math.round(number)).toString();
  let arr = [],
    digits,
    curr;
  while (num) {
    digits = digits ? 2 : 3;
    arr.push(num.slice(-digits));
    num = num.slice(0, -digits);
  }
  curr = arr.reverse().join(',');
  return curr;
};

const calEmi = (amount, years, rate) => {
  amount = parseInt(amount);
  years = parseInt(years);
  rate = parseFloat(rate);
  if(!rate || !amount || !years) return 0;
  const months = years * 12;
  const monthlyInterestRatio = (rate/100)/12;
  const roi = Math.pow((1 + monthlyInterestRatio), months)
  const emi = amount * monthlyInterestRatio * roi/(roi - 1);
  return Math.round(emi);
}

const formatValue = (helperName, value, options = {}) => {
  value = value.toString();
  value = value.replaceAll(",", "");
  if(helperName === 'interestRate') {
    value = parseFloat(value).toFixed(1);
    if (value.indexOf(".0") > -1) {
      value = value.replace(".0", "");
      value = Math.abs(value);
    }
  } else if(helperName === 'loanAmount') {
    const skipRoundOff = options[helperName] && options[helperName].skipRoundOff;
    if(!skipRoundOff) {
      value = Math.floor(value / 1000) * 1000;
    }
  } else if (helperName === "tenure") {
    value = Math.ceil(value);
  }
  return value;
}

const setValue = (value) => {
  value = value.toString();
  value = value.replaceAll(",", "");
  value = parseFloat(value);
  return value;
}

const getRad = (deg) => {
  return parseFloat((deg * Math.PI / 180).toFixed(2));
}
export {
  setValue,
  getRad,
  formatValue,
  calEmi,
  currencyValue
}
