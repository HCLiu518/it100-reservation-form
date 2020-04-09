function checkEvent() {
  
  var itCalendar = CalendarApp.getCalendarById('nthuit100@gmail.com');
  var startTime, endTime;
  var newEvent, oldEvent;
  
  var resSheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1CCEq_t6oGEJXGmtvY8kaFua3KL3O7e5mt7VLNZ329LM/edit#gid=1787613458').getSheetByName('表單回應 1');
  var autSheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1dZ4g3Wvb8INW1B8eDiFl3fYKg7Z2bHaUgAyCQtGOReA/edit#gid=0').getSheetByName('it100');
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
  
  startTime = new Date(resStart);
  endTime = new Date(startTime.getTime()+3600000*resDuration);
  
  if(findAut && (endTime > new Date()) && (itCalendar.getEvents(startTime, endTime).length == 0)){
    
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
