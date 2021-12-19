
function getFullTime (time) {
    const temp = new Date(time);
    let month = temp.getMonth()+1;
    if(month<10){
        month = "0"+month;
    }
    let date = temp.getDate();
    if(date<10){
        date = "0"+date;
    }
    let hour = temp.getHours();
    if(hour<10){
        hour = "0"+hour;
    }
    let minutes = temp.getMinutes();
    if(minutes<10){
        minutes = "0"+minutes;
    }
    let seconds = temp.getSeconds();
    if(seconds<10){
        seconds = "0"+seconds;
    }
    return hour+":"+minutes+":"+seconds+", "+date+"-"+month+"-"+temp.getFullYear();
  }
  export default getFullTime;