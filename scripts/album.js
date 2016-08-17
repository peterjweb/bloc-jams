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
			var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
			currentlyPlayingCell.html(currentlyPlayingSongNumber);
		}
			
		if (currentlyPlayingSongNumber !== songNumber) {
			var $volumeFill = $('.volume .fill');
			var $volumeThumb = $('.volume .thumb');
			$volumeFill.width(currentVolume + '%');
			$volumeThumb.css({ left : currentVolume + '%'});
			$(this).html(pauseButtonTemplate);
			setSong(songNumber);
			currentSoundFile.play();
			updateSeekBarWhileSongPlays();
			currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
			updatePlayerBarSong();
		} else if (currentlyPlayingSongNumber === songNumber) {
			if (currentSoundFile.isPaused()) {
				$(this).html(pauseButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPauseButton);	
				currentSoundFile.play();
			} else {
				$(this).html(playButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPlayButton);
				currentSoundFile.pause();
			}
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
		var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
		$albumSongList.append($newRow);
	}
};

var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
};

var setSong = function(songNumber) {
	if (currentSoundFile) {
		currentSoundFile.stop();
	}
	
	currentlyPlayingSongNumber = parseInt(songNumber);
	currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
	
	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
		formats : ['mp3'],
		preload : true
	});
	
	setVolume(currentVolume);
};

var seek = function(time) {
	if (currentSoundFile) {
		currentSoundFile.setTime(time);
	}
}

var setVolume = function(volume) {
	if (currentSoundFile) {
		currentSoundFile.setVolume(volume);
	}
}

var getSongNumberCell = function(number) {
	return $('.song-item-number[data-song-number="' + number + '"]');
}

var nextSong = function() {
	var getLastSongNumber = function(index) {
		return index == 0 ? currentAlbum.songs.length : index;
	};
	
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	currentSongIndex++;
	
	if (currentSongIndex >= currentAlbum.songs.length) {
		currentSongIndex = 0;
	}
	
	setSong(currentSongIndex + 1);
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();
	currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
	
	$('.currently-playing .song-name').text(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
	$('.main-controls .play-pause').html(playerBarPauseButton);
	
	var lastSongNumber = getLastSongNumber(currentSongIndex);
	var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
	
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
	
	setSong(currentSongIndex + 1);
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();
	currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
	
	$('.currently-playing .song-name').text(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
	$('.main-controls .play-pause').html(playerBarPauseButton);
	
	var lastSongNumber = getLastSongNumber(currentSongIndex);
	var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
	
	$previousSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);	
};

var togglePlayFromPlayerBar = function() {
	var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
	
	if (currentSoundFile.isPaused()) {
		$currentlyPlayingCell.html(pauseButtonTemplate);
		$(this).html(playerBarPauseButton);
		currentSoundFile.play();
	} else if (currentSoundFile) {
		$currentlyPlayingCell.html(playButtonTemplate);
		$(this).html(playerBarPlayButton);
		currentSoundFile.pause();
	}
};

var updatePlayerBarSong = function() {
	$('.currently-playing .song-name').text(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
	$('.main-controls .play-pause').html(playerBarPauseButton);
};

var updateSeekBarWhileSongPlays = function() {
	if (currentSoundFile) {
		currentSoundFile.bind('timeupdate', function(event) {
			var seekBarFillRatio = this.getTime() / this.getDuration();
			var $seekBar = $('.seek-control .seek-bar');
			
			updateSeekPercentage($seekBar, seekBarFillRatio);
		});
	}
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
	var offsetXPercent = seekBarFillRatio * 100;
	offsetXPercent = Math.max(0, offsetXPercent);
	offsetXPercent = Math.min(100, offsetXPercent);
	
	var percentageString = offsetXPercent + '%';
	$seekBar.find('.fill').width(percentageString);
	$seekBar.find('.thumb').css({ left : percentageString });
};

var setupSeekBars = function() {
	var $seekBars = $('.player-bar .seek-bar');
	
	$seekBars.click(function(event) {
		var offsetX = event.pageX - $(this).offset().left;
		var barWidth = $(this).width();
		var seekBarFillRatio = offsetX / barWidth;
		
		if ($(this).parent().attr('class') == 'seek-control') {
			seek(seekBarFillRatio * currentSoundFile.getDuration());
		} else {
			setVolume(seekBarFillRatio * 100);
		}
		
		updateSeekPercentage($(this), seekBarFillRatio);
	});
	
	$seekBars.find('.thumb').mousedown(function(event) {
		var $seekBar = $(this).parent();
		
		$(document).bind('mousemove.thumb', function(event) {
			var offsetX = event.pageX - $seekBar.offset().left;
			var barWidth = $seekBar.width();
			var seekBarFillRatio = offsetX / barWidth;
			
			if ($seekBar.parent().attr('class') == 'seek-control') {
				seek(seekBarFillRatio * currentSoundFile.getDuration());
			} else {
				setVolume(seekBarFillRatio);
			}
		
			updateSeekPercentage($seekBar, seekBarFillRatio);
		});
		
		$(document).bind('mouseup.thumb', function() {
			$(document).unbind('mousemove.thumb');
			$(document).unbind('mouseup.thumb');
		});
	});
};

var	albumCover = document.getElementsByClassName('album-cover-art')[0],
	albumArray = [albumPicasso, albumMarconi, albumQOTSA];
	
var currentAlbum = null,  
	currentlyPlayingSongNumber = null,
	currentSongFromAlbum = null,
	currentSoundFile = null,
	currentVolume = 80;
	
var $previousButton = $('.main-controls .previous'),
	$nextButton = $('.main-controls .next'),
	$playPauseButton = $('.main-controls .play-pause');
	
var	playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>',
	pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>',
	playerBarPlayButton = '<span class="ion-play"></span>',
	playerBarPauseButton = '<span class="ion-pause"></span>';

$(document).ready(function() {	
	setCurrentAlbum(albumPicasso);
	setupSeekBars();
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
	$playPauseButton.click(togglePlayFromPlayerBar);
});
