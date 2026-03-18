//creating the promise
const myPromise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("It worked");
  } else {
    reject("Something went wrong.");
  }
});

//consumming the promise
myPromise
  .then((result) => {
    console.log("Result: ", result);
  })
  .catch((error) => {
    console.log("Error: ", error);
  });
