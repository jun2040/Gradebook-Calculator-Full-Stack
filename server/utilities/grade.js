exports.toLetter = (p) => {
  let x;
  
  switch(true) {
    case p <= 100 && p >= 90:
      x = 'A';
      break;
    case p < 90 && p >= 80:
      x = 'B';
      break;
    case p < 80 && p >= 70:
      x = 'C';
      break;
    case p < 70 && p >= 60:
      x = 'D';
      break;
    case p < 60 && p >= 0:
      x = 'F';
      break;
    default:
      x = '-';
  }

  return x;
}