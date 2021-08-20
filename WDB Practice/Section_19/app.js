let todos = [];
// let taskCount = 0;

let userInput;

while (userInput = prompt("What would you like to do?")) {
    if (userInput  === "quit") break;
    else if (userInput === "list") {
        // for (let i of todos) {
        //     console.log(i);
        // }
        for (let i = 0; i < todos.length; i++) {
            console.log(`${i+1} ${todos[i]}`);
        }
        console.log("*****");
    }
    else if (userInput === "new") {
        // taskCount++;
        userInput = prompt("What would you like to add to the list?"); // this will refresh on next user input
        todos.push(userInput); // originally used string template literal, but redundant
    }
    else if (userInput === "delete") {
        // taskCount--; // LEAVING THIS COMMENTED IN BROKE THE APP BECAUSE IT WASN'T DEFINED AS A COMMENT
        userInput = prompt("What task number should be removed from the list?")
        todos.splice(userInput-1, 1); // need to think in terms of array indexing, since we are representing as indexing from 1
    }
}

console.log("EXITED APP");

// originally, I went with a taskCount++ and taskCount-- approach, though
// this proved to be redundant, since I could keep track of each tasks' corresponding number
// with its index

// further, I initially used the simplified for loop in the list functionality, though
// the problem then became that taskCount would become an inaccurate representation of 
// the task number.

// also worth noting that, in the end, I decided to instantiate userInput and begin defining it
// at the start of the while loop

// however, note that Colt went with while(userInput !== "quit"), which does make more syntatical sense
// he also used const for the array

// MY CODE ALSO HAS DIFFERENT APPROACHES TO THE CONDITIONS