$(document).ready(function() {
  var $movieInfoPicked = $('#movie-info-picked');
  var $viewedButton = $('#viewed-button');
  var $movieDataInfo = $('#movie-data-info');
  var imdbIDSelected;

  // Pluggin
  $('#star1').rating('votar.php', { maxvalue: 5, curvalue: 1, id : 20 });

  // Grab the title and saving at localStorage
  $movieInfoPicked.find('h4').text(localStorage.saveTitlePicked);

  // Make a request for a user with a movie title
  axios.get('http://www.omdbapi.com/?s=' + localStorage.saveTitlePicked + '&apikey=3a0eede3')
    .then(function(response) {
      var movieSearch2 = response.data.Search;
      $.each(movieSearch2, function(index, value) {
        // console.log(index);
        // console.log(value);
        // console.log(value.imdbID); 
        if (value.Title === localStorage.saveTitlePicked) {
          // console.log(value.imdbID);
          // console.log($movieInfoPicked.find('img').prop('src'));
          $movieInfoPicked.find('img').attr('src', value.Poster)
          imdbIDSelected = value.imdbID;
          // console.log(imdbIDSelected);
          // Make a request for a user with a movie title's ID
          axios.get('http://www.omdbapi.com/?i=' + imdbIDSelected + '&apikey=3a0eede3')
            .then(function(response) {
              console.log(response.data.Ratings[0]);
              console.log(response.data.Ratings[0].Source);
              console.log(response.data.Ratings[0].Source['Metacritic']);
              var infoById = response.data;
              // Añadiendo a los div correspondientes
              $('#plot p').text(infoById.Plot);
              $('#actors p').text(infoById.Actors);
              $('#awards p').text(infoById.Awards);
              $('#year p').text(infoById.Year);
              $('#genre p').text(infoById.Genre);
              $('#imdb span').text(infoById.Ratings[0].Source);
              $('#imdb p').text(infoById.Ratings[0].Value);
              $('#rotten-Tomatoes span').text(infoById.Ratings[1].Source);
              $('#rotten-Tomatoes p').text(infoById.Ratings[1].Value);
              $('#metacritic span').text(infoById.Ratings[2].Source);
              $('#metacritic p').text(infoById.Ratings[2].Value);
            })
            .catch(function (error) {
              console.log(error);
            });
          //         $('#imdb-code').text(imdbIDSelected);
          // var valor = $('#imdb-code').text();
          // console.log(valor);
          // $('#movie-data-info').html(valor);
        }
      });
    })
    .catch(function(error) {
      console.log(error);
    });
  
  // 

    

});