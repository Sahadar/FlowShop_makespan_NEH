function fx(chromosome, parsedProblem) {
  var that = this,
	machine = 0,
	number = null,
	minimumEndTime = {},
	job = null,
	jobsCount = chromosome.length,
	machinesCount = parsedProblem.length;
  /*
   * Iterating through machines
   * set 0 on every job on every machine
   */
  (function() {
    for(var j = 0; j < machinesCount; j++) {
      minimumEndTime[j] = {};
      for(var k = 0; k < jobsCount; k++) {
        minimumEndTime[j][k] = 0;
      }
    }
  })();

  /*
   * Iterating through machines
   * give time of job on machine
   */
  for(number in chromosome) {
    number = ~~(number);
    job = chromosome[number];

    if(typeof job !== 'number') {
      continue;
    }
    for(machine = 0; machine < machinesCount; machine++) {
      if(machine === 0) { // if first machine
        minimumEndTime[machine][number] = (parsedProblem[machine][job] + minimumEndTime[machine][number - 1]) || parsedProblem[machine][job];// time of member[chromosome] task on j machine
      } else if(typeof minimumEndTime[machine][number - 1] === 'number') { //if job is not first and not first machine
        minimumEndTime[machine][number] = ((minimumEndTime[machine][number - 1] > minimumEndTime[machine - 1][number]) ? minimumEndTime[machine][number - 1] : minimumEndTime[machine - 1][number]) + parsedProblem[machine][job];
      } else { // if job is first and is not first machine
        minimumEndTime[machine][number] = minimumEndTime[machine - 1][number] + parsedProblem[machine][job];
      }
    }
  }
  return minimumEndTime[machinesCount - 1][jobsCount - 1];
};

function calculate(problemData) {
  var machines = [];
  var jobsSum = [];
  var returnedData = {
    machines : machines,
    nehChromosome : [],
    nehResult : 0
  };
  var jobsCount;
  var machinesData = problemData.split(/\n/);

  // parse string problem into JS structure
  machinesData.forEach(function(dataMachine) {
    var jobsTime = [];
    machines.push(jobsTime);

    problemData = dataMachine.trim().split(/\s+/);
    problemData.forEach(function(jobTime) {
      var jobTimeTrimmed = jobTime.trim();

      if(jobTimeTrimmed !== '') {
        jobsTime.push(parseInt(jobTimeTrimmed, 10));
      }
    });
  });

  jobsCount = machines[0].length;

  for(let i = 0; i < jobsCount; i++) {
    jobsSum[i] = [i, 0];
    machines.forEach(function(machineData) {
      jobsSum[i][1] += machineData[i];
    });
  }
  jobsSum.sort(function(first, next) {
    return  next[1] - first[1];
  });

  // initial chromosome structure
  var chromosome = [jobsSum[0][0]];

  for(let i = 1; i < jobsCount; i++) {
    let nextJob = jobsSum[i][0];
    chromosome.push(nextJob);
    let bestChromosome = chromosome.slice(0);
    let bestChromosomeFx = fx(bestChromosome, machines);

    for(let j = 0; j < chromosome.length - 1; j++) {
      chromosome[chromosome.length - 1 - j] = chromosome[chromosome.length - 1 - j - 1];
      chromosome[chromosome.length - 1 - j - 1] = nextJob;
      let currentFx = fx(chromosome, machines);

      if(currentFx < bestChromosomeFx) {
        bestChromosome = chromosome.slice(0);
      }
    }
    chromosome = bestChromosome;
  }

  console.log('chromosome:', chromosome);
  console.log('fx: ', fx(chromosome, machines));

  returnedData['nehChromosome'] = chromosome;
  returnedData['nehResult'] = fx(chromosome, machines);

  return returnedData;
};

$(document).ready(function() {
	$('.problem-submit').on('click', function() {
		var problemInputData = $('.problem-input').val();

		calculate(problemInputData);
	});
});