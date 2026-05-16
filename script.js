const API_URL = 'https://script.google.com/macros/s/AKfycbzaWCujYMdpDumMuHATOLR7kuu6L_xPUN5mdZruuJZIWyZEZj8rm7bD-6KoOd9mlc7XUQ/exec';

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
      document.getElementById('loginModal')
    ).hide();

    loadAssignedPublikasi();

  }

}

async function loadDashboard(){

  const response =
    await fetch(`${API_URL}?action=getPublikasi`);

  const result = await response.json();

  table.clear();

  result.data.forEach(item=>{

    table.row.add([

      item.idPublikasi,
      item.namaPublikasi,
      item.statusPublikasi,
      item.progress + '%'

    ]);

  });

  table.draw();

}

async function loadCalendar(){

  const response =
    await fetch(`${API_URL}?action=getPublikasi`);

  const result = await response.json();

  const events = [];

  result.data.forEach(item=>{

    if(item.deadlineReview){

      events.push({

        title:'Deadline - ' + item.namaPublikasi,

        start:convertDate(item.deadlineReview)

      });

    }

  });

  const calendarEl =
    document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl,{

    initialView:'dayGridMonth',

    events:events

  });

  calendar.render();

}

function convertDate(dateStr){

  const parts = dateStr.split('/');

  return `${parts[2]}-${parts[1]}-${parts[0]}`;

}
