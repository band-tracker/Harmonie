function addZero(i) {
  if(i < 10) {
    i = '0' + i;
  }
  return i;
}

function formatTime(date) {
  var h = addZero(date.getHours());
  var m = addZero(date.getMinutes());
  return h + ':' + m;
}

module.exports = formatTime;
