var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
var albumCover = document.getElementsByClassName('album-cover-art')[0];

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
};

var albumMarconi = {
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
};

var albumQOTSA = {
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
		+'	<td class="song-item-number">' + songNumber + '</td>'
		+'	<td class="song-item-title">' + songName + '</td>'
		+'	<td class="song-item-duration">' + songLength + '</td>'
		+'</tr>'
		;
		
		return template;	
};

var setCurrentAlbum = function(album) {	
	albumTitle.firstChild.nodeValue = album.title;
	albumArtist.firstChild.nodeValue = album.artist;
	albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
	albumImage.setAttribute('src', album.albumArtUrl);
	albumSongList.innerHTML = '';
	
	for (var i = 0; i < album.songs.length; i++) {
		albumSongList.innerHTML += createSongRow(i +1, album.songs[i].title, album.songs[i].duration);
	}
};

var albumArray = [albumPicasso, albumMarconi, albumQOTSA];
var index = 1;

window.onload = function() {
	setCurrentAlbum(albumPicasso);
	
	albumImage.addEventListener('click', function() {
		setCurrentAlbum(albumArray[index]);
		index ++;
		
		if (index >= albumArray.length) {
			index = 0;
		}
	});	
};
