'use strict';

// Calendars controller
angular.module('calendars').controller('CalendarsController', ['$scope' , '$compile' , '$stateParams', '$location', '$element', '$http', '$filter', '$timeout' ,'$interval' , 'Authentication', 'Calendars', 'Circulos', 'Historials' ,'uiCalendarConfig',
	function($scope, $compile , $stateParams, $location, $element, $http, $filter, $timeout, $interval, Authentication, Calendars, Circulos, Historials , uiCalendarConfig ) {
		$scope.authentication = Authentication;
		$scope.dateTimeTemp = undefined;
		$scope.newEvent = [];
		$scope.dateStartSelectedTemp = undefined;
		$scope.dateEndSelectedTemp = undefined;
		$scope.advance = false;
		$scope.eventHasBeenDeleted = false;
		$scope.isNewEvent = true;
		$scope.guests = [];
		$scope.allEvents = [];
		$scope.canEdit = true;
		$scope.TheArrayProcess = [];

		//Repeat options
		$scope.repeatDays = false;
		$scope.repeatWeeks = false;
		$scope.repeatMonths = false;
		$scope.repeatYears = false;
		
		/* event source that contains custom events on the scope */
	    $scope.events = [];
		var date = new Date();
	    var d = date.getDate();
	    var m = date.getMonth();
	    var y = date.getFullYear();

	    $scope.optionRepeat = [
		    {value: 'cada_dia', text:'Cada día'},
		    {value: 'laborales', text:'Todos los días laborales (de lunes a viernes)'},
		    {value: '3_dias', text:'Todos los lunes, miércoles y viernes'},
		    {value: '2_dias', text:'Todos los martes y jueves'},
		    {value: 'cada_semana', text:'Cada semana'},
		    {value: 'cada_mes', text:'Cada mes'},
		    {value: 'cada_ano', text:'Cada año'}
	    ];

	    //Socket update calendar when a new event has been added
	 //    Socket.on('notify.totalNotifying', function(array){
		// 	if(array.total === -1){
		// 		$scope.total+=array.total;
		// 	}else{
		// 		$scope.total = array.total;	
		// 	}			
		// });

	    
	    //$scope.changeTo = 'Hungarian';
	    /* event source that pulls from google.com */
	    $scope.eventSource = {
	            //url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
	            className: 'gcal-event',           // an option!
	            currentTimezone: 'America/Chicago' // an option!
	    };

	    /* event source that calls a function on every view switch */
	    $scope.eventsF = function (start, end, timezone, callback) {
	      var s = new Date(start).getTime() / 1000;
	      var e = new Date(end).getTime() / 1000;
	      var m = new Date(start).getMonth();
	      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
	      callback(events);
	    };

	    //function that look for the event and compare with the user authentication
	    $scope.checkIfIHavePermissionsToModifyEvent = function(event){
	    	var ok = false;
	    	angular.forEach( $scope.allEvents, function(val){
	    		if(!ok){
	    			var idevent = val.idevent ? val.idevent : val._id;
		    		if(idevent === event.id){
		    			if($scope.authentication.user._id+'' === val.user){
		    				ok = true;
		    			}
		    		}
	    		}
	    	});
	    	return ok;
	    };

	    /* On event clicked */
	    $scope.alertOnEventClick = function( event, jsEvent, view){	
			$scope.canEdit = $scope.checkIfIHavePermissionsToModifyEvent(event);
	    	$scope.isNewEvent = false;
	    	$scope.eventHasBeenDeleted = false;
	    	$scope.newEvent = [];
	    	$scope.newEvent = $scope.selectEvent(event);
	    	$scope.updateCircles($scope.newEvent);
	    	$scope.dateStartSelectedTemp = $scope.newEvent.start;
	    	$scope.dateEndSelectedTemp = $scope.newEvent.end;	    		
	    	$scope.guestSelected = [];
	    	if($scope.newEvent.repeat){
	    		$scope.selectOptionRepeat = $scope.newEvent.repeat.repeat_on;	
	    		$scope.onSelectOptionRepeatChange();
	    	}	    	
	    	angular.forEach($scope.newEvent.guests, function(guest){
				$scope.guestSelected.push(guest.idguest);
			});    	
	    	$scope.advance = false;
	    	
	    	if(!$scope.newEvent.repeat)
	    		$scope.newEvent.repeat = {};
	    	$scope.newEvent.repeat.resumeStart = $filter('date')($scope.newEvent.start,'fullDate');
	    	$scope.newEvent.repeat.resumeDay = '';
	    	$scope.newEvent.repeat.resumeWhile = '';
	    	$element.find('#modal-calendar-addEvent').modal('show');
	    };

	    //Update event when I drop or resize the event
	    $scope.updateFromDropResize = function(event){
	    	var evento;
			angular.forEach($scope.events, function( events , index ){
				if( events.id === event.id ){
					evento = event;
					if(event.end === null){
						evento.end = new Date($scope.convertStringToDate(event.start.format('YYYY-MM-DD hh:30:ss')));	
					}else{
						if(evento.allDay)
							evento.end = new Date($scope.convertStringToDate(event.end.format('YYYY-MM-DD hh:30:ss')));
						else
							evento.end = new Date($scope.convertStringToDate(event.end.format('YYYY-MM-DD hh:00:ss')));
					}
					evento.start = new Date($scope.convertStringToDate(event.start.format('YYYY-MM-DD hh:mm:ss')));
				}
			});
			angular.forEach($scope.allEvents, function(theEvent,key){
				if(evento.id === theEvent._id){
					theEvent.start = evento.start;
					theEvent.allDay = evento.allDay;
					theEvent.end = evento.end;
					var startHours = evento.start.getHours();
					var startMinutes = evento.start.getMinutes();
					var endHours = evento.end.getHours();
					var endMinutes = evento.end.getMinutes();
					if(Number(startHours) < 10 )
						startHours = '0' + startHours;
					if(Number(startMinutes)<10)
						startMinutes = '0' + startMinutes;
					if(Number(endHours)<10)
						endHours = '0' + endHours;
					if(Number(endMinutes) < 10)
						endMinutes = '0' + endMinutes;
					theEvent.starttime = startHours +':' +startMinutes;
					theEvent.endtime = endHours +':' +endMinutes;
					
					$scope.newEvent = theEvent;
				}
			});
			$scope.update(function(){
				$scope.AlertNotificationCenterForGuests('¿Enviar invitaciones?','¿Has actualizado la información deseas notificar a los invitados, de estos cambios?','onClickNo()-onClickDeleteYes()','[No Enviar][Enviar]',1);
			});	
	    };

	    // On Resize or Drop Event
	    $scope.onResizeOrDropEvent = function(event, delta, revertFunc, jsEvent, ui, view){
	    	if($scope.checkIfIHavePermissionsToModifyEvent(event)){
				$scope.updateFromDropResize(event);	
			}else{
				revertFunc();	
			}
	    };

	    /* add and removes an event source of choice */
	    $scope.addRemoveEventSource = function(sources,source) {
	      var canAdd = 0;
	      angular.forEach(sources,function(value, key){
	        if(sources[key] === source){
	          sources.splice(key,1);
	          canAdd = 1;
	        }
	      });
	      if(canAdd === 0){
	        sources.push(source);
	      }
	    };
	    
	    /* remove event */
	    $scope.removeEvent = function(index) {
	      $scope.events.splice(index,1);
	    };

	    /* Change View */
	    $scope.changeView = function(view,calendar) {
	    	uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
	    };

	    /* Change View */
	    $scope.renderCalender = function(calendar) {
		    if(uiCalendarConfig.calendars[calendar]){
		    	uiCalendarConfig.calendars[calendar].fullCalendar('render');
		    }
	    };

	     /* Render Tooltip */
	    $scope.eventRender = function( event, element, view ) { 
	        $compile(element)($scope);
	    };

	    //On Day click calendar
	    $scope.alertOnDayClick = function(date, jsEvent, view){
	    	$scope.canEdit = true;
	    	$scope.newEvent = [];  
	    	$scope.updateCircles();
	    	if($scope.newEvent.repeat){
	    		$scope.newEvent.repeat.end.never = true;
		    	$scope.afterRepeat = false;
		    	$scope.newEvent.repeat.end.every = undefined;
		    	$scope.finishWhen = false;
		    	$scope.newEvent.repeat.end.when = undefined;	
	    	}
	    	$scope.newEvent.ispublic = false;
	    	$scope.eventHasBeenDeleted = false;
	    	$scope.myCalendar.fullCalendar('unselect');
	    	$scope.isNewEvent = true;
	    	$scope.dateSelectedTemp = $scope.convertStringToDate(date.format('YYYY-MM-DD hh:mm:ss')); 
	    	 	
	    	$scope.newEvent.allDay = false;
	    	$scope.newEvent.title = '';
	    	$scope.advance = false;
	    	$scope.newEvent.notifications = [];
	    	$scope.newEvent.color = '#1bbae1';
    		$scope.newEvent.allDay = true;
    		$scope.newEvent.end = $scope.convertStringToDate(date.format('YYYY-MM-DD hh:30:ss'));
    		$scope.dateEndSelectedTemp = $scope.convertStringToDate(date.format('YYYY-MM-DD hh:30:ss'));

	    	$scope.newEvent.start = $scope.convertStringToDate(date.format('YYYY-MM-DD hh:mm:ss'));
	    	if( !$scope.newEvent.repeat )
	    		$scope.newEvent.repeat = {};
	    	$scope.newEvent.repeat.resumeStart = $filter('date')($scope.newEvent.start,'fullDate');
	    	$scope.dateStartSelectedTemp = $scope.convertStringToDate(date.format('YYYY-MM-DD hh:mm:ss'));

	        $element.find('#modal-calendar-addEvent').modal('show');
	    };

	    //On New event 
	    $scope.onNewEvent = function(){	    	
	    	if($scope.newEvent.title!=='' || $scope.newEvent.title !== undefined){
	    		if($scope.isNewEvent){
	    			$scope.addEvent();
	    		}else{

	    			$scope.updateEvent();
	    		}
	    	}
	    };

	    //On edite advance configuration event
	    $scope.onEditEventAdavnce = function(){
	    	$scope.advance = true;
	    	var dstart = new Date($scope.dateStartSelectedTemp);
	    	var dend = new Date($scope.dateEndSelectedTemp);
	    	var ddstart = dstart.getDate();
	    	var ddend = dend.getDate();
	    	var mthstart = Number(dstart.getMonth()) + 1;
	    	var mthend = Number(dend.getMonth()) + 1;
	    	if(Number(ddstart)<10) { //days
			    ddstart='0'+ddstart;
			}
			if(Number(ddend)<10) { //days
			    ddend='0'+ddend;
			}
			
			if(Number(mthstart)<10) { //months
			    mthstart = '0' + mthstart;
			}
			if(Number(mthend)<10) { //months
			    mthend='0'+mthend;
			}						

	    	$scope.newEvent.start = dstart.getFullYear() + '-'+ mthstart + '-' + ddstart;
	    	$scope.newEvent.end = dend.getFullYear() + '-' + mthend + '-' + ddend;

	    	var mstart = dstart.getMinutes();
	    	var mend = dend.getMinutes();
	    	if(Number(mstart)<10) { //days
			    mstart='0'+mstart;
			}
			if(Number(mend)<10) { //days
			    mend='0'+mend;
			}
		    $scope.newEvent.starttime = dstart.getHours() + ':' + mstart;
		    $scope.newEvent.endtime = dend.getHours() + ':' + mend;
		    
		    var finded= false;
		    
		    angular.forEach( $scope.guestSelected , function( guest ){
		    	if(guest === $scope.authentication.user._id)
		    		finded = true;
		    });

		    if(!finded){
		    	$scope.guestSelected.push($scope.authentication.user._id);	
		    }
	    };

	    //Cancel advance configuration event
	    $scope.cancelAdvanceEvent = function(){
	    	$scope.guestSelected = [];
	    	$scope.advance = false;
	    	$scope.newEvent.allDay = true;
	    	$scope.newEvent.notifications=[];
	    	$scope.newEvent.start = $scope.dateStartSelectedTemp;
	    	$scope.newEvent.end = $scope.dateEndSelectedTemp;
	    	$scope.newEvent.color = '#1bbae1';
	    };

	    // On change color event
	    $scope.onChangeColorEvent = function(color){
	    	$scope.newEvent.color= color;
	    };

	    //add new notification to the event array
	    $scope.addNewNotificationToEvent = function(){
	    	$scope.newEvent.notifications.push({time : 30,type_not:'Correo', every:'minutos'});
	    };

	    //When a press Yes on the confirmation center
	    $scope.onClickAddYes = function(){
	    	var resume = $scope.newEvent.repeat.resume;

	    	var subject = 'Invitación: \"' + $scope.newEvent.title + '\" ' + resume;
	    	var html = 
					'<div id="content" style="border: 1px solid #ccc;font-family: Sans-Serif;">' +
						'<table>' +
							'<tr>' +
								'<td colspan="2"><h3>"' + $scope.newEvent.title + '"</h3></td>' +
							'</tr>' +
							'<tr>' +
								'<td class="etiqueta" style="color: #aaa;font-family: "MS Sans Serif", Geneva, sans-serif;font-size: 12pt;">Cuando</td>' +
								'<td class="texto">' + $scope.newEvent.repeat.resumeStart+' '+$scope.newEvent.repeat.resumeDay +' '+$scope.newEvent.repeat.resumeWhile + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td class="etiqueta" style="color: #aaa;font-family: "MS Sans Serif", Geneva, sans-serif;font-size: 12pt;">Calendario</td>' +
								'<td class="texto" style="font-family: Verdana; font-size: 9pt;">'+ $scope.authentication.user.displayName +'</td>' +
							'</tr>' +
							'<tr>' +
								'<td class="etiqueta" valign="top" style="color: #aaa;font-family: "MS Sans Serif", Geneva, sans-serif;font-size: 12pt;">Invitados</td>' +
								'<td valign="top">' +
									'<ul class="list" style="list-style: circle;font-size: 8pt;"> ';
										angular.forEach($scope.newEvent.guests,function(value){
											html +='<li>';
											if(value.name === $scope.authentication.user.displayName){
													html += value.name + '<span style="color: #aaa;"> (organizador)</span>';
											}else{
												html += value.name;
											}
											html += '</li>';
										});
									html += '</ul>' +
								'</td>' +
							'</tr>' +
						'</table>' +
					'</div>' ;
	    	$scope.sendEmail(subject, html);
	    };

	    $scope.onClickUpdateYes = function(){
	    	var resume = $scope.newEvent.repeat.resume;
	    	
	    	var subject = 'Invitación actualizada: \"' + $scope.newEvent.title + '\" '+resume;
	    	var html = 
					'<div id="content" style="border: 1px solid #ccc;font-family: Sans-Serif;">' +
						'<table>' +
							'<tr>' +
								'<td colspan="2" style="background-color:#d9f2db;"><h4>Se ha cambiado este evento</h4></td>' +
							'</tr>' + 
							'<tr>' +
								'<td colspan="2"><h3>"' + $scope.newEvent.title + '"</h3></td>' +
							'</tr>' +
							'<tr>' +
								'<td class="etiqueta" style="color: #aaa;font-family: "MS Sans Serif", Geneva, sans-serif;font-size: 12pt;">Cuando</td>' +
								'<td class="texto">' + $scope.newEvent.repeat.resumeStart+' '+$scope.newEvent.repeat.resumeDay +' '+$scope.newEvent.repeat.resumeWhile + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td class="etiqueta" style="color: #aaa;font-family: "MS Sans Serif", Geneva, sans-serif;font-size: 12pt;">Calendario</td>' +
								'<td class="texto" style="font-family: Verdana; font-size: 9pt;">'+ $scope.authentication.user.displayName +'</td>' +
							'</tr>' +
							'<tr>' +
								'<td class="etiqueta" valign="top" style="color: #aaa;font-family: "MS Sans Serif", Geneva, sans-serif;font-size: 12pt;">Invitados</td>' +
								'<td valign="top">' +
									'<ul class="list" style="list-style: circle;font-size: 8pt;"> ';
										angular.forEach($scope.newEvent.guests,function(value){
											html +='<li>';
											if(value.name === $scope.authentication.user.displayName){
													html += value.name + '<span style="color: #aaa;"> (organizador)</span>';
											}else{
												html += value.name;
											}
											html += '</li>';
										});
									html += '</ul>' +
								'</td>' +
							'</tr>' +
						'</table>' +
					'</div>' ;
	    	$scope.sendEmail(subject, html);
	    };

	    $scope.onClickDeleteYes = function(){
	    	var resume = $scope.newEvent.repeat.resume;
	    	
	    	var subject = 'Evento cancelado: \"' + $scope.newEvent.title + '\" ' + resume;
	    	var html = 
					'<div id="content" style="border: 1px solid #ccc;font-family: Sans-Serif;">' +
						'<table>' +
							'<tr>' +
								'<td colspan="2" style="background-color:#fcc;"><h4>Este evento se ha cancelado y suprimido del calendario</h4></td>' +
							'</tr>' + 
							'<tr>' +
								'<td colspan="2"><h3>"' + $scope.newEvent.title + '"</h3></td>' +
							'</tr>' +
							'<tr>' +
								'<td class="etiqueta" style="color: #aaa;font-family: "MS Sans Serif", Geneva, sans-serif;font-size: 12pt;">Cuando</td>' +
								'<td class="texto">' + $scope.newEvent.repeat.resumeStart+' '+$scope.newEvent.repeat.resumeDay +' '+$scope.newEvent.repeat.resumeWhile + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td class="etiqueta" style="color: #aaa;font-family: "MS Sans Serif", Geneva, sans-serif;font-size: 12pt;">Calendario</td>' +
								'<td class="texto" style="font-family: Verdana; font-size: 9pt;">'+ $scope.authentication.user.displayName +'</td>' +
							'</tr>' +
							'<tr>' +
								'<td class="etiqueta" valign="top" style="color: #aaa;font-family: "MS Sans Serif", Geneva, sans-serif;font-size: 12pt;">Invitados</td>' +
								'<td valign="top">' +
									'<ul class="list" style="list-style: circle;font-size: 8pt;"> ';
										angular.forEach($scope.newEvent.guests,function(value){
											html +='<li>';
											if(value.name === $scope.authentication.user.displayName){
													html += value.name + '<span style="color: #aaa;"> (organizador)</span>';
											}else{
												html += value.name;
											}
											html += '</li>';
										});
									html += '</ul>' +
								'</td>' +
							'</tr>' +
						'</table>' +
					'</div>' ;
	    	$scope.sendEmail(subject,html);
	    };

	    $scope.sendEmail = function( subject , html){
	    	var params=[];
	    	params.push({ guests : $scope.newEvent.guests, subject : subject, html : html });

	    	$http.post('/calendars/sendEmailToUsers', params ).success(function( response ){
	    	}).error(function(errorResponse){
	    	});
	    };

	    $scope.onClickNo = function(){
	    	$element.find('#modal-calendar-addEvent').modal('hide');
	    };

	    //update the guests field
	    $scope.updateGuestsEvent = function(){
	    	if( $scope.guestSelected.length > 0 ){
	    		$scope.newEvent.guests = [];
	    		angular.forEach( $scope.guests , function( guest ){
	    			angular.forEach( $scope.guestSelected , function( selectable ){
	    				if( guest.idguest === selectable ){
	    					$scope.newEvent.guests.push( guest );
	    				}
	    			});
	    		});
	    	}
	    };

	    //Add new event
	    $scope.addEvent = function(){
	    	$scope.newEvent.guests = [];
	    	$scope.updaDateEvent();
	    	$scope.updateGuestsEvent();
	    	
	    	$scope.create(function(){
	    		if($scope.newEvent.isrepeat){
	    			$scope.AlertNotificationCenterForGuests('¿Enviar invitaciones?','¿Quieres enviar invitación a los invitados?','onClickNo()-onClickAddYes()','[No enviar][Enviar]',1);

	    			$scope.startProcessesRepeat();
	    		}else{
	    			$scope.AlertNotificationCenterForGuests('¿Enviar invitaciones?','¿Quieres enviar invitación a los invitados?','onClickNo()-onClickAddYes()','[No enviar][Enviar]',1);
	    		}
	    	},$scope.newEvent.isrepeat);
		    $element.find('#modal-calendar-addEvent').modal('hide');
	    };

	    //Update my event selected
	    $scope.updateEvent = function(){
    		 $scope.updateGuestsEvent();
	    	 $scope.updaDateEvent();
	    	 $scope.update(
	    	 	function(){
	    	 		if($scope.checkHowManyEventsItHas()){
	    	 			$scope.startProcessesRepeat();	
	    	 		}	    	 		
	    	 		$scope.AlertNotificationCenterForGuests('¿Enviar invitaciones?','¿Has actualizado la información deseas notificar a los invitados, de estos cambios?', 'onClickNo()-onClickUpdateYes()' ,'[No enviar][Enviar]',1);
	    	 	}
	    	 );
	    	$element.find('#modal-calendar-addEvent').modal('hide');
	    };

	    //On Delete event depending
	    $scope.justThisEvent = function(){
	    	var param = { _id : $scope.newEvent._id };
	    	$scope.executeDeleteSerieEvent(param);
	    };

	    $scope.EveryEvent = function(){
	    	var idevent = $scope.newEvent.idevent ? $scope.newEvent.idevent : $scope.newEvent._id;
			var param = [ { idevent : idevent } , { _id : idevent } ];
			$scope.executeDeleteSerieEvent(param);
	    };

	    $scope.EverySerie = function(callback){
	    	var idevent = $scope.newEvent.idevent ? $scope.newEvent.idevent : $scope.newEvent._id;
	    	var param = { idevent : idevent };
	    	$scope.executeDeleteSerieEvent(param, callback);
	    };

	    $scope.executeDeleteSerieEvent = function(param, callback){
	    	$http.post('/calendars/delete',param).success(function(response){
	    		if(callback){
	    			callback();
	    		}else{
	    			$scope.myCalendar.fullCalendar('render');
	    			$scope.msgSmartNotification('Evento eliminado','Su evento fue eliminado correctamente','fa fa-check','#739E73');
	    			$scope.AlertNotificationCenterForGuests('¿Notificar a invitados?','¿Has eliminado el evento, deseas notifcar a los invitados de este evento?','onClickNo()-onClickDeleteYes()','[No enviar][Enviar]',1);
	    			$element.find('#modal-calendar-addEvent').modal('hide');	
	    		}
    		}).error(function(errorResponse){
    			$scope.msgSmartNotification('Error' , errorResponse.data.message , 'fa fa-frown-o' , '#C46A69' );
    		});
	    };

	    $scope.onDeleteEvent = function(){
	    	if($scope.checkHowManyEventsItHas()){
	    		$scope.AlertNotificationCenterForGuests('Eliminar evento periódico','¿Deseas eliminar únicamente este evento, todos los eventos de esta serie o bien este y/o todos los eventos futuros de esta serie?','justThisEvent()-EveryEvent()-EverySerie()','[Solo este evento][Todos y este evento][Todos los eventos de la serie]',2);
	    	}else{
	    		$scope.justThisEvent();
	    	}
	    };

	    //Function that help to know if there are more than one event related.
	    $scope.checkHowManyEventsItHas = function(){
	    	return $scope.newEvent.isrepeat;
	    };

	    //Update date event
	    $scope.updaDateEvent = function(){
	    	if($scope.newEvent.starttime === undefined){
	    		$scope.newEvent.starttime='00:00';
	    	}
	    	if($scope.newEvent.endtime === undefined){
	    		$scope.newEvent.endtime='00:00';
	    	}
	    	if($scope.newEvent.start.length === 10 ){
	    		var sdatestart = $scope.newEvent.start + ' ' + $scope.newEvent.starttime+':00';
	    		var sdateend = $scope.newEvent.end + ' ' + $scope.newEvent.endtime+':00';
	    		var dstart = new Date($scope.convertStringToDate(sdatestart));
	    		var dend = new Date($scope.convertStringToDate(sdateend));
	    		$scope.newEvent.start = dstart;
	    		$scope.newEvent.end = dend;	
	    	}
	    };

	    //With this function I convert the String date to Date Object
	    $scope.convertStringToDate = function(sDate){
	    	var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
	    	var dateArray;
				dateArray = reggie.exec(sDate); 
	    	var dateObject = new Date(
			    (+dateArray[1]),
			    (+dateArray[2])-1, // Careful, month starts at 0!
			    (+dateArray[3]),
			    (+dateArray[4]),
			    (+dateArray[5]),
			    (+dateArray[6])
			);
			return dateObject;
	    };

	    /* config object */
	    $scope.uiConfig = {
	      calendar:{
	        editable: true,
	        selectable: true,
	        selectHelper:true,
	        eventLimit: true,
	        eventDurationEditable: true,
	        ignoreTimezone : false,
	        header:{
	          left: 'prev,next today',
	          center: 'title',
	          right: 'month,agendaWeek,agendaDay'
	        },
	       	dayClick: $scope.alertOnDayClick,
	       	viewRender: function(view, element){
	       		if( $scope.events.length > 0 ){
	       			switch(view.name){
	       				case 'agendaWeek': break;
	       				case 'agendaDay': break;
	       				case 'month': $scope.events.splice(0); 
	       				$scope.myCalendar.fullCalendar('removeEvents');
	       				$scope.allEvents.splice(0);
	       				$scope.loadEvents(view, element); break;
	       				default: 
	       				
	       				break;
	       			}
	       		}else{
	       			$scope.loadEvents(view, element);
	       		}
	       		
	       	},
	        eventClick: $scope.alertOnEventClick,
	        eventDrop: $scope.onResizeOrDropEvent,
	        eventResize: $scope.onResizeOrDropEvent,
	        eventRender: $scope.eventRender
	      }
	    };

	    //Function that i load every time i change the view and i pushed to the array events
	    $scope.loadEvents = function(view, element){
	    	$scope.events.splice(0);
       		$scope.allEvents.splice(0);

       		var start = new Date(view.start);

       		var end = new Date($scope.convertStringToDate(view.end.format('YYYY-MM-DD 23:59:00')));
       		var param=[{start : start, end: end }];

       		$http.post('/calendars/list',param).success(function(response){
       			angular.forEach(response,function(event){
					$scope.allEvents.push(event);
					if(event.idevent){
						$scope.events.push({ id: event.idevent, title: event.title, start: new Date(event.start), end: new Date(event.end), allDay : event.allDay,color:event.color });
					}else{
						$scope.events.push({ id: event._id, title: event.title, start: new Date(event.start), end: new Date(event.end), allDay : event.allDay,color:event.color });	
					}
				});
       		}).error(function(errorResponse){

       		});
	    };

	    // Update existing Calendar
		$scope.selectEvent = function(theEvent){
			var eventFound;
			angular.forEach($scope.allEvents, function(event){
				var startEvent ,
					startTheEvent ,
					endEvent,
					endTheEvent;
				if(event.start.length<=10){
					startEvent= new Date($scope.convertStringToDate(event.start +' ' + event.starttime+':00'))+'';
					endEvent = new Date($scope.convertStringToDate(event.end +' '+ event.endtime+':00'))+'';
				}
				else{
					startEvent = new Date(event.start)+'';
					endEvent = new Date(event.end)+'';
				} 

				startTheEvent = new Date(theEvent.start._i)+'';
				endTheEvent = new Date(theEvent.end._i)+'';
				if(event.idevent){
					if(event.idevent === theEvent.id && startEvent === startTheEvent && endEvent === endTheEvent){
						eventFound = event;
					}
				}else{
					if(event._id === theEvent.id && startEvent === startTheEvent && endEvent === endTheEvent){
						eventFound = event;
					}	
				}
			});
			return eventFound;
		};

	    /* event sources array*/
	    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];

		// Create new Calendar
		$scope.create = function(callback, isrepeat, issecond) {
			// Create new Calendar object
			$scope.newEvent.user = $scope.authentication.user._id;
			if(!$scope.newEvent.repeat){
				$scope.newEvent.repeat = {};	
			}
			$scope.newEvent.repeat.resume = $filter('date')($scope.newEvent.start,'fullDate');
			if ($scope.newEvent.repeat.resumeStart)
				$scope.newEvent.repeat.resume =$scope.newEvent.repeat.resumeStart;
			if($scope.newEvent.repeat.resumeDay)
	    		$scope.newEvent.repeat.resume+= ' '+$scope.newEvent.repeat.resumeDay;

	    	if($scope.newEvent.repeat.resumeWhile)
	    		$scope.newEvent.repeat.resume+= ' '+$scope.newEvent.repeat.resumeWhile;
			
			var newevent = new Calendars ($scope.newEvent);
			// Redirect after save
			newevent.$save(function(response) {
				$scope.createHistorial(response, 'Evento agregado', 'gi gi-calendar', 'calendario');
				if(isrepeat === undefined || !isrepeat){
					$scope.allEvents.push(response);
					$scope.events.push({ id : response._id, title: response.title, start: new Date(response.start), end: new Date(response.end), allDay : response.allDay,color:response.color });
					$scope.msgSmartNotification('Evento' , 'Se agregó correctamente', 'fa fa-check' , '#739E73' );
				
					if(callback){
						callback();
					}	
				}else{
					if( !issecond || issecond === undefined){
						$scope.newEvent._id = response._id;
						$scope.allEvents.push(response);
						$scope.events.push({ id : response._id, title: response.title, start: new Date(response.start), end: new Date(response.end), allDay : response.allDay,color:response.color });				
					}

					if(callback){
						callback();
					}
				}
				// Clear form fields
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , errorResponse.data.message , 'fa fa-frown-o' , '#C46A69' );
			});
		};

		//Function that update and delete de element in database
		$scope.update = function(callback) {
			if($scope.newEvent.isrepeat)
				$scope.newEvent.idevent = $scope.newEvent._id;
			$scope.newEvent.user = $scope.authentication.user._id;

			var calendar = new Calendars($scope.newEvent);
			$scope.newEvent.repeat.resume = $scope.newEvent.repeat.resumeStart+' '+$scope.newEvent.repeat.resumeDay +' '+$scope.newEvent.repeat.resumeWhile;
			delete $scope.newEvent.repeat.resumeStart;
			delete $scope.newEvent.repeat.resumeDay;
			delete $scope.newEvent.repeat.resumeWhile;
			if($scope.newEvent.repeat.end){
				if($scope.newEvent.repeat.end.every)
					{
						delete $scope.newEvent.repeat.end.every;
					}
			}
				
			calendar.$update(function(response) {
				$scope.createHistorial(response, 'Evento actualizado', 'gi gi-calendar', 'calendario');
				angular.forEach($scope.events, function( event , index ){
					if(event.id === response._id){
						$scope.removeEvent(index);
						$scope.myCalendar.fullCalendar('removeEvents',event.id);
					}
				});
				$scope.events.push({ id : response._id, title: response.title, start: new Date(response.start), end: new Date(response.end), allDay : response.allDay,color:response.color });
				if(callback){
					callback();
				}
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , errorResponse.data.message , 'fa fa-frown-o' , '#C46A69' );
			});
		};

		// Find a list of Calendars
		$scope.find = function() {
			Calendars.query(function(response){
				angular.forEach(response,function(event){
					$scope.allEvents.push(event);
					$scope.events.push({ id: event._id, title: event.title, start: new Date(event.start), end: new Date(event.end), allDay : event.allDay,color:event.color });
				});
			});	
		};
		//Get all the contacts and users to send and invitation to the event
		$scope.listInvitations = function(){
			$http.post('/calendars/listInvitations').success(function(response){
				$scope.guests = response;
			}).error(function(errorResponse){
				$scope.msgSmartNotification('Error' , errorResponse.data.message , 'fa fa-frown-o' , '#C46A69' );
			});
		};	

		$scope.msgSmartNotification = function( title,  content, icon, color){
			$scope.msgTitle = title;
			$scope.msgContent = content;
			$scope.msgIcon = icon;
			$scope.msgColor = color;

			$scope.isOk = true;	
			$timeout(function () {
            	$scope.isOk = undefined;
        	},1000);
		};

		$scope.AlertNotificationCenterForGuests = function(title, content,methods,buttons,type){
			$scope.alertContent = content;
			$scope.alertTitle = title;
			$scope.alertButtons = buttons;
			$scope.alertMethods = methods;

			switch(type){
				case 1: 
				if($scope.guestSelected.length>0)
		    	{
		    		$scope.hasGuests = true;
					$timeout(function () {
		            	$scope.hasGuests = undefined;
		        	},100);
		    	}
				break;
				case 2: 
					if($scope.checkHowManyEventsItHas()){
			    		$scope.hasGuests = true;
			    		$timeout(function () {
			            	$scope.hasGuests = undefined;
			        	},100);
			    	}
				break;
			}
		};

		$scope.onChangeRepeat = function(){
			if(!$scope.newEvent.repeat)
				$scope.newEvent.repeat = {};
			if($scope.newEvent.isrepeat){
				$scope.newEvent.repeat.repeat_on = 'cada_dia';
				$scope.selectOptionRepeat = 'cada_dia';
				$scope.resume = 'Cada día';
				if(!$scope.newEvent.repeat.end)
					$scope.newEvent.repeat.end = {};
				$scope.newEvent.repeat.end.never = true;
				if(!$scope.newEvent.repeat.end.every)
					$scope.newEvent.repeat.end.every = 1;
				$scope.repeatDays = true;
				$scope.functionResumeChange();
			}else{
				$scope.newEvent.repeat={};
			}
		};
		
		$scope.onSelectOptionRepeatChange = function(){
			$scope.newEvent.repeat.repeat_on = $scope.selectOptionRepeat;
			switch($scope.selectOptionRepeat){
				case 'cada_dia' : $scope.cleanVariable(); $scope.repeatDays=true; $scope.functionResumeChange();  break;
				case 'cada_semana' : $scope.cleanVariable(); $scope.repeatWeeks = true;$scope.functionResumeChange(); $scope.getToDay(); break;
			    case 'cada_mes' : $scope.cleanVariable(); $scope.repeatMonths = true; $scope.newEvent.repeat.repeatDayOfMonth = true; $scope.functionResumeChange();break;
			    case 'cada_ano' : $scope.cleanVariable(); $scope.repeatYears = true; $scope.functionResumeChange(); break;
	    		case 'laborales' : $scope.cleanVariable(); $scope.repeatWorkDays = true; $scope.newEvent.repeat.resumeStart = 'Cada semana días de la semana ';
	    		$scope.newEvent.repeat.lunes = true; $scope.newEvent.repeat.martes = true; $scope.newEvent.repeat.miercoles = true;
			$scope.newEvent.repeat.jueves = true; $scope.newEvent.repeat.viernes = true; break;
		    	case '3_dias' : $scope.cleanVariable(); $scope.repeatEvery3days = true;  $scope.newEvent.repeat.resumeStart = 'Cada semana lunes, miércoles, viernes ';
		    		$scope.newEvent.repeat.lunes = true; $scope.newEvent.repeat.miercoles = true; $scope.newEvent.repeat.viernes = true; break;
			    case '2_dias' : $scope.cleanVariable(); $scope.repeatEvery2days = true; $scope.newEvent.repeat.martes = true; $scope.newEvent.repeat.jueves = true; 
			    $scope.newEvent.repeat.resumeStart = 'Cada semana martes, jueves '; break;
			}
		};
		
		$scope.cleanVariable = function(){
			$scope.newEvent.repeat.repeatDayOfMonth = false;
			$scope.newEvent.repeat.repeatEveryThirdDay = false;
			$scope.newEvent.repeat.resume='';
			$scope.newEvent.repeat.resumeStart = '';
			$scope.newEvent.repeat.resumeDay = '';
			$scope.newEvent.repeat.resumeWhile = '';
			$scope.newEvent.repeat.lunes = false;
			$scope.newEvent.repeat.martes = false;
			$scope.newEvent.repeat.miercoles = false;
			$scope.newEvent.repeat.jueves = false;
			$scope.newEvent.repeat.viernes = false;
			$scope.newEvent.repeat.sabado = false;
			$scope.newEvent.repeat.domingo = false;
			$scope.repeatDays = false;
			$scope.repeatWeeks = false;
			$scope.repeatMonths = false;
			$scope.repeatYears = false;
			$scope.repeatWorkDays = false;
			$scope.repeatEvery3days = false;
			$scope.repeatEvery2days = false;
			$scope.newEvent.repeat.end.every = 1;
		};

		$scope.onChangeNever = function(){
			$scope.newEvent.repeat.resumeWhile = '';
			$scope.newEvent.repeat.end.never = true;
			$scope.afterRepeat = false;
			$scope.finishWhen = false;
			$scope.newEvent.repeat.end.after = undefined;
			$scope.newEvent.repeat.end.when = undefined;				
		};

		$scope.onChangeAfterRepeat = function(){
			
			$scope.afterRepeat = true;
			$scope.finishWhen = false;
			$scope.newEvent.repeat.end.never = false;
			$scope.newEvent.repeat.end.after = 30;
			$scope.newEvent.repeat.end.when = undefined;
			$scope.newEvent.repeat.resumeWhile = ', '+$scope.newEvent.repeat.end.after+' veces';
		};

		$scope.onChangeFinish = function(){
			
			$scope.afterRepeat = false;
			$scope.finishWhen = true;
			$scope.newEvent.repeat.end.never = false;
			$scope.newEvent.repeat.end.after = undefined;
			$scope.newEvent.repeat.end.when = $scope.newEvent.end;
			$scope.newEvent.repeat.resumeWhile = ', hasta '+$scope.newEvent.repeat.end.when;
		};

		$scope.startProcessesRepeat = function(){
			var repeateEvery = $scope.newEvent.repeat.every ? $scope.newEvent.repeat.every : 1;
			var bucle;
			var extradays;
			var daysOfMonthStart=0;
			var daysOfMonthEnd=0;
			var numWeeks = 0;
			var theDayStart = 0;
			var theDayEnd = 0;
			
			if($scope.newEvent.starttime.split(':')[0].length<2)
				$scope.newEvent.starttime ='0'+$scope.newEvent.starttime;
			if($scope.newEvent.endtime.split(':')[0].length<2)
				$scope.newEvent.endtime ='0'+$scope.newEvent.endtime;

			var dateStart = $scope.newEvent.start;
			var dateEnd = $scope.newEvent.end;
			var startTime = $scope.newEvent.starttime;
			var endTime = $scope.newEvent.endtime;
			var startIni;
			var start;
			var end;

			if(dateStart.length<11){
				start = new Date($scope.convertStringToDate(dateStart +' '+ startTime+':00'));
				startIni = new Date($scope.convertStringToDate(dateStart +' '+ startTime+':00'));
				end = new Date($scope.convertStringToDate(dateEnd + ' '+ endTime+':00'));
			}else if(dateStart.length<30){//!dateStart.getMonth()
				dateStart = dateStart.substring(0,10);
				dateEnd = dateEnd.substring(0,10);
				start = new Date($scope.convertStringToDate(dateStart +' '+ startTime+':00'));
				startIni = new Date($scope.convertStringToDate(dateStart +' '+ startTime+':00'));
				end = new Date($scope.convertStringToDate(dateEnd + ' '+ endTime+':00'));
			}else{
				start = dateStart;
				startIni = dateStart;
				end = dateEnd;
			}
			startIni +='';

			if($scope.newEvent.repeat.end.never){
				bucle = 730;
			}else if($scope.afterRepeat){
				bucle = $scope.newEvent.repeat.end.after;
			}else if($scope.finishWhen){
				bucle = $scope.getNumOfDates(start,new Date($scope.convertStringToDate($scope.newEvent.repeat.end.when+' 23:59:59')));
			}

			if($scope.repeatDays){
				extradays = repeateEvery;
			}else if($scope.repeatWeeks){
				extradays = 7 * repeateEvery;
			}
			else if($scope.repeatMonths){
				extradays = 1;
				if($scope.newEvent.repeat.repeatDayOfMonth){
					daysOfMonthStart = start.getDate();
					daysOfMonthEnd = end.getDate();
				}
				else if($scope.newEvent.repeat.repeatEveryThirdDay){
					daysOfMonthStart = start.getDate();
					daysOfMonthEnd = end.getDate();
					theDayStart = start.getDay();
					theDayEnd = end.getDay();
				}
			}
			else if($scope.repeatYears){
				extradays = 365 * repeateEvery;
			}
			else if($scope.repeatEvery3days || $scope.repeatEvery2days || $scope.repeatWorkDays){
				extradays = 7;
			}
			var theNewEvent =[];
			$scope.newEvent.idevent = $scope.newEvent._id;
			var myNewArray =[];

			for( var i = 1 ; i <= bucle ; i ++ ){	
				var newArray;
				var ini;
				var fin;
				var ok = true;
				if($scope.repeatDays || $scope.repeatYears){
					start.setDate(start.getDate() + extradays);
					end.setDate(end.getDate() + extradays);
					myNewArray.push($scope.setNewRepeatEvent(start , end , startTime , endTime));
				}else if($scope.repeatWeeks || $scope.repeatEvery2days || $scope.repeatEvery3days || $scope.repeatWorkDays){ 
					var cont;
					if(i===1){
						cont=0;
					}else{
						cont= extradays;
					}
					if($scope.newEvent.repeat.lunes){
						ini = $scope.setDayOfTheWeek(start,1);
						fin = $scope.setDayOfTheWeek(end,1);
						if(ok){
							if(cont>0){
								ini = cont - Math.abs(ini);
								fin = cont - Math.abs(fin);	
								ok = false;
							}
						}
						start.setDate(start.getDate() + ini);
						end.setDate(end.getDate() + fin);
						if(start > new Date(startIni))
							myNewArray.push($scope.setNewRepeatEvent(start , end , startTime , endTime));
					}
					if($scope.newEvent.repeat.martes){
						ini = $scope.setDayOfTheWeek(start,2);
						fin = $scope.setDayOfTheWeek(end,2);
						if(ok){
							if(cont>0){
								ini = cont - Math.abs(ini);
								fin = cont - Math.abs(fin);	
								ok = false;
							}
						}
						start.setDate(start.getDate() + ini);
						end.setDate(end.getDate() + fin);
						if(start > new Date(startIni))
						myNewArray.push($scope.setNewRepeatEvent(start , end , startTime , endTime));
					}
					if($scope.newEvent.repeat.miercoles){
						ini = $scope.setDayOfTheWeek(start,3);
						fin = $scope.setDayOfTheWeek(end,3);
						if(ok){
							if(cont>0){
								ini = cont - Math.abs(ini);
								fin = cont - Math.abs(fin);	
								ok = false;
							}
						}
						start.setDate(start.getDate() + ini);
						end.setDate(end.getDate() + fin);
						if(start > new Date(startIni))
							myNewArray.push($scope.setNewRepeatEvent(start , end , startTime , endTime));
					}
					if($scope.newEvent.repeat.jueves){
						ini = $scope.setDayOfTheWeek(start,4);
						fin = $scope.setDayOfTheWeek(end,4);
						if(ok){
							if(cont>0){
								ini = cont - Math.abs(ini);
								fin = cont - Math.abs(fin);	
								ok = false;
							}
						}
						start.setDate(start.getDate() + ini);
						end.setDate(end.getDate() + fin);
						if(start > new Date(startIni))
							myNewArray.push($scope.setNewRepeatEvent(start , end , startTime , endTime));
					}
					if($scope.newEvent.repeat.viernes){
						ini = $scope.setDayOfTheWeek(start,5);
						fin = $scope.setDayOfTheWeek(end,5);
						if(ok){
							if(cont>0){
								ini = cont - Math.abs(ini);
								fin = cont - Math.abs(fin);	
								ok = false;
							}
						}
						start.setDate(start.getDate() + ini);
						end.setDate(end.getDate() + fin);
						if(start > new Date(startIni))
							myNewArray.push($scope.setNewRepeatEvent(start , end , startTime , endTime));
					}
					if($scope.newEvent.repeat.sabado){
						ini = $scope.setDayOfTheWeek(start,6);
						fin = $scope.setDayOfTheWeek(end,6);
						if(ok){
							if(cont>0){
								ini = cont - Math.abs(ini);
								fin = cont - Math.abs(fin);	
								ok = false;
							}
						}						
						start.setDate(start.getDate() + ini);
						end.setDate(end.getDate() + fin);
						if(start > new Date(startIni))
							myNewArray.push($scope.setNewRepeatEvent(start , end , startTime , endTime));
					}
					if($scope.newEvent.repeat.domingo){
						ini = $scope.setDayOfTheWeek(start,7);
						fin = $scope.setDayOfTheWeek(end,7);
						if(ok){
							if(cont>0){
								ini = cont - Math.abs(ini);
								fin = cont - Math.abs(fin);	
								ok = false;
							}
						}
						start.setDate(start.getDate() + ini);
						end.setDate(end.getDate() + fin);
						if(start > new Date(startIni))
							myNewArray.push($scope.setNewRepeatEvent(start , end , startTime , endTime));
					}
				}else if($scope.repeatMonths){
					var conts=0;
					if(i===1){
						conts = 0;
					}
					else{
						conts = extradays;
					}
					if($scope.newEvent.repeat.repeatDayOfMonth){
						start.setMonth(start.getMonth()+conts);
						end.setMonth(end.getMonth()+conts);
						start.setDate(daysOfMonthStart);
						end.setDate(daysOfMonthEnd);
						if(start > new Date(startIni))
							myNewArray.push($scope.setNewRepeatEvent(start , end , startTime , endTime));
					}
					else if($scope.newEvent.repeat.repeatEveryThirdDay){
						if(ok){
							if(conts>0){
								ok = false;
								//SetMonts
								start.setMonth(start.getMonth() + conts);
								end.setMonth(end.getMonth() + conts);
								start.setDate(daysOfMonthStart);
								end.setDate(daysOfMonthEnd);

								var dateS = $scope.setNewDateOfMonth( start , theDayStart, numWeeks);
								var dateE = $scope.setNewDateOfMonth( end , theDayEnd, numWeeks);
								
								if(numWeeks === 0){
									numWeeks = dateS.length;
								}

								//SetDays
								start.setDate(dateS[numWeeks-1]);
								end.setDate(dateE[dateE.length-1]);
							}
						}

						if(start > new Date(startIni))
							myNewArray.push($scope.setNewRepeatEvent(start , end , startTime , endTime));
					}
				}
			}
			if(myNewArray.length>0){
				$scope.EverySerie(function(){
					$http.post('/calendars/insertMassive', myNewArray).success(function(response){
						$scope.myCalendar.fullCalendar( 'render' );
					}).error(function(errorResponse){
						$scope.msgSmartNotification('Error' , errorResponse.data.message , 'fa fa-frown-o' , '#C46A69' );
					});
				});
			}
		};

		$scope.setNewDateOfMonth = function(date, day, numWeeks){
			var year = date.getFullYear();
			var month = date.getMonth()+1;
			if(month<10)
				month='0'+month;

			var lastDayOfMonth = new Date(year, month, 0);
			var myDate = lastDayOfMonth.getDate();
			var count=0;
			var dayWeek = [];

			for( var i=1; i<= Number(myDate) ; i++){
				lastDayOfMonth.setDate(i);

				if(day === Number(lastDayOfMonth.getDay())){
					if(Number(lastDayOfMonth.getDate()) <= Number(date.getDate()) || numWeeks >= 0 ){
						dayWeek.push(lastDayOfMonth.getDate());
						count++;
					}				
				}
			}
			return dayWeek;
		};

		$scope.setNewDateByMonth = function(date, day){
			var weekOnMonth = date.getDate()/7;
			if(weekOnMonth > Math.trunc(weekOnMonth)){
				weekOnMonth ++;
			}
		};

		//
		$scope.setDayOfTheWeek = function(date,dayOfTheWeek){
			var result=0;
			result = dayOfTheWeek - date.getDay();
			return result;
		};

		//
		$scope.setNewRepeatEvent = function(start, end, startTime, endTime){
			var newArray = {
					title : $scope.newEvent.title,
					color : $scope.newEvent.color,
					allDay : $scope.newEvent.allDay,
					start : new Date(start),
					end : new Date(end),
					endtime : endTime,
					starttime: startTime,
					idevent : $scope.newEvent._id,
					notifications : $scope.newEvent.notifications,
					isrepeat : $scope.newEvent.isrepeat,
					ispublic : $scope.newEvent.ispublic,
					repeat : $scope.newEvent.repeat,
					guests : $scope.newEvent.guests,
					user : $scope.newEvent.user ? $scope.newEvent.user : $scope.authentication.user._id
				};
			return newArray;
		};

		//Get num days between dates
		$scope.getNumOfDates = function daysBetween(date1, date2){     
			var one_day = 1000*60*60*24;   
			var daysApart = Math.abs(Math.ceil((date1.getTime()-date2.getTime())/one_day));   
			return daysApart;
		};

		//
		$scope.getToDay = function(){
			var date = new Date();
			var coma = '';
			$scope.newEvent.repeat.resumeDay ='';

			if( $scope.newEvent.repeat.lunes || $scope.newEvent.repeat.martes || $scope.newEvent.repeat.miercoles || $scope.newEvent.repeat.jueves || $scope.newEvent.repeat.viernes || $scope.newEvent.repeat.sabado || $scope.newEvent.repeat.domingo)
				coma =', ';

			switch(Number(date.getDay())){
				case 1: $scope.newEvent.repeat.lunes = true; break;
				case 2: $scope.newEvent.repeat.martes=true; break;
				case 3: $scope.newEvent.repeat.miercoles=true; break;
				case 4: $scope.newEvent.repeat.jueves=true; break;
				case 5: $scope.newEvent.repeat.viernes=true; break;
				case 6: $scope.newEvent.repeat.sabado=true; break;
				case 7: $scope.newEvent.repeat.domingo=true; break;
			}

			if($scope.newEvent.repeat.lunes){
				$scope.newEvent.repeat.resumeDay += 'lunes';
			}

			if($scope.newEvent.repeat.martes){
				$scope.newEvent.repeat.resumeDay += coma+'martes';
			}
			if($scope.newEvent.repeat.miercoles){
				$scope.newEvent.repeat.resumeDay += coma+'miércoles';
			}
			if($scope.newEvent.repeat.jueves){
				$scope.newEvent.repeat.resumeDay += coma+'jueves';
			}
			if($scope.newEvent.repeat.viernes){
				$scope.newEvent.repeat.resumeDay += coma+'viernes';
			}
			if($scope.newEvent.repeat.sabado){
				$scope.newEvent.repeat.resumeDay += coma+'sabado';
			}
			if($scope.newEvent.repeat.domingo){
				$scope.newEvent.repeat.resumeDay += coma+'domingo';
			}			
		};

		//
		$scope.onEveryDaysChange = function(){
			$scope.functionResumeChange();
		};

		//
		$scope.functionResumeChange = function(){
			var description ='';
			if($scope.repeatDays){
				if($scope.newEvent.repeat.every>1)
					description = ' días ';
				else
					description = ' día ';
			}				
			else if($scope.repeatWeeks){
				if($scope.newEvent.repeat.every>1)
					description = ' semanas ';
				else
					description = ' semana ';
			}else if($scope.repeatMonths){
				if($scope.newEvent.repeat.every>1)
					description = ' meses ';
				else
					description = ' mes ';
			}else if($scope.repeatYears){
				if($scope.newEvent.repeat.every>1)
					description = ' años ';
				else
					description = ' año ';
			}
			if($scope.newEvent.repeat.every===1){
				$scope.newEvent.repeat.resumeStart = 'Cada'+description;
			}
			else if($scope.newEvent.repeat.every>1){
				$scope.newEvent.repeat.resumeStart = 'Cada '+$scope.newEvent.repeat.every + description;
			}else{
				$scope.newEvent.repeat.resumeStart = 'Cada'+description;	
			}
		};

		//
		$scope.onCheckMonthChange = function(){
			$scope.newEvent.repeat.repeatDayOfMonth = true;
			$scope.newEvent.repeat.repeatEveryThirdDay = false;
		};

		//
		$scope.onCheckMonthThirdChange = function(){
			$scope.newEvent.repeat.repeatDayOfMonth = false;
			$scope.newEvent.repeat.repeatEveryThirdDay = true;
		};

		//CIRCLES OPTIONS
		$scope.onClickLi = function(index, newCircle, circle){
			$timeout(function(){
				$element.find('div[name="c-options"]').addClass('open');	
			});

			if(newCircle === 0){
				$scope.newCircle = false;
				if(circle.checked)
					circle.checked = false;
				else 
					circle.checked = true;

					$scope.updateCirclesDocument();
					//$scope.update();
				
			}else if(newCircle === 1){
				$scope.newCircle = true;
				$timeout(function(){
					$element.find('input[name="newCircleInput"]').focus();
				});
			}
		};

		$scope.onKeyPressNewCircle = function(e){
			if(e.keyCode === 27){
				$scope.newCircle = false;
				$scope.newEvent.circleName = '';
			}else if(e.keyCode === 13){
				if($scope.newEvent.circleName !== '' || $scope.newEvent.circleName !==undefined)
					$scope.createCircle();
			}
		};

		$scope.clicked = function(){
			$scope.createCircle();
		};

		// Create new Circulo
		$scope.updateCircles = function(response){
			Circulos.query(function(circulos){
				$scope.circulos= [];
				angular.forEach(circulos,function(circulo){
					$scope.circulos.push({ name : circulo.name, _id : circulo._id, checked : false });
				});
				var contTrue = 0;
				var title = '';
				if(response){
					angular.forEach(response.circles, function(doc){
						angular.forEach($scope.circulos, function(value){
							if(value._id+'' === doc.idcircle+''){
								value.checked = true;
								contTrue ++;
								if(contTrue>1)
									title = 'Círculos';
								else
									title = value.name;
							}
						});
					});	
				}				
				$scope.circulos.total = contTrue;
				$scope.circulos.title = title;
			});
		};

		$scope.createCircle = function() {
			// Create new Menu object
			var circulo = new Circulos ( { name : $scope.newEvent.circleName , user: $scope.authentication.user._id } );
			circulo.$save(function(response){
				$scope.circulos.push(response);
				$scope.circulo = null;
				$scope.newEvent.circleName = '';
				$scope.newEvent.circles.push({ name : response.name, idcircle: response._id, checked: true });
				//$scope.update();
				$scope.newCircle = false;
				$scope.msgSmartNotification('Círculo','Su círculo fue agregado correctamente','fa fa-check','#739E73');
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
			// Redirect after save
		};

		$scope.updateCirclesDocument = function(){
			if(!$scope.newEvent)
				$scope.newEvent = {};
			$scope.newEvent.circles = [];
			angular.forEach($scope.circulos, function(circle){
				if(circle.checked){
					$scope.newEvent.circles.push({idcircle : circle._id, name: circle.name, checked: circle.checked });
				}
			});
		};

		/*Historials*/
		// Create new Historial
		$scope.createHistorial = function(response, typemov, icon, url ) {
			// Create new Historial object
			var historial = new Historials ({
				typemov : typemov,
				icon : icon,
				url : url,
				user: $scope.user._id,
				from : 'Calendario'
			});
			historial.calendario = response;
			// Redirect after save
			historial.$save(function(response) {

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
		};
	}
]);