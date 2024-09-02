export default function TimeChanger(time) {
  // console.log(time);
  time = time.split(' --> ')[0]
  let start = time
  var timeParts = time.split(":");
  var hours = parseInt(timeParts[0]);
  var minutes = parseInt(timeParts[1]);
  var secondsParts = timeParts[2].split(",");
  var seconds = parseInt(secondsParts[0]);
  var milliseconds = parseInt(secondsParts[1]);
  var totalSeconds = (hours * 3600) + (minutes * 60) + seconds + (milliseconds / 1000);
  return [totalSeconds,time];
}
