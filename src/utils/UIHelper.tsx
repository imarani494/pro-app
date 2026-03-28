class UIHelper {
  static custSubString(str: any, num: number) {
    if (!str || num <= 0) {
      return str;
    }
    return str.length >= num ? str.substring(0, num) + "..." : str;
  }
  static addTimeField(
    fm: number,
    to: number,
    i: number,
    isAP: boolean,
    isNoAPInVal: boolean
  ) {
    let result = [];
    for (var hr = fm; hr <= to; hr++) {
      var hr12: any = hr > 12 && isAP ? hr - 12 : hr;
      hr12 = hr12 < 10 ? "0" + hr12 : hr12;
      var hr24 = hr < 10 ? "0" + hr : hr;
      var a = isAP ? (hr > 11 ? " PM" : " AM") : "";
      for (var mn = 0; mn < 60; mn += i) {
        var mn0 = mn < 10 ? "0" + mn : mn;
        var tmD = hr12 + ":" + mn0 + a;
        var tmVal = isNoAPInVal ? hr24 + ":" + mn0 : tmD;
        result.push({ label: tmD, value: tmVal });
      }
    }
    return result;
  }
  static isValidEmail(email: any) {
    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  }

  static getDropDownData(list: any, lblKey: any = "dNm", valKey: any = "id") {
    if (!list) {
      return [];
    }
    return list?.map((listItem: any) => ({
      label: listItem[lblKey] || listItem,
      value: listItem[valKey] || listItem,
    }));
  }
  static getImageUrlForFlight(code: string){
    if(!code){
      return
    }
    return `https://cdn.yourholiday.me/static/img/poccom/airlines/licons/${code}.gif`
  }
}

export default UIHelper;
