export default class mlog {
  static info(str) {
    let DD = new Date();
    let Hours = DD.getHours();
    let Minutes = DD.getMinutes();
    let Seconds = DD.getSeconds();
    console.log("[info][" + zp(Hours) + ":" + zp(Minutes) + ":" + zp(Seconds) + "] " + str)
  }
}

function zp (num) {
  return ('00' + num).slice(-2);
}