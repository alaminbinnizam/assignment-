// module1 assignment
//you must have to give an integer as parameter

const multiplicationTable = (num) => {
    for (var i = 1; i <= 10; i++) {
        var result = `${num} * ` + i + " = " + num * i;
        console.log(result);
    }
}

multiplicationTable(4) //function invocation
