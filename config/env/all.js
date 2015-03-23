'use strict';

module.exports = {
	app: {
		title: 'project_lk',
		description: 'An app for everyone',
		keywords: 'Ad, Ads, Comerciales, Anuncios, Empresas'
	},
	host: '0.0.0.0',
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN-LK',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				//'public/css/bootstrap.min.css',
				//'public/css/plugins.css',
				//'public/css/main.css',
				//'public/css/themes.css',
				//'public/lib/bootstrap/dist/css/bootstrap-theme.css',
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
				 //'public/lib/app.js'
				
				/*'public/lib/vendor/modernizr-2.7.1-respond-1.4.2.min.js',
				'public/lib/vendor/bootstrap.min.js',
				'public/lib/plugins.js"',
				'public/lib/app.js',*/
				/*'http://maps.google.com/maps/api/js?sensor=true',
				'public/lib/helpers/gmaps.min.js' 
				'public/lib/js/pages/index.js'*/
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
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};