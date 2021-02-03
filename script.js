"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (movement, i, movements) {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${movement}€</div>
    </div>
  `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
const calcPrintBalance = function (currentAcc) {
  const balance = currentAcc.movements.reduce(
    (acc, mov, i, arr) => acc + mov,
    0
  );
  labelBalance.textContent = `${balance} EUR`;
  // currentAcc.balance = currentAcc.movements.reduce((acc, mov) => acc + mov, 0);
  currentAcc.balance = balance;
};
const displayDepositSummary = function (movements) {
  const value = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${value} €`;
};
const displayWithdrawlSummary = function (movements) {
  const value = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(value)} €`;
};
const calInterest = function (account) {
  const value = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${Math.abs(value)} €`;
};
const createUserNames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.userName = acc.owner
      .split(" ")
      .map(function (x) {
        return x[0];
      })
      .join("");
  });
};
let currentUser;
// btnLogin.addEventListener("click", function (e) {
//   e.preventDefault();
//   currentUser = accounts.find(function (acc) {
//     return acc.userName === inputLoginUsername.textContent;
//   });
// });

// or
const updateUI = function (acc) {
  console.log(acc);
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  displayDepositSummary(acc.movements);
  displayWithdrawlSummary(acc.movements);
  calInterest(acc);
};
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentUser = accounts.find((acc) => {
    return (
      acc.userName.toLowerCase() === inputLoginUsername.value.toLowerCase()
    );
  });
  console.log(currentUser);
  console.log(currentUser?.pin);
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentUser.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    updateUI(currentUser);
  }
});
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const receiverAcc = accounts.find(
    (acc) => acc.userName.toLowerCase() === inputTransferTo.value.toLowerCase()
  );
  // .movements.push(Number(inputTransferAmount.value));
  const amount = Number(inputTransferAmount.value);
  console.log(amount);
  if (
    amount > 0 &&
    receiverAcc &&
    currentUser.balance >= amount &&
    receiverAcc?.userName !== currentUser.userName
  ) {
    currentUser.movements.push(-amount);
    receiverAcc.movements.push(amount);
    console.log("Transfer valid");
    console.log(currentUser);
    updateUI(currentUser);
  }
});
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(accounts);
  const inputCloseUsernameValue = inputCloseUsername.value.toLowerCase();
  const inputClosePinValue = Number(inputClosePin.value);
  if (
    inputCloseUsernameValue === currentUser.userName.toLowerCase() &&
    currentUser.pin === inputClosePinValue
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.userName.toLowerCase() === currentUser.userName.toLowerCase();
    });
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
  }
});
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const inputLoanAmountValue = Number(inputLoanAmount.value);
  if (
    inputLoanAmountValue > 0 &&
    currentUser.movements.some(
      (mov) => mov > 0 && inputLoanAmountValue <= 0.1 * mov
    )
  ) {
    currentUser.movements.push(inputLoanAmountValue);
    updateUI(currentUser);
    console.log("Loan granted");
  }
});
createUserNames(accounts);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). 
For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, 
and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, 
and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀

*/
const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCopy = dogsJulia.slice();
  dogsJuliaCopy.splice(-2);
  dogsJuliaCopy.splice(0, 1);
  const arr = dogsJuliaCopy.concat(dogsKate);
  arr.forEach(function (x, i) {
    if (x > 3) {
      console.log(`Dog number ${i} is an adult, and is ${x} years old`);
    } else {
      console.log(`Dog number ${i} is still a puppy 🐶`);
    }
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

const rate = 1.75;
// const newMovements = movements.map(function (mov) {
//   return mov * rate;
// });

//or

const newMovements = movements.map((mov) => mov * rate);
console.log(newMovements);

const movementDescription = movements.map((mov, i) => {
  return `${i + 1} ${mov > 0 ? "deposited" : "withdrew"} ${mov}`;
});
console.log(movementDescription);

// const userName = account3.owner
//   .split(' ')
//   .map(function (name) {
//     return name[0];
//   })
//   .join(' ');

const createUserName = function (userName) {
  return userName
    .split(" ")
    .map((name) => name[0])
    .join("");
};

console.log(createUserName(account3.owner));

console.log(accounts);

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

const withdrawls = movements.filter((mov) => mov < 0);
console.log(withdrawls);

const eurToUsd = 1.1;
const depositsInUsd = movements
  .filter((mov) => mov > 0)
  .map((mov) => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(depositsInUsd);

const acc = accounts.find((mov) => mov.owner === "Jessica Davis");
console.log(acc);

console.log(
  accounts
    .map((mov) => mov.movements)
    .flat()
    .reduce((acc, x) => acc + x, 0)
);

console.log(
  accounts.flatMap((mov) => mov.movements).reduce((acc, x) => acc + x, 0)
);

// setInterval(function () {
//   const date = new Date();
//   const hour = date.getHours();
//   const minute = date.getMinutes();
//   const sec = date.getSeconds();
//   console.log(`${hour}:${minute}:${sec} H:M:S`);
// }, 1000);

const x = [1, 2, 3];
const y = setTimeout(
  (a, b, c) => {
    console.log(a * b * c);
  },
  3000,
  ...x
);
