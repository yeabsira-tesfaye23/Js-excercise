let nums =[1,2,3,4,5,6];
let odds = nums.filter(n => n%3===0);
let evens= nums.filter(n => n%2===0);
let doubled=nums.map(n =>n *2);
console.log(doubled);
console.log(evens)
console.log(odds);