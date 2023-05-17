const cron = require('node-cron');

let attempt = 0;
const maxAttempt = 15;
let watchDeployment = null;
const twosecondsCronExpression = '*/2 * * * * *';
const successfulStatuses = ["Ready","Deployed"];
const availableStatues = ["Ready","Failed","Started","Ready"];

function startPeriodicJob(deploymentStatus,deploymentName,nameSpace,matchers) {
  watchDeployment = cron.schedule(twosecondsCronExpression, () => {
    console.log('Running the periodic job...');
    const requirementFulfilled = checkRequirement(deploymentStatus,deploymentName,nameSpace,matchers);
    if (requirementFulfilled) {
      // setTimeout ensures stopping the task to allow the current iteration to complete
      setTimeout(stopPeriodicJob, 1000);
      console.log('Job will end after the current iteration.');
    }
  });
}


function stopPeriodicJob() {
  if (watchDeployment !== null) {
    watchDeployment.stop();
  }
}

function checkRequirement(f, farg1,farg2,matchers ) {
  attempt++;
  if (attempt >= maxAttempt) {
    return true;
  }
  var outcome = f(farg1,farg2);
  if(matchers.includes(outcome)){
    return true;
  }
  return false;
}

// Deployment statuc check api call simulation
function checkDeploymentStatus(deploymentName,nameSpace){
  console.log("deployment name is "+deploymentName);
  console.log("namespace name is "+nameSpace);
  const randomIndex = Math.floor(Math.random() * availableStatues.length);
  let selectedResult = availableStatues[randomIndex];
  console.log("selected result is "+selectedResult);
  return selectedResult
}

// TODO Call this when Deployment started SSE is receieved
startPeriodicJob(checkDeploymentStatus,"D001","NS",successfulStatuses);
