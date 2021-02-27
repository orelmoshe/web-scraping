const express = require('express'),
	app = express(),
	movieTrailer = require('movie-trailer'),
	{ scrapping } = require('./scripts/scrapping'),
	{ movies } = require('./mock');

const PORT = 3000;

app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/stylesheets', express.static(__dirname + '/stylesheets'));
app.use('/images', express.static(__dirname + '/images'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
	res.render('index', { movies });
});

//generateScraping
app.get('/search', async (req, res) => {
	try {
		const urlMovie = await movieTrailer(req.query.nameMovie);
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
		const videoId = urlMovie.match(regExp);
		console.log(`sucsses youtube api for ${req.query.nameMovie}`);
		const dataScrapping = await scrapping(req.query.nameMovie.replace(/\s/g, ''));
		res.render('infoMovie', { urlMovie: videoId[2], Details: dataScrapping });
	} catch (error) {
		res.render('error');
	}
});

app.get('/error', function (req, res, next) {
	res.render('error');
});

app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
