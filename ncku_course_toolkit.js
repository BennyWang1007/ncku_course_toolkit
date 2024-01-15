// ==UserScript==
// @name         ncku course toolkit
// @namespace    Benny
// @version      Alpha-v1
// @description  Toolkit for ncku course
// @author       Benny, Wang
// @homepage     https://github.com/BennyWang1007
// @match        https://course.ncku.edu.tw/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==

// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @run-at      document-idle
// ==/UserScript==

(function () {
    ("use strict");

    // -----------------variable-----------------

    let total_time = [];
    let unavail_courses = [];
    let pe_courses = {
        male: [],
        female: [],
        freshman: [],
        sophomore: [],
        schoolTeam: [],
    };
    let full_courses = [];
    let settingData = {
        hide_unavailable: true,
        hide_full: false,
        hide_pe_male: false,
        hide_pe_female: false,
        hide_pe_freshman: false,
        hide_pe_sophomore: false,
        hide_pe_schoolTeam: false,
        auto_registrate: false,
        unavailable_int: [],
        target_courses: [],
        addBtn: true,
        positionTop: 0,
        positionLeft: "0",
        positionRight: "auto",
    };

    // -----------------variable-----------------

    // -----------------main-----------------

    // check if user data exist
    let nct_userData = GM_getValue("nct_userData");
    if (!nct_userData) {
        nct_userData = { ...settingData };
    }

    // update local data
    for (let value in settingData) {
        if (!nct_userData.hasOwnProperty(value)) {
            nct_userData[value] = settingData[value];
        }
    }

    addBtn();
    let btn_node = document.getElementById("black_node");
    qxinStart();

    GM_registerMenuCommand("ncku course setting", setMenu);

    // unavail_time_int = nct_userData.unavailable_int;

    get_pe_courses();
    get_full_courses();

    save_and_display();
    registrate_course();

    // -----------------main-----------------

    let timer = setTimeout(function () {
        if (nct_userData.auto_registrate) {
            window.location.reload();
        }
    }, 5000);

    function registrate_course() {
        if (!nct_userData.auto_registrate) return;
        if (!nct_userData.target_courses.length) return;
        for (const ele of document.querySelectorAll("td")) {
            let reg_button = null;
            for (let cono of nct_userData.target_courses) {
                if (ele.textContent.includes(cono)) {
                    reg_button = ele.parentNode.querySelectorAll(
                        'button[class="btn btn-info btn-sm btn-add-course"]'
                    )[0];
                    break;
                }
            }
            // console.log(reg_button);
            if (reg_button) {
                reg_button.click();
                break;
            }
        }
    }
            
            

    // function set_unavail_int(unavail_time_str) {
    //     let unavail_time = unavail_time_str.split(',');
    //     unavail_time_int = [];
    //     for (let i = 0; i < unavail_time.length; i++) {
    //         let temp_pair = [];
    //         if (unavail_time[i].includes('~')) {
    //             temp_pair = unavail_time[i].split('~');
    //             for (let j = parseInt(temp_pair[0]); j <= parseInt(temp_pair[1]); j++) {
    //                 unavail_time_int.push(j);
    //             }
    //         }
    //         else {
    //             if (unavail_time === "") continue;
    //             unavail_time_int.push(parseInt(unavail_time[i]));
    //         }
    //     }
    // }

    function set_total_time(unavail_time_int2) {
        let total_time2 = [];
        const toChar = (num) => {
            if (num >= 10) return String.fromCharCode(55 + num);
            return num.toString();
        };
        const class_str = (day, start, end) => {
            if (start < 0 || end > 15) return null;
            if (start === end) return `[${day}]${toChar(start)}`;
            else return `[${day}]${toChar(start)}~${toChar(end)}`;
        };

        for (let i = 0; i < unavail_time_int2.length; i++) {
            let day = parseInt(unavail_time_int2[i] / 10);
            let n = unavail_time_int2[i] % 10;
            total_time2.push(class_str(day, n, n));

            total_time2.push(class_str(day, n - 1, n));
            total_time2.push(class_str(day, n, n + 1));

            total_time2.push(class_str(day, n - 2, n));
            total_time2.push(class_str(day, n - 1, n + 1));
            total_time2.push(class_str(day, n, n + 2));
        }
        total_time2 = total_time2.filter((ele) => ele !== null);
        total_time = [...new Set(total_time2)];
    }

    function set_unavail_courses() {
        unavail_courses = [];
        let cnt = 0;
        document.querySelectorAll("tr").forEach((ele) => {
            if (total_time.some((time) => ele.textContent.includes(time))) {
                unavail_courses.push(ele);
                cnt++;
            }
        });
        // console.log("find " + cnt + " unavial courses");
    }

    function get_pe_courses() {
        for (const e of document.querySelectorAll("tr")) {
            if (e.textContent.includes("一年級體育")) pe_courses.freshman.push(e);
            if (e.textContent.includes("二年級體育")) pe_courses.sophomore.push(e);
            if (e.textContent.includes("校代表隊")) pe_courses.schoolTeam.push(e);
            if (e.textContent.includes("男生組")) pe_courses.male.push(e);
            if (e.textContent.includes("女生組")) pe_courses.female.push(e);
        }
    }

    function show_pe_courses() {
        pe_courses.freshman.forEach((ele) => (ele.style.display = ""));
        pe_courses.sophomore.forEach((ele) => (ele.style.display = ""));
        pe_courses.schoolTeam.forEach((ele) => (ele.style.display = ""));
        pe_courses.male.forEach((ele) => (ele.style.display = ""));
        pe_courses.female.forEach((ele) => (ele.style.display = ""));
    }

    function hide_pe_courses() {
        if (nct_userData.hide_pe_freshman) {
            pe_courses.freshman.forEach((e) => (e.style.display = "none"));
        }
        if (nct_userData.hide_pe_sophomore) {
            pe_courses.sophomore.forEach((e) => (e.style.display = "none"));
        }
        if (nct_userData.hide_pe_schoolTeam) {
            pe_courses.schoolTeam.forEach((e) => (e.style.display = "none"));
        }
        if (nct_userData.hide_pe_male) {
            pe_courses.male.forEach((e) => (e.style.display = "none"));
        }
        if (nct_userData.hide_pe_female) {
            pe_courses.female.forEach((e) => (e.style.display = "none"));
        }
    }

    function get_full_courses() {
        document.querySelectorAll("tr").forEach((e) => {
            if (e.textContent.includes("額") && e.textContent.includes("滿")) {
                full_courses.push(e);
            }
        });
    }

    function hide_full_courses() {
        if (!nct_userData.hide_full || !full_courses.length) return;
        full_courses.forEach((ele) => (ele.style.display = "none"));
    }

    function show_full_courses() {
        if (!full_courses.length) return;
        full_courses.forEach((ele) => (ele.style.display = ""));
    }

    function hide_unavail() {
        if (!nct_userData.hide_unavailable || !unavail_courses.length) return;
        unavail_courses.forEach((ele) => (ele.style.display = "none"));
    }

    function show_unavail() {
        if (!unavail_courses.length) return;
        unavail_courses.forEach((ele) => (ele.style.display = ""));
    }
    
    // set all variables of unavail
    function set_unavail(unavail_time_int2) {
        set_total_time(unavail_time_int2);
        show_unavail();
        set_unavail_courses();
        hide_unavail();
    }

    function qxinStart() {
        addDragEven();
        // setBtnClick();
        document.querySelector("#rwl-setbtn").addEventListener("click", setMenu);
        if (nct_userData.addBtn) btn_node.checked = true;
    }

    // 設置按鈕
    function addBtn() {
        var node = document.createElement("course_toolkit_window");
        node.id = "rwl-iqxin";
        node.className = "rwl-exempt";

        var screenClientHeight = document.documentElement.clientHeight;
        var tempHeight;
        if (nct_userData.positionTop > screenClientHeight) {
            tempHeight = screenClientHeight - 40;
        } else {
            tempHeight = nct_userData.positionTop;
        }
        // window resize
        window.onresize = function () {
            var screenClientHeight = document.documentElement.clientHeight;
            var tempHeight;

            if (nct_userData.positionTop > screenClientHeight) {
                tempHeight = screenClientHeight - 40;
            } else {
                tempHeight = nct_userData.positionTop;
            }

            node.style.top = tempHeight + "px";
        };

        tempHeight = tempHeight < 0 ? 0 : tempHeight;
        node.style.cssText =
            `position:fixed;top:${tempHeight}px;` +
            `left:${nct_userData.positionLeft}px;` +
            `right:${nct_userData.positionRight}px;`;
        node.innerHTML = '<qxinbutton type="qxinbutton" id="rwl-setbtn"> set </qxinbutton> <lalala style="cursor:move; font-size:12px;">設定</lalala> <input type="checkbox" name="" id="black_node" >';
        if (window.self === window.top) {
            if (document.querySelector("body")) {
                document.body.appendChild(node);
            } else {
                document.documentElement.appendChild(node);
            }
        }
        node.addEventListener("mouseover", function () {
            node.classList.add("rwl-active-iqxin");
        });
        // node.addEventListener("mouseleave",function(){
        //     setTimeout(function(){
        //         node.classList.remove("rwl-active-iqxin");
        //         black_check(black_node.checked);
        //     },100)
        // });

        var style = document.createElement("style");
        style.type = "text/css";

        var styleInner =
            "#rwl-iqxin{" +
                "position:fixed;" +
                "transform:translate(-95%,0);" +
                "width:85px;" +
                "height:25px;" +
                "font-size:12px;" +
                "font-weight: 500;" +
                "font-family:Verdana, Arial, '宋体';" +
                "color:#fff;" +
                "background:#333;" +
                "z-index:2147483647;" +
                "margin: 0;" +
                "opacity:0.05;" +
                "transition:0.3s;" +
                "overflow:hidden;" +
                "user-select:none;" +
                "text-align:center;" +
                "white-space:nowrap;" +
                "line-height:25px;" +
                "padding:0 16px;" +
                "border:1px solid #ccc;" +
                "border-width:1px 1px 1px 0;" +
                "border-bottom-right-radius:5px;" +
                "box-sizing: content-box;" +
            "}" +
            "#rwl-iqxin input{" +
                "margin: 0;" +
                "padding: 0;" +
                "vertical-align:middle;" +
                "-webkit-appearance:checkbox !important;" +
                "-moz-appearance:checkbox;" +
                "position: static;" +
                "clip: auto;" +
                "opacity: 1;" +
                "cursor: pointer;" +
            "}" +
            "#rwl-iqxin.rwl-active-iqxin{" +
                "left: 0px;" +
                "transform:translate(0,0);" +
                "opacity: 0.9;" +
                "height: 32px;" +
                "line-height: 32px" +
            "}" +
            "#rwl-iqxin label{" +
                "margin:0;" +
                "padding:0;" +
                "font-weight:500;" +
            "}" +
            "#rwl-iqxin #rwl-setbtn{" +
                "margin: 0 4px 0 0;" +
                "padding: 0 0 0 4px;" +
                "border: none;" +
                "border-radius: 2px;" +
                "cursor: pointer;" +
                "background: #fff;" +
                "color: #000;" +
            "} ";
        if (!nct_userData.addBtn) {
            var styleTemp = "#rwl-iqxin{display:none}";
            style.innerHTML = styleInner + styleTemp;
        } else {
            style.innerHTML = styleInner;
        }
        if (document.querySelector("#rwl-iqxin")) {
            document.querySelector("#rwl-iqxin").appendChild(style);
        } else {
            GM_addStyle(styleInner);
        }
    }

    // open setting menu
    function setMenu() {
        var oldEditBox = document.querySelector("#rwl-setMenu");
        if (oldEditBox) {
            oldEditBox.parentNode.removeChild(oldEditBox);
            return;
        }
        
        let d = nct_userData; // alias
        
        // debug();

        var odom = document.createElement("div");
        odom.id = "rwl-setMenu";
        odom.style.cssText =
            "position: fixed;" +
            "top: 100px;" +
            "left: 50px;" +
            "padding: 10px;" +
            "background: #fff;" +
            "border-radius: 4px;";
        GM_addStyle(
            "#rwl-setMenuSave, #rwl-reset, #rwl-setMenuClose, #rwl-getRegistedCourses{" +
                "margin: 0;" +
                "padding: 0 2px;" +
                "border: none;" +
                "border-radius: 2px;" +
                "cursor: pointer;" +
                "background: #fff;" +
                "color: #000;" +
            "}" +
            "#rwl-reset{ border: 1px solid #666; }" +
            "#rwl-setMenuSave{ border: 1px solid green; }" +
            "#rwl-setMenuClose{ border: 1px solid red; }" +
            "#rwl-getRegistedCourses{ border: 1px solid blue; }" +
            "#rwl-setMenu{" +
                "text-align:left;" +
                "font-size:14px;" +
                "z-index:999999;" +
                "border: 1px solid cornflowerblue;" +
            "}" +
            "#rwl-setMenu p{ margin:5px auto; }" +
            "#auto_registrate { float: right; }"
        );
        let innerH = `<div class='center'>
        <p>設定列表</p>
        <p> <label> 顯示設置(不熟勿動)<input id='btnchecked' type='checkbox' ${
            d.addBtn ? "checked" : ""
        } title="點擊腳本設定可重新開啟" </label></p>
        <p>隱藏 不可用時段<input id='hide_unavailable' type='checkbox' ${
            d.hide_unavailable ? "checked" : ""
        }>額滿時段<input id='hide_full' type='checkbox' ${
            d.hide_full ? "checked" : ""
        }></p>
        <p>PE  男 <input id='hide_pe_male' type='checkbox' ${
            d.hide_pe_male ? "checked" : ""
        }>女<input id='hide_pe_female' type='checkbox' ${
            d.hide_pe_female ? "checked" : ""
        }>大一<input id='hide_pe_freshman' type='checkbox' ${
            d.hide_pe_freshman ? "checked" : ""
        }>大二<input id='hide_pe_sophomore' type='checkbox' ${
            d.hide_pe_sophomore ? "checked" : ""
        }>校隊<input id='hide_pe_schoolTeam' type='checkbox' ${
            d.hide_pe_schoolTeam ? "checked" : ""
        }></p>
        <p>&nbsp&nbsp&nbsp一  二  三  四  五</p>`;
        for (let i = 1; i < 11; i++) {
            innerH += "<p>" + (i == 10 ? "A" : i.toString());
            for (let j = 1; j < 6; j++) {
                let chk = d.unavailable_int.includes(10 * j + i) ? "checked" : "";
                innerH += `&nbsp<input type="checkbox" id="unavail${(10*j +i).toString()}" ${chk}></input>`;
            }
            innerH += "</p>";
        }
        innerH +=
            "<qxinbutton id='rwl-reset'>重設</qxinbutton> &nbsp;&nbsp;&nbsp;" +
            "<qxinbutton id='rwl-setMenuSave'>儲存</qxinbutton> &nbsp;&nbsp;&nbsp;" +
            "<qxinbutton id='rwl-setMenuClose' onclick='this.parentNode.parentNode.removeChild(this.parentNode);' title='' >關閉</qxinbutton> &nbsp;&nbsp;&nbsp;" +
            "<qxinbutton id='rwl-getRegistedCourses' title='請先移至已選課程清單'>取得已選課程</qxinbutton>" +
            "<p>目標課程代碼 <input id='target_courses' type='text' value='" +
            d.target_courses +
            "'></input>&nbsp;&nbsp;&nbsp" +
            "<input id='auto_registrate' type='checkbox' " +
            (d.auto_registrate ? "checked" : "") +
            "></input></p>" +
            "</div>";
        odom.innerHTML = innerH;
        document.body.appendChild(odom);

        document
            .querySelector("#rwl-setMenuSave")
            .addEventListener("click", saveSetting);
        document
            .querySelector("#rwl-setMenuClose")
            .addEventListener("click", closeMenu);
        document
            .querySelector("#rwl-reset")
            .addEventListener("click", rwlReset);
        document
            .querySelector("#rwl-getRegistedCourses")
            .addEventListener("click", get_registed_courses);
    }

    function saveSetting() {
        nct_userData.unavailable_int = [];
        for (let i = 11; i < 61; i++) {
            if (document.querySelector("#rwl-setMenu #unavail" + i.toString()).checked) {
                nct_userData.unavailable_int.push(i);
            }
        }
        nct_userData.hide_unavailable = document.querySelector("#rwl-setMenu #hide_unavailable").checked;
        nct_userData.hide_full = document.querySelector("#rwl-setMenu #hide_full").checked;
        nct_userData.addBtn = document.querySelector("#rwl-setMenu #btnchecked").checked;
        nct_userData.hide_pe_male = document.querySelector("#rwl-setMenu #hide_pe_male").checked;
        nct_userData.hide_pe_female = document.querySelector("#rwl-setMenu #hide_pe_female").checked;
        nct_userData.hide_pe_freshman = document.querySelector("#rwl-setMenu #hide_pe_freshman").checked;
        nct_userData.hide_pe_sophomore = document.querySelector("#rwl-setMenu #hide_pe_sophomore").checked;
        nct_userData.hide_pe_schoolTeam = document.querySelector("#rwl-setMenu #hide_pe_schoolTeam").checked;
        nct_userData.target_courses = document.querySelector("#rwl-setMenu #target_courses").value.split(',');
        nct_userData.auto_registrate = document.querySelector("#rwl-setMenu #auto_registrate").checked;
        
        save_and_display();
        closeMenu();
    }

    // event of reset button
    function rwlReset() {
        nct_userData = { ...settingData };
        save_and_display();
        closeMenu();
        setMenu();
    }

    function get_registed_courses() {
        let registed_courses = [];
        let eles = [];
        [...document.getElementsByClassName("data-td vm td_bg1")].forEach((e) => {
            if (e.dataset.title == "時間" && e.textContent.includes("星期")) {
                eles.push(e);
            }
        });
        [...document.getElementsByClassName("data-td vm td_bg2")].forEach((e) => {
            if (e.dataset.title == "時間" && e.textContent.includes("星期")) {
                eles.push(e);
            }
        });
        for (const ele of eles) {
            let course_time = 0;
            let start_time = 0;
            let end_time = 0;
            if (ele.textContent.includes("一")) {
                course_time = 10;
            } else if (ele.textContent.includes("二")) {
                course_time = 20;
            } else if (ele.textContent.includes("三")) {
                course_time = 30;
            } else if (ele.textContent.includes("四")) {
                course_time = 40;
            } else if (ele.textContent.includes("五")) {
                course_time = 50;
            }
            if (ele.textContent.includes("~")) {
                start_time = parseInt(ele.textContent[4]);
                end_time = parseInt(ele.textContent[6]);
            } else {
                start_time = parseInt(ele.textContent[4]);
                end_time = start_time;
            }
            // console.log(course_time, start_time, end_time);
            for (let i = start_time; i <= end_time; i++) {
                registed_courses.push(course_time + i);
            }
        }
        if (registed_courses.length === 0) {
            alert("請先移至已選課程清單");
        } else {
            registed_courses.sort();
            nct_userData.unavailable_int = registed_courses;
            GM_setValue("nct_userData", nct_userData);
        }
        save_and_display();
        closeMenu();
        setMenu();
    }

    function save_and_display() {
        show_pe_courses();
        show_full_courses();
        set_unavail(nct_userData.unavailable_int);
        hide_pe_courses();
        hide_full_courses();
        GM_setValue("nct_userData", nct_userData);
    }

    function closeMenu() {
        var oldEditBox = document.querySelector("#rwl-setMenu");
        if (oldEditBox) {
            oldEditBox.parentNode.removeChild(oldEditBox);
            return;
        }
    }

    function addDragEven() {
        setTimeout(function () {
            try {
                dragBtn();
            } catch (e) {
                console.error("dragBtn error");
            }
        }, 1000);
    }

    // add drag event function
    function dragBtn() {
        var rwl_node = document.querySelector("#rwl-iqxin");
        rwl_node.addEventListener("mousedown", function (event) {
            rwl_node.style.transition = "null";
            var disX = event.clientX - rwl_node.offsetLeft;
            var disY = event.clientY - rwl_node.offsetTop;

            var move = function (event) {
                rwl_node.style.left = event.clientX - disX + "px";
                rwl_node.style.top = event.clientY - disY + "px";
            };

            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", function () {
                rwl_node.style.transition = "0.3s";
                document.removeEventListener("mousemove", move);
                rwl_node.style.right = nct_userData.positionRight = "auto";
                rwl_node.style.left = nct_userData.positionLeft = 0;
                nct_userData.positionTop = rwl_node.offsetTop;
                GM_setValue("nct_userData", nct_userData);
            });
        });
    }

    function debug() {
        console.log("--------debug--------");
        console.log("total_time", total_time);
        console.log("unavail_courses", unavail_courses);
        console.log("pe_courses", pe_courses);
        console.log("full_courses", full_courses);
        console.log("settingData", settingData);
        console.log("nct_userData", nct_userData);
        console.log("---------------------");
    }
    // debugger;
})();

