function checkEvent() {
  
  var itCalendar = CalendarApp.getCalendarById('calendar-id');
  var startTime, endTime, tempStartTime, tempEndTime;
  var newEvent, oldEvent, presentEvents;
  
  var resSheet = SpreadsheetApp.openByUrl('url').getSheetByName('sheet-name');
  var autSheet = SpreadsheetApp.openByUrl('url').getSheetByName('sheet-name');
  var resRow = resSheet.getLastRow();
  var resEmail = resSheet.getSheetValues(resRow, 6, 1, 1)[0][0];
  var resStart = resSheet.getSheetValues(resRow, 3, 1, 1)[0][0];
  var resDuration = resSheet.getSheetValues(resRow, 4, 1, 1)[0][0];
  var resName = resSheet.getSheetValues(resRow, 2, 1, 1)[0][0];
  var autEmail, autId;
  
  var findAut = false;
  var i;

  for(i = 2; i <= autSheet.getLastRow(); i++){
    
    autEmail = autSheet.getSheetValues(i, 1, 1, 1)[0][0];
    
    if(autEmail == resEmail){
      
      findAut = true;
      autId = autSheet.getSheetValues(i, 2, 1, 1)[0][0];
      
      break;
      
    }
    
  }
  
  if(autId != '' && resDuration == 0){
      
    oldEvent = itCalendar.getEventById(autId);
    
    if(oldEvent.getEndTime() > new Date()){
      
      oldEvent.deleteEvent();
      autSheet.getRange(i, 2).setValue('');
      
    }
    
    return;
      
  }
 
  startTime = new Date(resStart);
  endTime = new Date(startTime.getTime()+3600000*resDuration);
  tempStartTime = new Date(resStart + 1000);
  tempEndTime = new Date(startTime.getTime()+3600000*resDuration - 1000);
  presentEvents = itCalendar.getEvents(tempStartTime, tempEndTime);
  
  if(findAut && (endTime > new Date())){
    
    if(presentEvents.length == 0 || presentEvents.length == 1 &&  presentEvents[0].getId() == autId){
    
      if(autId == ""){
        
        newEvent = itCalendar.createEvent(resName, startTime, endTime);
        autSheet.getRange(i, 2).setValue(newEvent.getId());
        
      } else {
        
        oldEvent = itCalendar.getEventById(autId);
        
        if(oldEvent.getEndTime() < new Date()){
          
          newEvent = itCalendar.createEvent(resName, startTime, endTime);
          
        } else {
          
          oldEvent.deleteEvent();
          newEvent = itCalendar.createEvent(resName, startTime, endTime);
          
        }
        
        autSheet.getRange(i, 2).setValue(newEvent.getId());
      }
      
    }
    
  }
  
}
