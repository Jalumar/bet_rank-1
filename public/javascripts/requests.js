//Javascript Document 2020/05/15

"use strict";

let loadedData = false,
  btn,
  modal,
  userConfig = [],
  nameCountry,
  iso2Country,
  verifyCountry = false;
const lng = navigator.language.split("-")[0];
const config = {};
config.userPreferences = localStorage.getItem("userConfig");
//Manage requests or retry requests to server or local resources
const sendReq = async (uri, target) => {
  fetch(uri)
    .then((res) => res.json())
    .catch((err) => {
      setTimeout(() => {
        sendReq(uri, target);
      }, 2000);
      throw `Error #1 message -> ${err}`;
    })
    .then((response) => {
      if (target == "countries") {
        config.countriesList = response;
      } else if (target == "messages") {
        config.packMessages = response;
        // return setMessages();
      } else if (target == "ip") {
        config.dataJson = response;
        // renderData(config.dataJson, "world", uri);
        console.log(config.dataJson);
        if (
          config.userPreferences == null ||
          JSON.parse(config.userPreferences) == ""
        ) {
          return (
            //Obtain iso2 code of country user
            currentCountry()
              .then((response) => {
                if (
                  response !== undefined &&
                  response.indexOf("404 (Not Found)") == -1
                ) {
                  userConfig.push(response);
                  localStorage.setItem(
                    "userConfig",
                    JSON.stringify(userConfig)
                  );
                  renderData(config.dataJson, response);
                } else renderData(config.dataJson, "US");
              })
              .catch((err) => {
                // renderData(config.dataJson, "US");
              })
          );
        } else {
          return setSelectUser();
        }
      }
    });
};

//Get the list of countries by language
(function () {
  fetch(`../../_locales/${lng}/${lng}.json`)
    .then((res) => res.json())
    .catch((err) => {
      // sendReq("../../_locales/en/en.json", "countries");
      throw err;
    })
    .then((response) => {
      config.countriesList = response;
    });
})();

const setSelectUser = async () => {
  config.userPreferences = localStorage.getItem("userConfig");
  userConfig = JSON.parse(config.userPreferences);
  userConfig.forEach((item) => {
    // renderData(config.dataJson, item);
  });
};

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    verifyCountry = false;
    if (this.value.length >= 2) {
      var a,
        b,
        i,
        val = objMods.cleaner(this.value);
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) {
        return false;
      }
      // if (document.querySelector("#label--find").textContent != "") {
      //   document.querySelector("#label--find").innerHTML = "";
      // }
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (
          arr[i][0].substr(0, val.length).toUpperCase() == val.toUpperCase()
        ) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML =
            "<strong>" + arr[i][0].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i][0].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i][0] + "'>";
          b.innerHTML += "<input type='hidden' value='" + arr[i][1] + "'>";
          b.insertAdjacentHTML(
            "afterbegin",
            '<img class="flag" src="/images/flags/' +
              arr[i][1].toUpperCase() +
              '.png" />&nbsp;'
          );
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function (e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            //Save the country code how attribute for search data
            inp.setAttribute(
              "data-iso",
              this.getElementsByTagName("input")[1].value
            );
            document.querySelector("#bet-flags").src = `/images/flags/${
              this.getElementsByTagName("input")[1].value
            }.png`;
            /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
            closeAllLists();
            //                    document.querySelector('input[type="image"]').click();
            //                    document.querySelector('.close').click();
            verifyCountry = true;
          });
          a.appendChild(b);
        }
      }
    } else return void 0;
  });

  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    var y = document.getElementsByClassName("autocomplete-items");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
      if (currentFocus >= 0) y[0].scrollTop = y[0].scrollTop + 37;
      else y[0].scrollTop = 0;

      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
      if (currentFocus > 0) y[0].scrollTop = y[0].scrollTop - 37;
      else y[0].scrollTop = 0;
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    // let shoot = e.target;
    // let wrp = document.querySelector(".covid-wrp-searcher") || null;
    // if (wrp != null && shoot != btn) {
    //   if (
    //     shoot.parentElement != null &&
    //     shoot != wrp &&
    //     shoot.parentElement != wrp &&
    //     shoot.parentElement.parentElement != wrp &&
    //     shoot.parentElement.parentElement.parentElement != wrp
    //   )
    //     btn.click();
    // } else {
    closeAllLists(e.target);
    // }
  });
}

// function setMessages() {
//   document.querySelector(
//     "#preload--message"
//   ).textContent = `${config.packMessages.loading.message}`;
//   document.title = `${config.packMessages.title_first.message} ${config.packMessages.title_last.message} | ${config.packMessages.extension_description.message}`;
//   document.querySelector(
//     "#btn--search"
//   ).title = `${config.packMessages.more.message}`;
//   document.querySelector(
//     "#first"
//   ).textContent = `${config.packMessages.title_first.message}`;
//   document.querySelector(
//     "#last"
//   ).textContent = `${config.packMessages.title_last.message}`;
//   document.querySelector(
//     "#caption--list > h2"
//   ).textContent = `${config.packMessages.search_result.message}`;
//   document.querySelector(
//     "#caption--list > div > .place"
//   ).textContent = `${config.packMessages.zone.message}`;
//   document.querySelector(
//     "#caption--list > div > .select-cases"
//   ).textContent = `${config.packMessages.confirmed.message}`;
//   document.querySelector(
//     "#caption--list > div > .select-recovered"
//   ).textContent = `${config.packMessages.recovered.message}`;
//   document.querySelector(
//     "#caption--list > div > .select-deaths"
//   ).textContent = `${config.packMessages.deaths.message}`;
// }

//Query for user country
const currentCountry = async () => {
  let iso2 = await fetch("http://localhost/bet_tracker/checkIp.php");
  return await iso2.json();
};

async function removeCountry() {
  let closes = document.querySelectorAll(".covid-close-country");
  closes.forEach((item) => {
    item.onclick = (e) => {
      let patern = e.target.closest("li");
      let codeForDelete = patern
        .querySelector(".selected--reg")
        .getAttribute("data-iso");
      patern.id = "toRemove";
      patern.parentElement.removeChild(document.querySelector("#toRemove"));
      if (userConfig.indexOf(codeForDelete) != -1) {
        userConfig.splice(userConfig.indexOf(codeForDelete), 1);
        localStorage.setItem("userConfig", JSON.stringify(userConfig));
      }
    };
  });
}

//Add data and statistics in UI
async function printData(action, scroll) {
  let thisCountry, thisCode;
  if (action !== "world" && !loadedData) {
    for (const country of config.countriesList) {
      if (country[1] == action.toUpperCase()) {
        thisCountry = country[0];
        thisCode = country[1];
        break;
      }
    }

    return (() => {
      let nameRegion = "";
      if (thisCountry == undefined) {
        thisCountry = "Tajikistan";
      }
      if (province != "") nameRegion = `${thisCountry} - ${province}`;
      else nameRegion = `${thisCountry}`;

      if (countryConf != undefined) {
        document
          .querySelector("#confirmed > .covid--results")
          .insertAdjacentHTML(
            "beforeend",
            `<li>
            <div class="covid--region">
                <p>
                    <img src="../../assets/images/flags/${action.toUpperCase()}.png" alt="${thisCountry}" title="${thisCountry}">&nbsp;&nbsp;<span class="name--reg" data-iso="${action}">${nameRegion}</span>
                </p>
                <span>${countryConf}</span></div></li>`
          );
      }

      if (countryDeaths != undefined) {
        document.querySelector("#deaths > .covid--results").insertAdjacentHTML(
          "beforeend",
          `<li>
            <div class="covid--region">
                <p>
                    <img src="../../assets/images/flags/${action.toUpperCase()}.png" alt="${thisCountry}" title="${thisCountry}">&nbsp;&nbsp;<span class="name--reg" data-iso="${action}">${nameRegion}</span>
                </p>
                <span>${countryDeaths}</span></div></li>`
        );
      }

      if (countryRecovered != undefined) {
        document
          .querySelector("#recovereds > .covid--results")
          .insertAdjacentHTML(
            "beforeend",
            `<li>
            <div class="covid--region">
                <p>
                    <img src="../../assets/images/flags/${action.toUpperCase()}.png" alt="${thisCountry}" title="${thisCountry}">&nbsp;&nbsp;<span class="name--reg" data-iso="${action}">${nameRegion}</span>
                </p>
                <span>${countryRecovered}</span></div></li>`
          );
      }
      province = "";
    })();
  } else if (loadedData && action !== "world") {
    for (const country of config.countriesList) {
      if (country[1] == action.toUpperCase()) {
        thisCountry = country[0];
        thisCode = country[1];
        if (userConfig.indexOf(action.toUpperCase()) == -1) {
          userConfig.push(action.toUpperCase());
          localStorage.setItem("userConfig", JSON.stringify(userConfig));
        }
        break;
      }
    }
    document.querySelector("#searchs-container").insertAdjacentHTML(
      "beforeend",
      `<li>
            <div class="covid--region">
                <p>
                    <img src="../../assets/images/flags/${action.toUpperCase()}.png" alt="${thisCountry}" title="${thisCountry}">&nbsp;&nbsp;<span class="selected--reg" data-iso="${action}">${thisCountry}</span>
                </p>
                <span class="select-cases">${countryConf}</span>
                <span class="select-recovered">${countryRecovered}</span>
                <span class="select-deaths">${countryDeaths}</span>
            </div>
            <button type="button" class="covid-close-country" title="${
              config.packMessages.delete.message
            }"><span>X</span></button>
        </li>`
    );

    let itemsList = document.querySelectorAll(".searchs-container > li");
    if (itemsList.length > 9) {
      if (scroll)
        document.querySelector(".searchs-container").scrollTop =
          document.querySelector(".searchs-container").scrollTop +
          parseInt(document.querySelector(".searchs-container").offsetHeight);
    }

    return await removeCountry();
  } else {
    let lastUpdate = new Date();
    let zone = lastUpdate.toString().split(" (");
    zone = zone[zone.length - 1].split(" ");
    let year = lastUpdate.getFullYear();
    let month =
      lastUpdate.getMonth() < 9
        ? "0" + (lastUpdate.getMonth() + 1).toString()
        : lastUpdate.getMonth() + 1;
    let day =
      lastUpdate.getDate() < 10
        ? "0" + lastUpdate.getDate().toString()
        : lastUpdate.getDate();
    let hour =
      lastUpdate.getHours() < 10
        ? "0" + lastUpdate.getHours().toString()
        : lastUpdate.getHours();
    let minutes =
      lastUpdate.getMinutes() < 10
        ? "0" + lastUpdate.getMinutes().toString()
        : lastUpdate.getMinutes();
    let seconds =
      lastUpdate.getSeconds() < 10
        ? "0" + lastUpdate.getSeconds().toString()
        : lastUpdate.getSeconds();

    document.querySelector(
      "#last--update"
    ).innerHTML = `${config.packMessages.update.message}: ${year}/${month}/${day} - ${hour}:${minutes}:${seconds} - ${zone[0]}`;

    return (() => {
      document
        .querySelector("#confirmed > .all--cases")
        .insertAdjacentHTML(
          "afterbegin",
          `<h2>${config.packMessages.all_world.message} ${config.packMessages.confirmed.message}</h2><p>${totalConf}</p>`
        );
      document
        .querySelector("#deaths > .all--deaths")
        .insertAdjacentHTML(
          "afterbegin",
          `<h2>${config.packMessages.all_world.message} ${config.packMessages.deaths.message}</h2><p>${totalDeaths}</p>`
        );
      document
        .querySelector("#all-recovereds")
        .insertAdjacentHTML(
          "afterbegin",
          `<h2>${config.packMessages.all_world.message} ${config.packMessages.recovered.message}</h2><p>${totalRecovered}</p>`
        );

      setTimeout(() => {
        document
          .querySelector(".giu-container")
          .removeChild(document.querySelector("#preloader"));
      }, 3000);
    })();
  }
}

//Calculating
// async function renderData(objData, target, lastUri = false, scroll = false) {
//   try {
//     countryConf = 0;
//     countryDeaths = 0;
//     countryRecovered = 0;
//     objData.forEach((item) => {
//       if (!loadedData) {
//         if (
//           target != "world" &&
//           item.countrycode != undefined &&
//           item.countryregion != undefined
//         ) {
//           if (item.countrycode.iso2.toUpperCase() == target.toUpperCase()) {
//             countryConf = item.confirmed;
//             countryDeaths = item.deaths;
//             countryRecovered = item.recovered;
//             province = item.provincestate;
//           }
//         } else {
//           countryConf = item.confirmed;
//           countryDeaths = item.deaths;
//           countryRecovered = item.recovered;
//           province = item.provincestate;
//           totalConf +=
//             !isNaN(parseInt(item.confirmed)) && item.confirmed != undefined
//               ? item.confirmed
//               : 0;
//           totalDeaths +=
//             !isNaN(parseInt(item.deaths)) && item.deaths != undefined
//               ? item.deaths
//               : 0;
//           totalRecovered +=
//             !isNaN(parseInt(item.recovered)) && item.recovered != undefined
//               ? item.recovered
//               : 0;
//           if (item.countrycode != undefined && item.countryregion != undefined)
//             printData(item.countrycode.iso2.toUpperCase(), scroll);
//         }
//       } else {
//         if (
//           item.countrycode != undefined &&
//           item &&
//           item.countrycode.iso2.toUpperCase() == target.toUpperCase() &&
//           item.countryregion != undefined
//         ) {
//           countryConf +=
//             !isNaN(parseInt(item.confirmed)) && item.confirmed != undefined
//               ? item.confirmed
//               : 0;
//           countryDeaths +=
//             !isNaN(parseInt(item.deaths)) && item.deaths != undefined
//               ? item.deaths
//               : 0;
//           countryRecovered +=
//             !isNaN(parseInt(item.recovered)) && item.recovered != undefined
//               ? item.recovered
//               : 0;
//         }
//       }
//     });

//     loadedData = true;
//     return await printData(target, scroll);
//   } catch (e) {
//     setTimeout(() => {
//       sendReq(lastUri, target);
//     }, 3000);

//     throw `Error #2 message -> ${e}`;
//   }
// }

// Set Value to input Country

const setCountry = async (code) => {
  let flag = document.querySelector("#bet-flags");
  let country = document.querySelector("#myInput");

  await config.countriesList.forEach((item) => {
    if (item[1] == code) {
      nameCountry = item[0];
      iso2Country = item[1];
      return (
        (flag.src = `/images/flags/${item[1]}.png`), (country.value = item[0])
      );
    }
  });
};

let toggleViewPass = false;
// Run the Ligic og APP
function init() {
  let codeCountry;
  currentCountry()
    .then((response) => {
      if (response !== "") {
        codeCountry = response.code;
        sessionStorage.setItem("data", JSON.stringify(response));
        //PARA RECUPERAR LA DATA DE SESSION Y ENVIARLA AL BACKEND
        // let r = sessionStorage.getItem('data')
        // r = JSON.parse(r)
      } else {
        codeCountry = "US";
      }
      if (document.contains(inputCountry)) {
        setCountry(codeCountry);
      }
    })
    .catch((err) => {
      setCountry("US");
      throw err;
    });
  // let preloader = document.createElement("aside");
  // preloader.id = "preloader";
  // preloader.className = "svg-preloader";
  // preloader.insertAdjacentHTML("afterbegin", `${objMods.preloader}`);
  // document.querySelector("body").appendChild(preloader);

  // Correct scroll of the list of countries at the beginning
  // document.querySelector(".searchs-container").scrollTop =
  //   document.querySelector(".searchs-container").scrollTop -
  //   parseInt(document.querySelector(".searchs-container").offsetHeight);

  //Obtain All World Data Cases
  sendReq(`../../_locales/${lng}/messages.json`, "messages");

  // sendReq("http://localhost/bet_tracker/checkIp.php", "ip");

  // modal = document.getElementById("myModal");

  // btn = document.querySelector("#btn--search");
  // btn.onclick = function () {
  //   if (!document.querySelector("#preloader")) {
  //     modal.style.display = "block";
  //     modal.querySelector(".modal-content").innerHTML = `${objMods.search}`;

  //     document.querySelector(
  //       "#covid--label"
  //     ).textContent = `${config.packMessages.one_more_country.message}`;

  //     let span = document.getElementsByClassName("close")[0];

  //     // When the user clicks on <span> (x), close the modal
  //     span.onclick = function () {
  //       modal.style.display = "none";
  //     };

  let inputCountry = document.getElementById("myInput");
  let flagCountry = document.querySelector('input[type="image"]');
  if (document.contains(inputCountry)) {
    inputCountry.onclick = function () {
      this.value = "";
      flagCountry.src = "/images/www.svg";
      autocomplete(inputCountry, config.countriesList);
    };
  }

  if (document.contains(inputCountry)) {
    document.getElementById("bet-submit").onclick = (evt) => {
      if (!verifyCountry) {
        inputCountry.value = nameCountry;
        flagCountry.src = `/images/flags/${iso2Country}.png`;
        verifyCountry = true;
      }
    };

    inputCountry.onfocus = () => {
      document
        .querySelector("#bet-country")
        .setAttribute(
          "style",
          "border-bottom: 1px var(--base-bluelight) solid;"
        );
    };
  }

  if (document.contains(inputCountry)) {
    inputCountry.onblur = () => {
      document.querySelector("#bet-country").removeAttribute("style");
    };
  }

  document.querySelector("#view-pass").onclick = function () {
    if (!toggleViewPass) {
      this.innerHTML = '<i class="far fa-eye"></i>';
      this.removeAttribute("hidde");
      this.setAttribute("view", "");
      document.querySelector("#password").type = "text";
      toggleViewPass = true;
    } else {
      this.innerHTML = '<i class="far fa-eye-slash"></i>';
      this.removeAttribute("view");
      this.setAttribute("hidde", "");
      document.querySelector("#password").type = "password";
      toggleViewPass = false;
    }
  };

  //     inputCountry.placeholder = `${config.packMessages.placeholder_search.message}`;
  //     inputCountry.focus();
  if (document.contains(inputCountry)) {
    flagCountry.onclick = (e) => {
      e.preventDefault();
      // if (inputCountry.value != "" && inputCountry.value.length > 3) {
      //   let arrIso = document.getElementsByClassName("selected--reg");
      //   let find = false;
      //   //Prevents repetition of countries
      //   for (let i = 0; i < arrIso.length; i++) {
      //     if (
      //       arrIso[i].getAttribute("data-iso") ==
      //       inputCountry.getAttribute("data-iso")
      //     ) {
      //       find = true;
      //       document
      //         .querySelector("#label--find")
      //         .insertAdjacentHTML(
      //           "afterbegin",
      //           `${inputCountry.value} ${config.packMessages.find.message}`
      //         );
      //       inputCountry.value = "";
      //       break;
      //     }
      //   }
      //   if (!find) {
      //     renderData(
      //       config.dataJson,
      //       inputCountry.getAttribute("data-iso"),
      //       false,
      //       true
      //     );
      //     span.click();
      //   } else return false;
      // } else return false;
    };
  }
  //   } else {
  //     return false;
  //   }
  // };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

window.onload = init;
