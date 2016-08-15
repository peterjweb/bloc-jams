var albumPicasso = {
    title : "The Colors",
    artist : "Pablo Picasso",
    label : "Cubism",
    year : "1881",
	albumArtUrl: "assets/images/album_covers/01.png",
    songs : [
        { title: "Blue", duration: "4:26" },
        { title: "Green", duration: "3:14" },
        { title: "Red", duration: "5:01" },
        { title: "Pink", duration: "3:21" },
        { title: "Magenta", duration: "2:15" }
    ]
},
	albumMarconi = {
    title : "The Telephone",
    artist : "Guglielmo Marconi",
    label : "EM",
    year : "1909",
	albumArtUrl: "assets/images/album_covers/20.png",
    songs : [
        { title: "Hello, Operator?", duration: "1:01" },
        { title: "Ring, ring, ring", duration: "5:01" },
        { title: "Fits in your pocket", duration: "3:21" },
        { title: "Can you hear me now?", duration: "3:14" },
        { title: "Wrong phone number", duration: "2:15" }
    ]
},
	albumQOTSA = {
	title : "Songs for the Deaf",
	artist : "Queens Of The Stoneage",
	label : "Interscope",
	year : "2002",
	albumArtUrl : "assets/images/album_covers/22.png",
	songs : [
		{ title : "You Think I Ain't Worth a Dollar, But I Feel Like a Millionaire", duration: "3:12" },
		{ title : "No One Knows", duration: "4:38" },
		{ title : "First It Giveth", duration: "3:18" },
		{ title : "A Song for the Dead", duration: "5:52" },
		{ title : "The Sky Is Fallin'", duration: "6:15" },
		{ title : "Six Shooter", duration: "1:19" },
		{ title : "Hangin' Tree", duration: "3:06" },
		{ title : "Go with the Flow", duration: "3:09" },
		{ title : "Gonna Leave You", duration: "2:50" },
		{ title : "Do It Again", duration: "4:04" },
		{ title : "God Is in the Radio", duration: "6:04" },
		{ title : "Another Love Song", duration: "3:16" },
		{ title : "A Song for the Deaf", duration: "6:42" },
		{ title : "Mosquito Song", duration: "5:37" }
	]
};

var createSongRow = function(songNumber, songName, songLength) {
	var template = 
		 '<tr class="album-view-song-item">'
		+'	<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'	
		+'	<td class="song-item-title">' + songName + '</td>'
		+'	<td class="song-item-duration">' + songLength + '</td>'
		+'</tr>'
		;
		
	var $row = $(template),
		clickHandler = function() {
			var songNumber = $(this).attr('data-song-number');
			
			if (currentlyPlayingSong !== null) {
				var currentlyPlayingElement = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
				currentlyPlayingElement.html(currentlyPlayingSong);
			}
			
			if (currentlyPlayingSong !== songNumber) {
				$(this).html(pauseButtonTemplate);
			} else if (currentlyPlayingSong === songNumber) {
				$(this).html(playButtonTemplate);
				currentlyPlayingSong = null;
			}
		},
		onHover = function(event) {
			var songNumberElement = $(this).find('.song-item-number'),
				songNumber = songNumberElement.attr('data-song-number');
			
			if (songNumber !== currentlyPlayingSong) {
				songNumberElement.html(playButtonTemplate);
			}
		},
		offHover = function(event) {
			var songNumberElement = $(this).find('.song-item-number'),
				songNumber = songNumberElement.attr('data-song-number');
			
			if (songNumber !== currentlyPlayingSong) {
				songNumberElement.html(songNumber);
			}
		};
	
	$row.find('.song-item-number').click(clickHandler);
	$row.hover(onHover, offHover);
	return $row;
};

var setCurrentAlbum = function(album) {	
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
		var $newRow = createSongRow(i +1, album.songs[i].title, album.songs[i].duration);
		$albumSongList.append($newRow);
	}
};

var	albumCover = document.getElementsByClassName('album-cover-art')[0];

var albumArray = [albumPicasso, albumMarconi, albumQOTSA],
	index = 1,
	currentlyPlayingSong = null,
	playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>',
	pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

$(document).ready(function() {	
	setCurrentAlbum(albumPicasso);
	
	albumImage.addEventListener('click', function() {
		setCurrentAlbum(albumArray[index]);
		index ++;
		
		if (index >= albumArray.length) {
			index = 0;
		}
	});	
});
