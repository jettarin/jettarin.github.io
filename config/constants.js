var APP = {

	//***** Common *****//
	CONTEXT_PATH : '/SKTALG',
	ENV : 'DEV',
	DEFAULT_PAGING : {
		sortBy : [],
		totalItems : 0,
		limit : 6,
		pageNumber : 1,
		showing : {
			start : 0,
			end : 0,
			total : 0
		}
	},
	DATE_FORMAT : 'YYYY-MM-DD',
	//***** Traveling Expense *****//
	TRAVEL_OVERSEA : 'O',
	TRAVEL_DOMESTIC : 'D',
	TRAVEL_DOMESTIC_INBOUND : 'I',
	TRAVEL_DOMESTIC_OUTBOUND : 'O',



	DUMMY : 'DUMMY'

};


// APP.API_URL = 'http://203.157.82.38:3009'
APP.API_URL = 'http://203.157.82.34:3000/skthm/api/mobile/'

APP.UPLOAD_URL = APP.CONTEXT_PATH + '/upload';
