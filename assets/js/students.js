let students = [];
let id = 0;
let toplam = 0;
let frontEnd = document.querySelector(".frontEnd");
let backend = document.querySelector(".backend");
let mobile = document.querySelector(".mobile");

if (localStorage.students) {
  students = JSON.parse(localStorage.students);
  renderStudents();
}

if (localStorage.id) {
  id = Number(localStorage.id);
}

function generateId() {
  id++;
  localStorage.id = id;
  return id;
}

addStudentsBtn.addEventListener("click", () => {
  modal.classList.remove("editModal");
  document.querySelector('input[name = "id"]').value = "";
  modal.showModal();
});

function handleStudentsForm() {
  let formData = new FormData(addStudentsForm);
  let formObj = Object.fromEntries(formData);
  addStudentsForm.reset();

  if (formObj.id !== "") {
    let student = students.find((x) => x.id === Number(formObj.id));
    student.name = formObj.name;
    student.lname = formObj.lname;
    student.section = formObj.section;
    student.vize1 = formObj.vize1;
    student.vize2 = formObj.vize2;
    student.final = formObj.final;
    student.grade = handleTotal(formObj.vize1, formObj.vize2, formObj.final);
    student.note = handleScoreControl();
  } else {
    students.push({
      id: generateId(),
      name: formObj.name,
      lastname: formObj.lname,
      section: formObj.section,
      vize1: Number(formObj.vize1),
      vize2: Number(formObj.vize2),
      final: Number(formObj.final),
      grade: handleTotal(formObj.vize1, formObj.vize2, formObj.final),
      note: handleScoreControl(),
    });
  }
  save();
  renderStudents();
}

addStudentsForm.addEventListener("submit", handleStudentsForm);

function save() {
  localStorage.students = JSON.stringify(students);
}

function createStudentHtml(student) {
  return `
  <div class="movie">
        <div class="movieEditControls">
          <a class="movieEditBtn" href="#" data-studentid="${student.id}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
          </a>
          <a class="movieDeleteBtn" href="#" data-studentid="${student.id}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
          </a>
        </div>
      <h5>${student.name} ${student.lastname}</h5>
      <h6>${student.section}</h6>
      <p>Vize1: ${student.vize1}</p>
      <p>Vize2: ${student.vize2}</p>
      <p>Final: ${student.final}</p>
      <p>Ortalama: ${student.grade} - ${student.note}</p>
      </div>
  `;
}

function handleScoreControl() {
  if (toplam >= 90) {
    return "AA Başarılı";
  } else if (toplam >= 85) {
    return "BA Başarılı";
  } else if (toplam >= 80) {
    return "BB Başarılı";
  } else if (toplam >= 75) {
    return "CB Geçer";
  } else if (toplam >= 70) {
    return "CC Geçer";
  } else if (toplam >= 65) {
    return "DC Koşullu Geçer";
  } else if (toplam >= 60) {
    return "DD Koşullu Geçer";
  } else if (toplam >= 50) {
    return "FD Başarısız";
  } else {
    return "FF Başarısız Kaldın";
  }
}

function handleTotal(vize1, vize2, final) {
  let ortVize1 = Number(vize1) * 0.3;
  let ortVize2 = Number(vize2) * 0.3;
  let ortFinal = Number(final) * 0.4;
  toplam = ortVize1 + ortVize2 + ortFinal;

  return toplam.toFixed(2);
}

function handleDeleteBtn(e) {
  e.preventDefault();

  if (!confirm("Emin Misin ?")) {
    return;
  }

  students = students.filter((x) => x.id !== Number(this.dataset.studentid));

  save();
  renderStudents();
  localStorage.clear();
  students = [];
}

function handleEditBtn(e) {
  e.preventDefault();
  modal.classList.add("editModal");

  let studentId = Number(this.dataset.studentid);
  let student = students.find((x) => x.id === studentId);

  document.querySelector('input[name = "id"]').value = student.id;
  document.querySelector('input[name = "name"]').value = student.name;
  document.querySelector('input[name = "lname"]').value = student.lname;
  document.querySelector('select[name = "section"]').value = student.section;
  document.querySelector('input[name = "vize1"]').value = student.vize1;
  document.querySelector('input[name = "vize2"]').value = student.vize2;
  document.querySelector('input[name = "final"]').value = student.final;
  modal.showModal();
}

function handleClear() {
  localStorage.clear();
  students = [];
  renderStudents();
  students.reset();
}

clearStorage.addEventListener("click", handleClear);

function renderStudents() {
  frontEnd.innerHTML = "";
  backend.innerHTML = "";
  mobile.innerHTML = "";
  students.forEach((student) => {
    if (student.section === "Frontend") {
      frontEnd.innerHTML += createStudentHtml(student);
    } else if (student.section === "Backend") {
      backend.innerHTML += createStudentHtml(student);
    } else if (student.section === "Mobile") {
      mobile.innerHTML += createStudentHtml(student);
    }
  });

  document
    .querySelectorAll(".movieDeleteBtn")
    .forEach((x) => x.addEventListener("click", handleDeleteBtn));

  document
    .querySelectorAll(".movieEditBtn")
    .forEach((x) => x.addEventListener("click", handleEditBtn));
}
