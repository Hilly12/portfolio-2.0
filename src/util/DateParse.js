export default function parse(date) {
  let year = parseInt(date.slice(0, 4));
  let month = parseInt(date.slice(5, 7));
  let day = parseInt(date.slice(8, 10));
  let monthName;
  switch (month) {
    case 1:
      monthName = "January";
      break;
    case 2:
      monthName = "February";
      break;
    case 3:
      monthName = "March";
      break;
    case 4:
      monthName = "April";
      break;
    case 5:
      monthName = "May";
      break;
    case 6:
      monthName = "June";
      break;
    case 7:
      monthName = "July";
      break;
    case 8:
      monthName = "August";
      break;
    case 9:
      monthName = "September";
      break;
    case 10:
      monthName = "October";
      break;
    case 11:
      monthName = "November";
      break;
    case 12:
      monthName = "December";
      break;
    default:
      monthName = "";
  }
  let suffix = "th";
  if (day % 10 === 1) {
    suffix = "st";
  } else if (day % 10 === 2) {
    suffix = "nd";
  } else if (day % 10 === 3) {
    suffix = "rd";
  }
  return [day + suffix, monthName, year];
}