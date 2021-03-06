// async function makeTwoRequests() {
//     try {
//         let data1 = await fakeRequest('/page1');
//         console.log(data1);
//         let data2 = await fakeRequest('/page2');
//         console.log(data2);
//     } catch (e) {
//         console.log("CAUGHT AN ERROR!")
//         console.log("error is:", e)
//     }

// }




/**************************************************************************************************
SUMMARY OF CONCEPTS/INFORMATION LEARNED VIA THIS EXPERIMENTATION CODE:
I came into this experimentation trying to address my misunderstanding of the async syntax.
"I'm using async in the function definition, why can I not use .then or await on it?"

Not worrying about arrow functions vs conventional function declaration.

I can put an async keyword in there even if it doesn't do anything. It doesn't matter,
because I still have to be generating a promise to go off of.

To demonstrate the results, print variable before setTimeout delay is finished, then after.

Important to note that if defining a new Promise object, then the arguments provided to it
for resolving/rejecting directly correspond to the functions you must use to perform those actions.
In other words, there is no generalized resolve function.
i.e. let promiseTest = new Promise((resKeyword, reject) 
     resKeyword() must be used as a function, not resolve()

END RESULT OF UNDERSTANDING: Even if using async keyword, must employ new Promise to add async
functionality.

/**************************************************************************************************

I recorded two videos highlighting this whole thing, but here's an explanation:
running testAsyncWillNotWork() with the console logs below, this is the output we get: 

> here is a line before call of testAsyncWillNotWork
> before SetTimeout
> here is a line after call of testAsyncWillNotWork
> a
    Promise {<fulfilled>: undefined}
> inside timeout, BEFORE RETURN
> a
    Promise {<fulfilled>: undefined}

As can be seen, the promise object is generated by the async keyword in the function definition.
If we remove the async keyword, then a simple "undefined" will be returned.
E.g. the variable 'a' will be equal to "undefined"

However, if we maintain the async keyword, we still have a problem: the return value (promise)
    does not change...
This is because the interpreter only has the information that the function returns a promise (from
    the async keyword).
setTimeout() IS asynchonous, but we do not save it to a variable; could try to await on such a variable.
    Edit: Latter idea doesn't work; setTimeout itself returns a value likely corresponding to success
          In other words, we don't have access to the return value of the function provided to setTimeout
Point being: Because we never actually establish any promise, we don't have one to go off of.
As such, the variable 'a' is never changed.

By contrast, testAsyncWorking() generates a promise variable/object called promiseTest, which we
    are then able to use the await keyword on.
Further, once we have finished awaiting, then result is the resolved promise, 

The following is the console output using this approach:

> here is a line before call of testAsyncWorking
> before SetTimeout
> here is a line after call of testAsyncWorking
> b
    Promise {<pending>}
> inside timeout, AFTER RESOLVE
> b
    Promise {<fulfilled>: "I RESOLVED!!"}

the link below really helped me to understand how to approach it.
basically, I was thinking that I had a syntax problem and wasn't writing the function correctly.
In actuality, I had a fundamental misunderstanding of what was required to work with an async function.
https://javascript.plainenglish.io/async-await-javascript-5038668ec6eb

**************************************************************************************************/
async function testAsyncWillNotWork() {
    console.log("before SetTimeout");
    setTimeout(() => {
        console.log("inside timeout, BEFORE RETURN");
        return("I RETURNED!!!"); // runs with .then
        console.log("inside timeout, AFTER RETURN");
    }, 3000);
}

async function awaitingOnSetTimeOut() {
    console.log("before SetTimeout");
    let result = await setTimeout(() => {
        console.log("inside timeout, BEFORE RETURN");
        return("I RETURNED WHEN AWAITING ON SETTIMEOUT!!!"); // runs with .then
        console.log("inside timeout, AFTER RETURN");
    }, 3000);
    return result;
}


async function testAsyncWorking() {
    let promiseTest = new Promise((resKeyword, reject) => {
        console.log("before SetTimeout");
        setTimeout(() => {
            resKeyword("I RESOLVED!!"); // runs with .then
            console.log("inside timeout, AFTER RESOLVE");
        }, 3000);
    })

    let result = await promiseTest;
    return result;
}

// console.log("here is a line before call of testAsyncWillNotWork");
// let a = testAsyncWillNotWork();
// console.log("here is a line after call of testAsyncWillNotWork");
/*************************************************************************************************/

// console.log("here is a line before call of testAsyncWorking");
// let b = testAsyncWorking();
// // because we have a promise to work with in this version, we can use .then
// b.then(resData => { 
//     console.log(resData);
// });
// console.log("here is a line after call of testAsyncWorking");

/*************************************************************************************************/

console.log("here is a line before call of awaitingOnSetTimeOut");
let d = awaitingOnSetTimeOut();
// because we have a promise to work with in this version, we can use .then
// d.then(resData => { 
//     console.log(resData);
// });
d.then(data => {
    console.log(data);
})
console.log("here is a line after call of awaitingOnSetTimeOut");

/*************************************************************************************************/
/**************************************************************************************************
the code below is from the above link, and it also helps to highlight that a new promise object
must be instantiated for the async to work.
// ***********************************************************************************************/
// async function firstAsync() {
//     setTimeout(() => {}, 2000);
//     return 27;
//   }

//   firstAsync().then(alert); // 27
/*************************************************************************************************/
// async function firstAsync() {
//     let promise = new Promise((res, rej) => {
//         setTimeout(() => res("Now it's done!"), 1000)
//     });

//     // wait until the promise returns us a value
//     let result = await promise;

//     // "Now it's done!"
//     alert(result);
// }

// firstAsync();
/*************************************************************************************************/
/*************************************************************************************************/
