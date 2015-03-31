'use strict';

module.exports = {
	host: '0.0.0.0',
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'Bc',
	sessionCollection: 'sessions',
	db: 'mongodb://admin:betoreyes@ds045011.mongolab.com:45011/heroku_app34087509',
	assets: {
		lib: {
			css: [
			],
			js: [
				 'public/lib/jquery/dist/jquery.min.js',
				 'public/lib/datatables/media/js/jquery.dataTables.min.js',
				 'public/lib/ng-file-upload/angular-file-upload-shim.min.js', 
				 'public/lib/angular/angular.js',
				 'public/lib/angular-filter/dist/angular-filter.min.js',
				 'public/lib/angular-momentjs/angular-momentjs.js',
				 'public/lib/angular-ui-calendar/src/calendar.js',
				 'public/lib/fullcalendar/moment.js',
				 'public/lib/fullcalendar/fullcalendar.js',
				 'public/lib/fullcalendar/gcal.js',
				 'public/lib/ng-file-upload/angular-file-upload.min.js',
				 'public/lib/angular-datatables/dist/angular-datatables.js',
				 'public/lib/angular-smart-table/dist/smart-table.min.js',
				 'public/lib/select2/select2.js',
				 'public/lib/angular-ui-select2/src/select2.js',
				 'public/lib/angular-resource/angular-resource.js', 
				 'public/lib/angular-cookies/angular-cookies.js', 
				 'public/lib/angular-animate/angular-animate.js', 
				 'public/lib/angular-touch/angular-touch.js', 
				 'public/lib/angular-sanitize/angular-sanitize.js', 
				 'public/lib/angular-ui-router/release/angular-ui-router.js',
				 'public/lib/angular-ui-utils/ui-utils.js',
				 'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				 'public/lib/angular-socket-io/socket.js',
				 'public/lib/socket.io-client/socket.js',
				 'public/lib/x2js/xml2json.js',
				 'public/lib/angular-x2js/src/x2js.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'jreyes1684@gmail.com',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'jreyes1684@gmail.com',
				pass: process.env.MAILER_PASSWORD || 'Bet@reyes16'
			}
		}
	}
};