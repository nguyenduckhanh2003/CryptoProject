export const setCookies = (cname, cvalue, time) => {
  var d = new Date();
  d.setTime(d.getTime() + time * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
};

export const getCookies = (cname) => {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const deleteCookie = (cname) => {
  document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
};

export const deleteAllCookie = () => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const eqPos = cookies[i].indexOf("=");
    const name = eqPos > -1 ? cookies[i].substring(0, eqPos) : cookies[i];
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  }
};
