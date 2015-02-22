angular
  .module('fakebookApp', ['ngMaterial'])
  .service('songService', function() {

    var songToEdit = {};

    var editSong = function(song) {
      songToEdit = song;
    };

    return {
      songToEdit: songToEdit,
      editSong: editSong
    };

  })
  .controller('songDataController',
    function($scope, $http, $timeout, $mdBottomSheet, songService) {

    // Store the bookcodes and the songs
    $scope.bookcodes = [];
    $scope.songs = [];

    // Store the text that the user filters songs by
    $scope.filterText = '';
    $scope.selectedBook = '';

    // Get the bookcodes initially
    $http.get('/bookcodes').success(function(data, status, headers) {

      $scope.bookcodes = data;

    });

    // Get the songs initially
    $http.get('/songs').success(function(data, status, headers ) {

      $scope.songs = data;

    });

    // Filter the songs
    $scope.filter = function() {

      $http.get('/songs' +
        ( this.filterText.length > 0 || this.selectedBook.length > 0 ? '?' : '' ) +
        ( this.filterText.length > 0 ? 'filterText=' + this.filterText : '' ) +
        ( this.filterText.length > 0 && this.selectedBook.length > 0 ? '&' : '' ) +
        ( this.selectedBook.length > 0 ? 'book=' + this.selectedBook : '' ))
      .success(function(data, status, headers ) {
        $scope.songs = data;
      });

    };

    // Changes the book that's selected
    $scope.selectBook = function(code) {

      this.selectedBook = (!code ? '' : code);
      this.filter();

    };

    // Show the edit song form
    $scope.showEditForm = function($event, song) {

      songService.songToEdit = song;
      $mdBottomSheet.show({
        templateUrl: 'templates/edit-song.html',
        controller: 'editSongController',
        targetEvent: $event
      }).then(function() {
        $scope.filter();
      });

    };
  })
  .controller('editSongController',
    function($http, $scope, $mdBottomSheet, songService) {

    $scope.editSong = JSON.parse(JSON.stringify(songService.songToEdit));

    $scope.cancel = function() {
      $mdBottomSheet.hide();
    };

    $scope.delete = function() {

      // Remove that song from the database
      $http.delete('songs?id=' + this.editSong.id)
      .success(function(data, status, headers) {
        $mdBottomSheet.hide();
      });

    };

    $scope.save = function() {

      // Update the song in the database
      $http.post('songs?id=' + this.editSong.id + '&title=' +
        this.editSong.title + '&bookcode=' + this.editSong.bookcode + '&page=' +
        this.editSong.page)
      .success(function(data, status, headers) {
        $mdBottomSheet.hide();
      });

    };

  });