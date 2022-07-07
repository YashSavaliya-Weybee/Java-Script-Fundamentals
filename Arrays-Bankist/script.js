'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data---
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements---
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//---------Movements----------
const displayMovements = function (movements, sort = false) {
  //Empty Movements---
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  //Adding Movement rows and Displaying---
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //Row---
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    //Defining Where to add rows---
    containerMovements.insertAdjacentHTML('afterbegin', html);

  });
};

//--------Calculate balance--------
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
}

//--------Calculate summary---------
const calcDisplaySummary = function (acc) {
  //Calculate and Display Incomes---
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, curMov) => acc + curMov, 0);
  labelSumIn.textContent = `${incomes}€`;

  //calculate and Diaplay Outcomes---
  const outcomes = acc.movements.filter(mov => mov < 0).reduce((acc, curMov) => acc + curMov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  //calculate and Display Interest---
  const interest = acc.movements.filter(mov => mov > 0).map(deposite => (deposite * acc.interestRate) / 100).filter(inte => inte >= 1).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
}

//----Create User Name----
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map((name) => name[0]).join('');
  })
}
createUserName(accounts);

//----------Update UI-----------
const updateUI = function (acc) {

  //Display balance---
  calcDisplayBalance(acc);

  //Display Movements---
  displayMovements(acc.movements);

  //Display Summary---
  calcDisplaySummary(acc);
}

let currentAccount;

//---------Login---------
btnLogin.addEventListener('click', function (e) {
  //Prevent Account From Submitting---
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display Welcome Message and Name of Account Owner----
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    //Clear Input Fields---
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginUsername.blur();
    inputLoginPin.blur();

    //Update UI---
    updateUI(currentAccount);
  }
})

//----Transfer Amount----
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  if (amount > 0 && amount <= currentAccount.balance && reciverAcc?.username !== currentAccount.username && reciverAcc) {

    //Transfering Amount from current Account to Reciver's Account---
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);

    //Clear Inputs---
    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferAmount.blur();
    inputTransferTo.blur();

    //Update Ui After Transfer---
    updateUI(currentAccount);

  }
  //----Else Part-1----
  // else {
  //   const error = amount == " " ? "Enter Amount!" : amount < 0 ? 'Enter Amount Grater Than 0!' : amount >= currentAccount.balance ? `No Enough Balance in Your Account to Transfer ${amount}!` : reciverAcc?.username === currentAccount.username ? 'You Can not transfer to your own Account!' : 'Enter valid Reciver!';
  //   console.log(error)
  // }

  //----Else Part-2----
  // else if (amount == " ") {
  //   console.log("Enter Amount!");
  // } else if (amount <= 0) {
  //   console.log('Enter Amount Grater Than 0!');
  // } else if (amount >= currentAccount.balance) {
  //   console.log(`No Enough Balance in Your Account to Transfer ${amount}!`);
  // } else if (reciverAcc?.username === currentAccount.username) {
  //   console.log('You Can not transfer to your own Account!');
  // } else if (!reciverAcc) {
  //   console.log('Enter valid Reciver!');
  // }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add Movement---
    currentAccount.movements.push(amount);

    //Update UI---
    updateUI(currentAccount)
  }
  inputLoanAmount.value = '';
})

//----Close Account----
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value == currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {

    //Find Index of Current Account---
    // const indexOfCurAcc = accounts.indexOf(currentAccount);
    const indexOfCurAcc = accounts.findIndex(acc => acc.username === currentAccount.username);

    //Delete Account---
    accounts.splice(indexOfCurAcc, 1);

    //Hide UI and Initialize Nav--
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
  }
});

//-----Sort Button------ 
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})




/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let a = ['a', 'b', 'c', 'd', 'e'];

//Slice method
// console.log(a.slice(2));
// console.log(a.slice(2, 4));
// console.log(a.slice(-2));
// console.log(a.slice(-1));
// console.log(a.slice(1, -2));
// console.log(a.slice());
// console.log([...a]);

//Splice method
// console.log(a.splice(2));
// console.log(a.splice(-1));
// console.log(a.splice(1, 2));
// console.log(a);

//Reverse
// console.log(a.reverse());
// console.log(a);

//Concat
// let arr = [1, 2, 3, 4, 5];
// let letters = arr.concat().reverse();
// console.log(arr)
// console.log(letters);

//Join
// console.log(letters.join('-'));

// const a = [1, 2, 3, 4];
// console.log(a[0]);
// console.log(a.at());

// console.log(a[a.length - 1]);
// console.log(a.slice(-1)[0]);
// console.log(a.at(-1));
// console.log('Yash'.at(0))

/////////////////////////////////////////////////////////////////////

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`${i + 1} : You deposited ${movement}`);
//   } else {
//     console.log(`${i + 1} : You deposited ${Math.abs(movement)}`)
//   }
// }
// console.log('----ForEach----')
// movements.forEach(function (movement, i) {
//   if (movement > 0) {
//     console.log(`${i + 1} : You deposited ${movement}`);
//   } else {
//     console.log(`${i + 1} : You deposited ${Math.abs(movement)}`)
//   }
// })

/////////////////////////////////////////////////////////////////////

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`)
// })

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR'])
// console.log(currenciesUnique)
// currenciesUnique.forEach(function (value, key, set) {
//   console.log(`${key} : ${value}`)
// })


/////////////////////////////////////////////////////////////////////
// Coding Challenge #1

// const checkDogs = function (dogsJulia, dogsKate) {
//   const duplicateDogsJulia = dogsJulia;
//   duplicateDogsJulia.shift();
//   duplicateDogsJulia.splice(-2);

//   const chkDogsAge = function (dogAge, i) {
//     dogAge >= 3 ? console.log(`Dog number ${i + 1} is an adult, and is ${dogAge} years old`) : console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//   }
//   console.log('------------ Julia\'s dog list ------------');
//   duplicateDogsJulia.forEach(chkDogsAge);
//   console.log('------------ Kate\'s dog list ------------');
//   dogsKate.forEach(chkDogsAge);
// }
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

/////////////////////////////////////////////////////////////////////
// const eurToUsd = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd
// })
// const movementsUSD = movements.map((mov) => mov * eurToUsd)
// console.log(movements)
// console.log(movementsUSD)

// const movementsDescriptions = movements.map((mov, i) => `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`)
// console.log(movementsDescriptions)

/////////////////////////////////////////////////////////////////////
// const deposits = movements.filter(function (mov) {
//   return mov > 0
// })
// const deposits = movements.filter(mov => mov > 0);
// const deposits = movements.filter(mov => mov < 0);

// console.log(movements)
// console.log(deposits)

/////////////////////////////////////////////////////////////////////
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i} : ${acc}`)
//   return acc + cur;
// }, 100)
// const balance = movements.reduce((acc, cur) => acc + cur, 100)
// console.log(balance)

// console.log(movements.reduce((acc, cur) => acc > cur ? acc : cur, movements[0]))

////////////////////////////////////////////////////////////////////
//Coding challange - 2

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map((dogAge) => dogAge <= 2 ? dogAge * 2 : dogAge * 4 + 16).filter((humanAge) => humanAge >= 18);
//   const averageHumanAges = humanAges.reduce((acc, ages) => acc + ages) / humanAges.length;
//   return averageHumanAges
// }
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]))
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]))

/////////////////////////////////////////////////////////////////////
// const eurToUsd = 1.1;
// const totalDepositsUSD = movements.filter(mov => mov > 0).map(mov => mov * eurToUsd).reduce((acc, curMov) => acc + curMov, 0);

// console.log(totalDepositsUSD)

/////////////////////////////////////////////////////////////////////
// Coding Challenge #3

// const calcAverageHumanAge = (ages) => ages.map((dogAge) => dogAge <= 2 ? dogAge * 2 : dogAge * 4 + 16).filter((humanAge) => humanAge >= 18).reduce((acc, ages, i, arr) => acc + ages / arr.length, 0);

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]))
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]))

/////////////////////////////////////////////////////////////////////
// const firstWthdrawal = movements.find(mov => mov < 0)
// console.log(movements);
// console.log(firstWthdrawal)

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis')
// console.log(account);

// for (const account of accounts) {
//   if (account.owner === 'Jessica Davis') {
//     console.log(account)
//   }
// }

/////////////////////////////////////////////////////////////////////
// console.log(movements);
// console.log(movements.includes(-130));
// console.log(movements.some(mov => mov === 3000));
// const anyDeposite = movements.some(mov => mov = 3000);
// console.log(anyDeposite);

// console.log(movements.every(mov => mov > 0))
// console.log(account4.movements.every(mov => mov > 0))

// const deposite = mov => mov > 0;
// console.log(movements.some(deposite));
// console.log(movements.every(deposite));
// console.log(movements.filter(deposite));

/////////////////////////////////////////////////////////////////////
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// const a = arr.join(",");
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2))

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements)
// const allMovements = accountMovements.flat()
// console.log(allMovements)
// const overAllBalance = allMovements.reduce((acc, mov) => acc + mov, 0)
// console.log(overAllBalance)

// const accountMovements = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
// console.log(accountMovements)

// const accountMovements = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
// console.log(accountMovements)

/////////////////////////////////////////////////////////////////////

// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort())
// console.log(owners);

//return < 0 => A,B
//return > 0 => B,A
// console.log(movements.sort((a, b) => a > b ? 1 : -1))
// console.log(movements.sort((a, b) => a - b))
// console.log(movements.sort((a, b) => a < b ? 1 : -1))
// console.log(movements.sort((a, b) => b - a))

/////////////////////////////////////////////////////////////////////

// const a = new Array(10);
// a.fill(1)
// console.log(a)
// a.fill(1, 3, 9)
// console.log(a)

// const y = Array.from({ length: 7 }, () => 10)
// console.log(y)

//Array.from({length:10},function)
// const z = Array.from({ length: 10 }, (current, i) => i + 1)
// const z = Array.from({ length: 10 }, (current, i) => Math.trunc(Math.random() * 100 + 1))
// console.log(z)
// let y = [];
// y.concat('', z)
// console.log(y)

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€', '')));
//   console.log(movementsUI);
//   const movementsUI2 = [...document.querySelectorAll('.movements__value')];
// });

/////////////////////////////////////////////////////////////////////

// // 1.
// const totalDeposit = accounts.flatMap(acc => acc.movements).reduce((acc, cur) => acc + cur, 0)
// console.log(totalDeposit)
// const deposit = accounts.flatMap(acc => acc.movements).filter(acc => acc > 0).reduce((acc, cur) => acc + cur, 0)
// console.log(deposit)
// const depositOut = accounts.flatMap(acc => acc.movements).filter(acc => acc < 0).reduce((acc, cur) => acc + Math.abs(cur), 0)
// console.log(depositOut)

// // 2.
// const filteredDeposites = accounts.flatMap(acc => acc.movements).filter(el => el >= 1000).length
// const filteredDeposites = accounts.flatMap(acc => acc.movements).reduce((acc, cur) => cur >= 1000 ? acc + 1 : acc, 0)
// console.log(filteredDeposites)

// // 3.
// const { deposite, withdrawal } = accounts.flatMap(acc => acc.movements).reduce((acc, cur) => {
//   // cur > 0 ? acc.deposite += cur : acc.withdrawal += cur;
//   acc[cur > 0 ? 'deposite' : 'withdrawal'] += cur;
//   return acc
// }, { deposite: 0, withdrawal: 0 })
// console.log(deposite, withdrawal)

// // 4.
// const convertTitleCase = function (title) {
//   const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];
//   const convert = (word) => word[0].toUpperCase() + word.slice(1);
//   const a = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => exceptions.includes(word) ? word : convert(word))
//     .join(" ")
//   console.log(convert(a))
// }
// convertTitleCase('this is a nice title')
// convertTitleCase('this is a LONG title but not too long')
// convertTitleCase('and here is another title with an EXAMPLE')


