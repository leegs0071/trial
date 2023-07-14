// script.js

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
    const user = document.getElementById('user').value;
    const updatedAt = new Date().toISOString();

    saveData(title, url, id, password, user, updatedAt);

    passwordForm.reset();
  });

  // 저장된 데이터 조회
  getAllData().then(function(data) {
    renderDataList(data);
  });

  // 저장된 데이터 리스트 표시
  function renderDataList(data) {
    passwordList.innerHTML = '';

    data.forEach(function(item) {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>Title:</strong> ${item.title}<br>
          <strong>URL:</strong> ${item.url}<br>
          <strong>ID:</strong> ${item.id}<br>
          <strong>Password:</strong> ${item.password}<br>
          <strong>User:</strong> ${item.user}<br>
          <strong>Updated At:</strong> ${item.updated_at}<br>
        </div>
        <button class="edit-button" data-id="${item.id}">Edit</button>
        <button class="delete-button" data-id="${item.id}">Delete</button>
      `;

      passwordList.appendChild(li);
    });
  }

  // 데이터 저장
  async function saveData(title, url, id, password, user, updatedAt) {
    const response = await fetch('/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        url: url,
        id: id,
        password: password,
        user: user,
        updatedAt: updatedAt
      })
    });

    if (response.ok) {
      const data = await response.json();
      renderDataList(data);
    } else {
      console.error('Failed to save data.');
    }
  }

  // 데이터 삭제
  passwordList.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-button')) {
      const id = event.target.dataset.id;
      deleteData(id);
    }
  });

  async function deleteData(id) {
    const response = await fetch(`/delete-data/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      const data = await response.json();
      renderDataList(data);
    } else {
      console.error('Failed to delete data.');
    }
  }
});
