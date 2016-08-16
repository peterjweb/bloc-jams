var createSongRow = function(songNumber, songName, songLength) {
	var template = 
		 '<tr class="album-view-song-item">'
		+'	<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'	
		+'	<td class="song-item-title">' + songName + '</td>'
		+'	<td class="song-item-duration">' + songLength + '</td>'
		+'</tr>'
		;
		
	var $row = $(template);
	
	var	clickHandler = function() {
		var songNumber = parseInt($(this).attr('data-song-number'));
			
		if (currentlyPlayingSongNumber !== null) {
			var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
			currentlyPlayingCell.html(currentlyPlayingSongNumber);
		}
			
		if (currentlyPlayingSongNumber !== songNumber) {
			$(this).html(pauseButtonTemplate);
			currentlyPlayingSongNumber = songNumber;
			currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
			updatePlayerBarSong();
		} else if (currentlyPlayingSongNumber === songNumber) {
			$(this).html(playButtonTemplate);
			$('.main-controls .play-pause').html(playerBarPlayButton);
			currentlyPlayingSongNumber = null;
			currentSongFromAlbum = null;
		}
	};
	
	var onHover = function(event) {
		var songNumberCell = $(this).find('.song-item-number'),
			songNumber = parseInt(songNumberCell.attr('data-song-number'));
		
		if (songNumber !== currentlyPlayingSongNumber) {
			songNumberCell.html(playButtonTemplate);
		}
	};
	
	var	offHover = function(event) {
		var songNumberCell = $(this).find('.song-item-number'),
			songNumber = parseInt(songNumberCell.attr('data-song-number'));

		if (songNumber !== currentlyPlayingSongNumber) {
			songNumberCell.html(songNumber);
		}
	};
	
	$row.find('.song-item-number').click(clickHandler);
	$row.hover(onHover, offHover);
	return $row;
};

var setCurrentAlbum = function(album) {	
	currentAlbum = album;
	
	var $albumTitle = $('.album-view-title'),
		$albumArtist = $('.album-view-artist'),
		$albumReleaseInfo = $('.album-view-release-info'),
		$albumImage = $('.album-cover-art'),
		$albumSongList = $('.album-view-song-list');
	
	$albumTitle.text(album.title);
	$albumArtist.text(album.artist);
	$albumReleaseInfo.text(album.year + ' ' + album.label);
	$albumImage.attr('src', album.albumArtUrl);
	
	$albumSongList.empty();
	
	for (var i = 0; i < album.songs.length; i++) {
		var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].length);
		$albumSongList.append($newRow);
	}
};

var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
};

var nextSong = function() {
	var getLastSongNumber = function(index) {
		return index == 0 ? currentAlbum.songs.length : index;
	};
	
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	
	currentSongIndex++;
	
	if (currentSongIndex >= currentAlbum.songs.length) {
		currentSongIndex = 0;
	}
	
	currentlyPlayingSongNumber = currentSongIndex + 1;
	currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
	
	$('.currently-playing .song-name').text(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
	$('.main-controls .play-pause').html(playerBarPauseButton);
	
	var lastSongNumber = getLastSongNumber(currentSongIndex);
	var $nextSongNumberCell = $('.song-item-number[data-song-number="'+ currentlyPlayingSongNumber + '"]');
	var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
	
	$nextSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
	var getLastSongNumber = function(index) {
		return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
	};
	
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	
	currentSongIndex--;
	
	if (currentSongIndex < 0) {
		currentSongIndex = currentAlbum.songs.length - 1;
	}
	
	currentlyPlayingSongNumber = currentSongIndex + 1;
	currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
	
	$('.currently-playing .song-name').text(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
	$('.main-controls .play-pause').html(playerBarPauseButton);
	
	var lastSongNumber = getLastSongNumber(currentSongIndex);
	var $previousSongNumberCell = $('.song-item-number[data-song-number="'+ currentlyPlayingSongNumber + '"]');
	var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
	
	$previousSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);	
};


var updatePlayerBarSong = function() {
	$('.currently-playing .song-name').text(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
	$('.main-controls .play-pause').html(playerBarPauseButton);
};

var	albumCover = document.getElementsByClassName('album-cover-art')[0],
	albumArray = [albumPicasso, albumMarconi, albumQOTSA];
	
var index = 1,
	currentAlbum = null,
	currentlyPlayingSongNumber = null,
	currentSongFromAlbum = null;
	
var $previousButton = $('.main-controls .previous'),
	$nextButton = $('.main-controls .next');
	
var	playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>',
	pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>',
	playerBarPlayButton = '<span class="ion-play"></span>',
	playerBarPauseButton = '<span class="ion-pause"></span>';

$(document).ready(function() {	
	setCurrentAlbum(albumPicasso);
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
});
