function begin() { 
  var email = 'alejandra@gmail.com';
  firebase.database().ref('registro').on('child_added', function(s) {
    /* Estructura de objeto vistos */
    var vistos2 = ['pelicula1', 'pelicula2'];
    var vistos = {
        estado : 'vistos',
        contVistos : 2,
        peliculas : [
            {
                title: 'Batman',
                img: ''
            },
            {
                title: 'Coco',
                img: ''
            },
        ]
    }
    /* Estructura de objeto guardados */
    var guardados = {
        estado : 'guardados',
        contVistos : 1,
        peliculas : [
            {
                title: 'dddd',
                img: ''
            }
        ]
    }
    /*
    var user = s.val();
      if (user.email == email) {
        firebase.database().ref('registro/'+user.uid)
        .push(vistos2);  
    } 
    */

    
  });
}
$(document).ready(begin);