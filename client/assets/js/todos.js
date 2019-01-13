$('#search').keyup(function(event) {
  if ($('#search').val().length > 2) {
      loadData()
      $('#undone').toggle(true);
      $('#history').toggle(true);
  }
})

$('#undone_sidebar').click(function(event) {
  event.preventDefault();
  $('#undone').toggle(true);
})

$('#history_sidebar').click(function(event) {
  event.preventDefault();
  $('#history').toggle(true);
})

function loadData() {
  $('#my-list-history').empty();
  $('#my-list-undone').empty();
  getData()
  .then( response => {
      $('#update-todo-form').hide()
      let history = response.filter( item => {
          return item.date_finished
      })
      
      history = history.filter( name => {
              const regex = new RegExp(`.*${$('#search').val()}.*`, 'i');
              return regex.test (name.name) 
      })
      if (!history.length) {
          $('#my-list-history').append(`<li class="list-group-item d-flex justify-content-between align-items-center">Empty</li>`);                
      }

      history.forEach( item => {
          $('#my-list-history').append(`
          <li class="list-group-item d-flex justify-content-between align-items-center">${item.name}
            <p>${item.date_finished}</p>
            <a href="#" class="mx-1" data-toggle="modal" data-placement="top" title="Click To Details" onclick='detailTodo(${JSON.stringify(item)})'><span class="badge badge-info badge-pill"><i class="ti-search"></i></span></a>
          </li>
          `)
      })

      let undone = response.filter( item => {
          return !item.date_finished
      })

      if (!undone.length) {
          $('#my-list-undone').append(`<li class="list-group-item d-flex justify-content-between align-items-center">Empty</li>`);
      }

      undone.forEach( item => {
          $('#my-list-undone').append(`
          <li class="list-group-item d-flex justify-content-between align-items-center">
              ${item.name}
              <div class="row">
              <a href="#" class="mx-1" data-toggle="modal" data-placement="top" title="Click To Details" onclick='detailTodo(${JSON.stringify(item)})'><span class="badge badge-info badge-pill"><i class="ti-search"></i></span></a>
              <a href="#" class="mx-1" data-toggle="tooltip" data-placement="top" title="Click To Complete" onclick='checkTodo(${JSON.stringify(item._id)})'><span class="badge badge-success badge-pill"><i class="ti-check"></i></span></a>
              <a href="#" class="mx-1" data-toggle="tooltip" data-placement="top" title="Click To Update" onclick='updateTodo(${JSON.stringify(item)})'><span class="badge badge-warning badge-pill"><i class="ti-pencil-alt"></i></span></a>
              <a href="#" class="mx-1" data-toggle="tooltip" data-placement="top" title="Click To Delete" onclick='deleteTodo(${JSON.stringify(item._id)})'><span class="badge badge-danger badge-pill"><i class="ti-trash"></i></span></a>
              </div>
          </li>
          `)
      })
  })
}

function checkTodo(params) {
  event.preventDefault();
  let date_finished = new Date();
  swal({
      title: "Are you sure?",
      text: "Once checked, you will not be able to unchecked this todo!",
      icon: "info",
      buttons: true,
      dangerMode: false,
      })
      .then((willDelete) => {
          if (willDelete) {
              $.ajax({
                  url: `http://localhost:3000/todo/${params}`,
                  headers: {
                      token: localStorage.getItem('token_todo')
                  },
                  method: 'PUT',
                  data: {
                      date_finished: date_finished.setUTCHours(date_finished.getHours()),
                      status: true
                  }
                  
              }).done(response => {
                  $('input').val('');
                  loadData()
                  swal("Success", "Successfully checked todo", "success")
              }).fail(error => {
                  console.log(error);
                  
              })
          } else {
              swal("Action cancelled!", "", "error");
          }
      });
}

function deleteTodo(params) {
  event.preventDefault();
  let date_finished = new Date();
  swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to get this todo!",
      icon: "error",
      buttons: true,
      dangerMode: true,
      })
      .then((willDelete) => {
          if (willDelete) {
              $.ajax({
                  url: `http://localhost:3000/todo/${params}`,
                  headers: {
                      token: localStorage.getItem('token_todo')
                  },
                  method: 'DELETE'
              }).done(response => {
                  $('input').val('');
                  loadData()
                  swal("Success", "Successfully deleted todo", "success")
              }).fail(error => {
                  console.log(error);
                  
              })
          } else {
              swal("Action Cancelled");
          }
      });
}


$('#update_todo').click(function(event) {
  event.preventDefault();
  $.ajax({
      url: `http://localhost:3000/todo/${$('#todo_id_update').val()}`,
      headers: {
          token: localStorage.getItem('token_todo')
      },
      method: 'PUT',
      data: {
          name: $('#todo_name_update').val(),
          description: $('#todo_description_update').val(),
          due_date: $('#due_date_update').val()
      }
      
  }).done(response => {
      $('input').val('');
      swal("Success", "Successfully updated todo", "success")
      
  }).fail(error => {
      console.log(error);
      
  })
})


$('#submit_todo').click(function(event) {
  event.preventDefault();
  $.post({
      url: 'http://localhost:3000/todo',
      headers: {
          token: localStorage.getItem('token_todo')
      },
      data: {
          name: $('#todo_name_input').val(),
          description: $('#todo_description_input').val(),
          due_date: $('#due_date_input').val()
      }
  }).done(response => {
      $('input').val('');
      swal("Success", "Successfully created todo", "success")
      console.log(response);
      
  }).fail(error => {
      console.log(error);
      
  })
})

async function getData() {
  try {
      let response = await $.get({
          url: 'http://localhost:3000/todo',
          headers: {
              token: localStorage.getItem('token_todo')
          }
      })
      return response;
  } catch (error) {
      console.log(error);
  }
}

function updateTodo(params) {
  $('#input-todo-form').hide();
  $('#update-todo-form').show();
  $('#todo_id_update').val(params._id);
  $('#todo_name_update').val(params.name);
  $('#todo_description_update').val(params.description);
  $('#due_date_update').val(params.due_date.substring(0, 10));
}

function detailTodo(params) {
    $('#modal-todo').modal('show');
    $('#modal-todo-title').text(params.name);
    $('#detail_description').val(params.description);
    $('#detail_date_started').val(params.date_created);
    $('#detail_due_date').val(params.due_date);
    $('#detail_date_finished').val(params.date_finished);
}