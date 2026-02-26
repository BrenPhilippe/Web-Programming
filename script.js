function calculateAge(birthYear) {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

function isPrime(number) {
  if (number <= 1) return false;
  if (number === 2) return true;
  if (number % 2 === 0) return false;

  for (let i = 3; i * i <= number; i += 2) {
    if (number % i === 0) return false;
  }
  return true;
}

function checkAgePrime() {
  const input = document.getElementById("birthYear").value.trim();

  const birthYear = Number(input);
  const currentYear = new Date().getFullYear();

  if (
    input === "" ||
    !Number.isInteger(birthYear) ||
    birthYear <= 0 ||
    birthYear > currentYear
  ) {
    alert("Please enter a valid birth year.");
    return;
  }

  const age = calculateAge(birthYear);
  const prime = isPrime(age);

  const primeMessage = prime
    ? `${age} is a Prime number.`
    : `${age} is NOT a Prime number.`;

  alert(`Your age is: ${age}\n${primeMessage}`);
}