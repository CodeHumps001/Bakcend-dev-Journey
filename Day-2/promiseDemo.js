function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Done after ${ms}ms`), ms);
  });
}

//consuming the delay function
delay(1000)
  .then((time) => {
    console.log(time);
    return time;
  })
  .then((work) => {
    console.log(work);
    return work;
  })
  .then((done) => {
    console.log(done);
  });

// fraction promise

function dividePromise(a, b) {
  return new Promise((resolve, reject) => {
    if (b !== 0) {
      resolve(a / b);
    } else {
      reject("The value of b cannot be zero");
    }
  });
}

//consuming the promise

dividePromise(12, 0)
  .then((value) => console.log("The answer is : ", value))
  .catch((error) => {
    console.log("Error: ", error);
  })
  .finally(() => console.log("Program run successfully"));
