//retrieve the stored student and if empty return an empty array
let students = JSON.parse(localStorage.getItem("students")) || [];
let grade = document.getElementById("grade");
let name = document.getElementById("studentName");
let addButton = document.querySelector('button[type="submit"]');
const form = document.getElementById("gradeForm");

//to submit the form
form.addEventListener("submit", function (event) {
  const isValid = validateSubmission(name, grade);
  if (isValid) {
    addStudent(name.value, grade.value);
    displayStudents();
  }
});

function validateSubmission(name, grade) {
  let isValid = true;

  if (name.value.trim() === "") {
    displayError(nameError, "nameError", "Student name is required");
    alert("Student name is required");
    isValid = false;
  } else {
    displayError(nameError, "nameError", "");
  }

  //grade validation
  if (grade.value.trim() === "") {
    displayError(gradeError, "gradeError", "Grade is required");
    alert("Grade is required");
    isValid = false;
  } else if (isNaN(grade.value)) {
    displayError(gradeError, "gradeError", "Grade is required");
    alert("Grade is required");
    isValid = false;
  } else if (isNaN(grade.value) || grade.value < 0 || grade.value > 100) {
    displayError(grade, 'gradeError', 'Grade must be a number between 0 and 100');
    alert("Grade must be a number between 0 and 100");
    isValid = false;
  } else {
    displayError(gradeError, "gradeError", "");
  }
  return isValid;
}

//add student to the declared array
function addStudent(name, grade) {
  let id = students.length + 1;
  students.push({ id, name, grade });
  saveStudentsToLocalStorage();
  // console.log(students);
}

// //event listner for the add button
// addButton.addEventListener('click', function(event) {
//     event.preventDefault();
//     addStudent(name.value, grade.value);
//     displayStudents();

// })

//delete student from the declared array
function deleteStudent(id) {
  students.forEach((student, index) => {
    if (student.id === id) {
      students.splice(index, 1);
    }
  });
  saveStudentsToLocalStorage();
  displayStudents();
}

//function to display students in the table
function displayStudents() {
  let tableBody = document.querySelector("table tbody");
  tableBody.innerHTML = "";
  students.forEach((student) => {
    const row = document.createElement("tr");
    //link row to sudent_id
    row.setAttribute("data-id", student.id);
    row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.grade}</td>
            <td><button id="delete" onclick="deleteStudent(${student.id})">Delete</button></td>
        `;
    tableBody.appendChild(row);
  });
  calculateAverage();
  studentPassed();
  // console.log(students);
}

//to calculate the average grade of the students
function calculateAverage() {
  let displayAverageGrade = document.getElementById("averageGrade");
  let totalStudents = students.length;
  let totalGrade = 0;
  if (totalStudents === 0) {
    displayAverageGrade.innerHTML = `Average Grade: N/A`;
    return 0;
  }
  students.forEach((student) => {
    totalGrade += parseFloat(student.grade);
  });
  let averageGrade = totalGrade / totalStudents;
  displayAverageGrade.innerHTML = `Average Grade: ${averageGrade.toFixed(2)}`;
  return averageGrade;
}

//to check the student that had a passmark
function studentPassed() {
  let passMark = calculateAverage();
  students.forEach((student) => {
    let row = document.querySelector(`tr[data-id="${student.id}"]`);
    if (parseFloat(student.grade) >= passMark) {
      row.classList.add("pass");
    } else {
      row.classList.remove("pass");
    }
  });
}

//to store in a local storage
function saveStudentsToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

function displayError(input, errorId, message) {
  input.classList.add("error");
  document.getElementById(errorId).innerHTML = message;
}

displayStudents();
