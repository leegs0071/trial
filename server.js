<!--server.js-->

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
    getAllData(); // 데이터 저장 후 데이터 다시 조회
  } else {
    console.error('Failed to save data.');
  }
}

// 저장된 데이터 조회
async function getAllData() {
  const response = await fetch('/get-all-data');
  if (response.ok) {
    const data = await response.json();
    renderDataList(data);
  } else {
    console.error('Failed to get data.');
  }
}

