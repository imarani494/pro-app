import AppConfig from "../config/AppConfig";

var parse = require("url-parse");
class UrlHandler {
  static checkUrl(url: any, prepend = AppConfig.host) {
    let _url;
    if (url.indexOf("https:") == 0 || url.indexOf("http:") == 0) {
      _url = url;
    } else if (url.indexOf("//") == 0) {
      _url = "https:" + url;
    } else if (url.indexOf("/static") == 0) {
      _url = AppConfig.staticUrl + "" + url;
    } else {
      _url = prepend + "" + url;
    }
    return _url;
  }
  static insParam(u: any, k: any, v: any, c: any = true) {
    v = escape(v);
    var idx = u.indexOf("?");
    var p = idx >= 0 ? u.substr(idx + 1) : "";
    var kvp = p == "" ? [] : p.split("&");
    var i = kvp.length,
      x;
    if (c) {
      while (i--) {
        x = kvp[i].split("=");
        if (x[0] == k) {
          x[1] = v;
          kvp[i] = x.join("=");
          break;
        }
      }
    } else {
      kvp[kvp.length] = [k, v].join("=");
    }
    if (i < 0) {
      kvp[kvp.length] = [k, v].join("=");
    }
    return (idx < 0 ? u + "?" : u.substr(0, idx + 1)) + kvp.join("&");
  }
  static insAllParams(u: any, pO: any) {
    for (var k in pO) {
      if (Array.isArray(pO[k])) {
        for (let val of pO[k]) {
          u = UrlHandler.insParam(u, k, val, false);
        }
      } else {
        u = UrlHandler.insParam(u, k, pO[k]);
      }
    }
    return u;
  }
  static getParseUrl(url: any) {
    return parse(url, true);
  }

  static checkParams(url: string, queryString: any) {
    return url.includes("?")
      ? `${url}&${queryString}`
      : `${url}?${queryString}`;
  }
}

export default UrlHandler;
