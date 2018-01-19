function begin() {
  var btnRegistry = $('#btnRegistry');
  var btnAccess = $('#btnAccess');
  var tempAccess = false;
  registry();
  login();

  /* Función para crear registro de usuario en Firebase*/
  function registry() {
    var validateNames = false;
    var validateEmail = false;
    var validatePassword = false;
    var validateChecked = false;
    var $checked = $('input[type="checkbox"]');

    /**  Validar todos los campos **/

    /* Activar Boton registrar */
    function activeButton() {
      if (validateNames && validateEmail && validatePassword && validateChecked) {
        btnRegistry.attr('disabled', false);
      }
    }
    /* Desactivar Boton registrar */
    function desactiveButton() {
      btnRegistry.attr('disabled', true);
    }

    /* Validar al escribir en nombres */
    $('#names').on('input', function() {
      var NAMES = /^([A-z ñáéíóú]{2,8})$/;
      if (NAMES.test($(this).val())) {
        validateNames = true;
        activeButton();
      } else {
        desactiveButton();
      }
    });
    /* Validar al escribir correo */
    $('#email').on('input', function() {
      var exp = /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/;
      if (exp.test($(this).val())) {
        validateEmail = true;
        activeButton();
      } else {
        desactiveButton();
      }
    });
    /* Validar al escribir contraseña */
    $('#password').on('input', function() {
      if ($(this).val().length > 6) {
        validatePassword = true;
        activeButton();
      } else {
        desactiveButton();
      }
    });

    $checked.on('click', function(event) {
      if ($checked.prop('checked')) {
        validateChecked = true;
        activeButton();
      } else {
        desactiveButton();
      }
    });
    /* Registro en firebase */
    btnRegistry.on('click', function(event) {
      event.preventDefault();
      var email = $('#email').val();
      var password = $('#password').val();
      var names = $('#names').val();
      localStorage.nombres = $('#names').val();
      localStorage.email = $('#email').val();
      localStorage.password = $('#password').val();

      
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result) {
        var newUser = {
          uid : result.uid,
          names : localStorage.nombres,
          email : localStorage.email
        };
        
        firebase.database().ref('registro/'+result.uid).set(newUser); 
        
        alert('Registro OK');     
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert('Usuario ya registrado');
      });

      $('#names').val('');
      $('#email').val('');
      $('#password').val('');
      $checked.prop('checked', false);
    });
  }

  /* Función para identificar sign in en Firebase.*/
  function login() {
    var validateEmail = false;
    var validatePassword = false;

    /* Validar al escribir correo */
    $('#user').on('input', function() {
      var exp = /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/;
      if (exp.test($(this).val())) {
        validateEmail = true;
        activeButton();
      } else {
        desactiveButton();
      }
    });

    /* Validar al escribir contraseña */
    $('#key').on('input', function() {
      if ($(this).val().length > 6) {
        validatePassword = true;
        activeButton();
      } else {
        desactiveButton();
      }
    });

    /* Activar Boton registrar */
    function activeButton() {
      if (validateEmail && validatePassword) {
        btnAccess.attr('disabled', false);
      }
    }

    /* Desactivar Boton registrar */
    function desactiveButton() {
      btnAccess.attr('disabled', true);
    }
    /* Comparar correo y password */
    btnAccess.on('click', function(event) {
      event.preventDefault();
      var email = $('#user').val();
      var password = $('#key').val();
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
        $('.title-header').html(
          '<div id="title-header" class="collapse navbar-collapse title-header" id="bs-example-navbar-collapse-1">'+
          '<ul class="nav navbar-nav navbar-right">'+
            '<li class="dropdown">'+
              '<a href="" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">'+localStorage.nombres+'<span class="caret"></span></a>'+
              '<ul class="dropdown-menu">'+
                '<li><a href="views/profile.html">Perfil</a></li>'+
                '<li><a href="index.html">Cerrar Sesión</a></li>'+
              '</ul>'+
              '</li>'+
          '</ul>'+
        '</div>'
        );
        tempAccess = true;
        localStorage.tempAccess = tempAccess;
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode) {
          alert(errorMessage);
        }
      });

    });
  };

  /* Estrella  */
  var $searchForm = $('#search-form');
  var $moviesSelected = $('#movies-selected');
  var $clickMoviePredetermined = $('.click-movie-predetermined');
  console.log($moviesSelected);

  // Evento para las películas predeterminadas
  $clickMoviePredetermined.on('click', function() {
    // console.log($(this).text());
    var movieIdClick = $(this).parent().find('p').text();
    console.log(movieIdClick);
    // Make a request for a user with a given ID
    axios.get('http://www.omdbapi.com/?i=' + movieIdClick + '&apikey=3a0eede3')
      .then(function(response) {
        console.log(response.data);
        localStorage.saveTitlePicked = response.data.Title;
        localStorage.savePosterPicked = response.data.Poster;
        $(location).attr('href', 'views/movie.html');
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  // Evento para poder capturar la búsqueda de la película y pasar función 
  $searchForm.on('submit', function(event) {
    var searchText = $searchForm.find('input').val();
    // console.log(searchText);
    // Le paso la función getMovies que buscará en el API de OMDB
    getMovies(searchText);
    event.preventDefault();
  });

  // Función para buscar la película por título
  function getMovies(searchText) {
    console.log(searchText);
    axios.get('http://www.omdbapi.com/?s=' + searchText + '&apikey=3a0eede3')
      .then(function(response) {
        // Un array con todos los títulos que coinciden
        console.log(response);
        console.log(response.data.Search);
        var movieSearch = response.data.Search;
        var output = '';
        $('#predetermined-movies').hide();
        // Recorrer en un lugar de for
        $.each(movieSearch, function(index, value) {
          // console.log(index); // devuelve posición, 0, 1, 2, etc    
          // console.log(value); //Objeto que contiene tittle, year, etc
          // console.log(movieSearch[index]);
          // console.log(movieSearch);
          output += `
            <div class="col-xs-6 col-md-3 clearfix">
              <div class="movie-box text-center">
                <img src="${value.Poster}">
                <button type="button" class="btn btn-info pick-this-movie">${value.Title}</button>
                <p class="hidden">${value.imdbID}</p>
              </div>
            </div>
          `;
        });
        $moviesSelected.html(output);


        // Función para jalar el contenido del botón al hacer click
        $('.pick-this-movie').on('click', function() {
          var posterMoviePicked = $(this).parent();
          console.log(posterMoviePicked.find('img').attr('src'));
          var titlePicked = $(this).text();
          // Almacenando temporalmente el nombre del título y la foto
          localStorage.saveTitlePicked = titlePicked;
          localStorage.savePosterPicked = posterMoviePicked.find('img').attr('src');
          localStorage.idPicked = posterMoviePicked.find('p');
          $(location).attr('href', 'views/movie.html');
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  /* Alejandra Hoces */
  /* ------------ FUNCIONALIDAD PARA SUBIR FOTOS ------------*/
  /** Función para postear  */
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(event) {
        $('#image1')
          .attr('src', event.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
$(document).ready(begin);