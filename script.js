//script.js

document.addEventListener('DOMContentLoaded', function() {
  const passwordForm = document.getElementById('password-form');
  const passwordList = document.getElementById('password-list');

  // 데이터 전송 및 저장
  passwordForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
const id = document.getElementById('id').value;
const password = document.getElementById('password').value;

savePassword(title, url, id, password);


    passwordForm.reset();
  });

  // 저장된 데이터 조회
  getPasswords();

  // 비밀번호 저장
function savePassword(title, url, id, password) {
  const data = {
    title: title,
    url: url,
    id: id,
    password: password
  };

  fetch('/api/passwords', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    getPasswords();
  })
  .catch(error => {
    console.error('Failed to save password:', error);
  });
}


  // 저장된 데이터 조회
  function getPasswords() {
    fetch('/api/passwords')
      .then(response => response.json())
      .then(data => {
        renderPasswordList(data);
      })
      .catch(error => {
        console.error('Failed to get passwords:', error);
      });
  }

  // 저장된 데이터 리스트 표시
  function renderPasswordList(passwords) {
    passwordList.innerHTML = '';

    passwords.forEach(password => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>Title:</strong> ${password.title}<br>
          <strong>URL:</strong> ${password.url}<br>
          <strong>ID Info:</strong> ${password.idinfo}<br>
          <strong>Password Info:</strong> ${password.pwinfo}
        </div>
        <div>
          <button class="edit-button" data-id="${password.id}">Edit</button>
          <button class="delete-button" data-id="${password.id}">Delete</button>
        </div>
      `;

      passwordList.appendChild(li);
    });
  }
});
