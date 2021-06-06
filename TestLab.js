const readline = require("readline");
readline.emitKeypressEvents(process.stdin)
console.log("Welcome to the test lab !");
console.log("Press ctrl c to see results after inputs");
//intiating readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//global variables
let bloodSamples = [];
let virusComposition = "";
let vcLength =0;
let vcIndex = 0
let numberOfPeople = null;
let positive = 0;

//get virus composition
const question1 = () => {
  return new Promise((resolve, reject) => {
    rl.question("Enter virus composition ? ", (answer) => {
      try {
        if (!answer) throw new Error("Virus composition is compulsory");
        //overwriting virus composition
        virusComposition = answer.trim();
        vcLength = virusComposition.length;
        vcIndex = 0
        console.log(`Virus composition stored: ${answer}`);
        resolve();
      } catch (error) {
        rl.close();
        console.log(error);
      }
    });
  });
};

//get blood composition
const question2 = () => {
  return new Promise((resolve, reject) => {
    rl.question("How many patients ? ", (answer) => {
      try {
        let number = parseInt(answer);
        //validate number of people
        if (!number || number == NaN || number > 10) throw Error("INVALID NUMBER");
        numberOfPeople = answer;
        console.log(`${answer} patients`);
        resolve();
      } catch (error) {
        rl.close();
        console.log(error);
      }
    });
  });
};

//check blood helper function
let checkBlood = (singleBloodSample) => {
    let sbLength = singleBloodSample.length;
    let sbIndex = 0;
    while (sbIndex < sbLength && vcIndex < vcLength) {
        if(singleBloodSample[sbIndex] == virusComposition[vcIndex]) {
            sbIndex++;
            vcIndex++;
        }else {
            vcIndex++
        } 
    }
    let result = sbIndex == sbLength;
    if(result) positive++
    return result;
}

//test for virus main function
const testVirus = (bloodSamples) => {
    let headIndex = 0;
    let headLength = bloodSamples.length;
    console.log("R E S U L T S !")

    //parent loop
    while(headIndex < headLength) {
    let singleBS = bloodSamples[headIndex]
        if(checkBlood(singleBS) ) { //check for result
            console.log(`==> ${singleBS} is POSITIVE`)
        } else {
          if(singleBS.length > virusComposition.length) {
            console.log(`==> ${singleBS} has invalid blood composition`)
          } else {
            console.log(`==> ${singleBS} is NEGATIVE`)
          } 
        }
        headIndex++
    }
    
}

//analysis of result
const resultAnalysis = () => {
  let len = bloodSamples.length;
  if(len > numberOfPeople) {
    let num = len - numberOfPeople;
    console.log(`There ${num == 1 ? 'is' : 'are'} ${num} unknown blood ${num == 1 ? 'sample' : 'samples'}`)
  }else if(numberOfPeople > len) {
    let num = numberOfPeople - len
    console.log(`There ${num == 1 ? 'is' : 'are'} ${num} blood ${num == 1 ? 'sample' : 'samples'} missing !!!!`)
  }else {
    console.log(`Blood samples analysed successfully`)
  }

  let postiePercent = positive * 100 / len;
  console.log(`${ parseFloat(postiePercent.toFixed(3))} % people are positive`)

}

//main method
const main = async () => {
  await question1();
  await question2();
  rl.prompt();

  rl.on("line", function (cmd) {
    bloodSamples.push(cmd.trim());
  });

  rl.on("close", function (cmd) {
    //test blood samples
    testVirus(bloodSamples);
    resultAnalysis();
    rl.close();
  });
};

main();
