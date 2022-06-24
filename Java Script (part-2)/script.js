'use strict';

// Coding Challenge - 1
//======================

// const calcAverage = (score1,score2,score3) => (score1+score2+score3)/3;

// const avgDolhins = calcAverage(85,54,41);
// const avgKoalas = calcAverage(23,34,27);

// const checkWinner = function(avgDolhins,avgKoalas){
//     if(avgDolhins >= 2*avgKoalas){
//         console.log(`Dolphins win (${avgDolhins} vs. ${avgKoalas})`);
//     } else if(avgDolhins*2 <= avgKoalas) {
//         console.log(`Koalas win (${avgKoalas} vs. ${avgDolhins})`);
//     } else {
//         console.log("No one wins!");
//     }
// }
// checkWinner(avgDolhins,avgKoalas);

//-------------------------------------------------------------------------------------------------

// Coding Challenge - 2
//======================

// function calcTip (bill) {
//     return  bill >= 50 && bill <= 300 ? bill * 0.15 : (bill < 50) ? (0) : bill * 0.2;
// }
// const bills = [125,555,44];
// const tips = [calcTip(bills[0]),calcTip(bills[1]),calcTip(bills[2])];
// const totals = [bills[0] + tips[0], bills[1] + tips[1], bills[2] + tips[2]];
// console.log(bills);
// console.log(tips);
// console.log(totals);

//-------------------------------------------------------------------------------------------------

// Coding Challenge - 3
//======================

// const dataMark = {
//     fullName : 'Mark Miller',
//     mass : 78,
//     height : 1.69,
//     calcBMI : function (){
//         this.BMI = this.mass/(this.height**2);
//         return this.BMI;
//     }
// };
// const dataJohn = {
//     fullName : 'John Smith',
//     mass : 92,
//     height : 1.95,
//     calcBMI : function() {
//         this.BMI = this.mass / (this.height ** 2);
//         return this.BMI;
//     }
// };
// console.log(dataMark.calcBMI(),dataJohn.calcBMI());
// if(dataMark.BMI > dataJohn.BMI){
//     console.log(`${dataMark.fullName}'s BMI (${dataMark.BMI}) is higher than ${dataJohn.fullName}'s BMI (${dataJohn.BMI})!`);
// } else {
//     console.log(`${dataJohn.fullName}'s BMI (${dataJohn.BMI}) is higher than ${dataMark.fullName}'s BMI (${dataMark.BMI})!`);
// }

//-------------------------------------------------------------------------------------------------

// Coding Challenge - 4
//======================

// const bills = [22, 295, 176, 440, 37, 105, 10, 1100, 86, 52];
// const tips = [];
// const totals = [];

// const calcTip = function(bill) {
//     return bill >= 50 && bill <= 300 ? bill * 0.15 : bill < 50 ? 0 : bill * 0.2;
// }

// for(let i = 0; i < bills.length; i++){
//     const tip = calcTip(bills[i]);
//     tips.push(tip);
//     totals.push(bills[i] + tip);
// }
// console.log(bills);
// console.log(tips);
// console.log(totals);

// //BONUS-----------

// const array = [10,20,30,40,50,60,70,80,90];

// const calcAverage = function(arr){
//     let sum = 0;
//     for(let i = 0; i < arr.length; i++){
//         sum += arr[i];
//     }
//     return sum/arr.length;
// }
// console.log(calcAverage(array));
// console.log(calcAverage(totals));