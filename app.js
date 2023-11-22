const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = JSON.parse(fs.readFileSync('questions.json', 'utf-8'));

function findQuestionsWithTarget(i, target, sum, currentCombination, questions, result) {
  if (i === questions.length) {
    if (target === sum) {
      result.push([...currentCombination]);
    }
    return;
  }
  findQuestionsWithTarget(i + 1, target, sum, currentCombination, questions, result);

  if (sum + questions[i].marks <= target) {
    currentCombination.push(questions[i]);
    findQuestionsWithTarget(i + 1, target, sum + questions[i].marks, currentCombination, questions, result);
    currentCombination.pop();
  }
}

function generateQuestionPaper(totalMarks, distribution) {
  const easyCount = Math.ceil(totalMarks * (distribution.easy / 100));
  const mediumCount = Math.ceil(totalMarks * (distribution.medium / 100));
  const hardCount = Math.ceil(totalMarks * (distribution.hard / 100));

  const easyQuestions = questions.filter(q => q.difficulty === 'Easy');
  const mediumQuestions = questions.filter(q => q.difficulty === 'Medium');
  const hardQuestions = questions.filter(q => q.difficulty === 'Hard');
  if (easyQuestions.length < easyCount || mediumQuestions.length < mediumCount || hardQuestions.length < hardCount) {
    throw new Error('Not enough questions available to achieve the desired distribution.');
  }

  let easyCombination = [];
  let mediumCombination = [];
  let hardCombination = [];

  findQuestionsWithTarget(0, easyCount, 0, [], easyQuestions, easyCombination);
  findQuestionsWithTarget(0, mediumCount, 0, [], mediumQuestions, mediumCombination);
  findQuestionsWithTarget(0, hardCount, 0, [], hardQuestions, hardCombination);

  let answer = [];
console.log(easyCombination[0].length)
  hardCombination.forEach(x => answer.push(...x));
  easyCombination[0].forEach(x => answer.push(x));
  mediumCombination.forEach(x => answer.push(...x));

  return answer;
}


rl.question('Enter total marks for the question paper: ', (totalMarksInput) => {
  rl.question('Enter difficulty distribution (easy medium hard, separated by spaces): ', (distributionInput) => {
    try {
      const totalMarks = parseInt(totalMarksInput, 10);
      if (isNaN(totalMarks)) {
        throw new Error('Invalid input for total marks. Please enter a valid number.');
      }

      const [easy, medium, hard] = distributionInput.split(' ').map(Number);


      const difficultyDistribution = { easy, medium, hard };
      const questionPaper = generateQuestionPaper(totalMarks, difficultyDistribution);

      console.log('Generated Question Paper:');
      console.log(questionPaper);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      rl.close();
    }
  });
});
