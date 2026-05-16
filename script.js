const API_URL = 'PASTE_WEB_APP_URL';

let currentUser = null;
let table;

$(document).ready(function(){

  table = $('#tabelPublikasi').DataTable();

  loadDashboard();
  loadCalendar();

});

function showPage(pageId, el){

  document.querySelectorAll('.page')
    .forEach(page=>{
      page.classList.remove('active');
    });

  document.getElementById(pageId)
    .classList.add('active');

}

function showLoginModal(){

  const modal = new bootstrap.Modal(
    document.getElementById('loginModal')
  );

  modal.show();

}

async function loginSystem(){

  const username =
    document.getElementById('loginUsername').value;

  const password =
    document.getElementById('loginPassword').value;

  const response = await fetch(
    `${API_URL}?action=login&username=${username}&password=${password}`
  );

  const result = await response.json();

  if(result.success){

    currentUser = result;

    localStorage.setItem(
      'kueputu_user',
      JSON.stringify(result)
    );

    if(result.role === 'admin'){

      document.getElementById('menuUpload')
        .classList.add('show');

      document.getElementById('menuReview')
        .classList.add('show');

    }

    else if(result.role === 'operator'){

      document.getElementById('menuUpload')
        .classList.add('show');

    }

    else if(result.role === 'reviewer'){

      document.getElementById('menuReview')
        .classList.add('show');

    }

    bootstrap.Modal.getInstance(
}
