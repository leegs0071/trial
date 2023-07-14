//script.js

document.addEventListener('DOMContentLoaded', function() {
  const passwordForm = document.getElementById('password-form');
  const passwordList = document.getElementById('password-list');

  passwordForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const idinfo = document.getElementById('idinfo').value;
    const pwinfo = document.getElementById('pwinfo').value;

    savePassword(title, url, idinfo, pwinfo);

    passwordForm.reset();
  });

  getPasswords();

  function savePassword(title, url, idinfo, pwinfo) {
    const data = {
      title: title,
      url: url,
      idinfo: idinfo,
      pwinfo: pwinfo
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

  function getPasswords() {
    fetch('/api/passwords')
      .then(response => {
        if (!response.ok) {
          throw new Error('response error');
        }
        return response.json();
      })
      .then(data => {
        renderPasswordList(data);
      })
      .catch(error => {
        console.error('catch error : ', error);
      });
  }

  function renderPasswordList(passwords) {
    passwordList.innerHTML = '';

    passwords.forEach(password => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>Title:</strong> ${password.title}<br>
          <strong>URL:</strong> ${password.url}<br>
          <strong>ID:</strong> ${password.idinfo}<br>
          <strong>Password:</strong> ${password.pwinfo}
        </div>
        <div>
          <button class="edit-button" data-id="${password.idinfo}">Edit</button>
          <button class="delete-button" data-id="${password.idinfo}">Delete</button>
        </div>
      `;

      passwordList.appendChild(li);
    });
  }
});
