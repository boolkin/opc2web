var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };
    xhr.send();
};
setInterval(function() {
    getJSON('http://localhost:45455', function(err, data) {
        var taglist = "";
        var state = "red";
        var speed = parseFloat(data.tag0.replace(",", ".")); // скорость передается нулевым тэгом
        if (speed > 0) {
            state = "green";
            document.querySelector("link[rel*='icon']").href = "img/green.png"; //меняется иконка сайта если скорость больше нуля
        } else {
            state = "red";
            document.querySelector("link[rel*='icon']").href = "img/red.png"; //меняется иконка сайта если скорость меньше нуля
        }
        for (key in data) {
            let value = '';
            var elem = document.getElementById(key); // проходимся по JSON строке и проверяем есть ли на странице элементы которые передаются с сервера 
            if (elem) {
                if (data[key] == "true") {
                    document.getElementById(key).className = "ctrue";
                    value = "T";
                } else if (data[key] == "false") {
                    document.getElementById(key).className = "cfalse";
                    value = "F";
                } else value = Math.round(parseFloat(data[key].replace(",", ".")));
                document.getElementById(key).innerHTML = value; // если есть такой элемент с ключем, то записываем в него значение 
                //if (key = "tag7") document.getElementById(key).innerHTML = data[key]; // Толщина, то есть 7 тэг нужно отображать без округления
            } else {
                taglist = taglist + "<span id='" + key + "' onmouseover = showid(this.id)>" + key + ":" + data[key] + " | </span> "; //если элемента нет, то создаем его внизу в специальном блоке 
                tagspanel.innerHTML = taglist;
            }
        }
        document.getElementById("pole0").style.backgroundColor = state;
    });
}, 1000);
var i = 0; // Глобальная переменная котороя хранит в себе порядковый номер тэга который будет добален при следующем вызове функции addDiv
var j = 0;
// Функция добавления блока тэга, котороя вызывается при двойном щелчке по большому блоку
function addDiv(obj) {
    let div = document.createElement('div');
    div.className = "newdiv";
    i = document.getElementById('tagindex').value;
    div.innerHTML = "<span class='tagnames' contenteditable='true'>tagname" + i + "</span><br><div class='tagvals' id='tag" + i + "'>" + i + "</div><span contenteditable='true'> mm</span>";
    document.getElementById(obj).append(div);
    i++;
    document.getElementById('tagindex').value = i;
    document.getElementById("context-menu").classList.remove("active");
    addTagIdListener();
}
// Функция добавления большого блока куда будут помещаться блоки тэгов. Функция вызывается при клике по плюсику вверху страницы
function addBigDiv() {
    let elements = document.querySelectorAll('div.bigdiv');
    j = elements.length;
    let last = document.getElementById(elements[elements.length - 1].id)
    let div = document.createElement('div');
    div.className = "bigdiv";
    div.id = "pole" + j;
    div.innerHTML = "<div class ='hd' contenteditable='true'>Header</div>";
    last.after(div);
    addListenerBigDiv();
}

function showid(tag) {
    document.getElementById('idfield').innerHTML = tag;
}

function savecode() {
    localStorage.setItem('Web_blocks_opc', document.getElementById('workpanel').innerHTML);
    alert("Сохранен на локальной машине");
}

function showtextarea() {
    workpanel.innerHTML = "<textarea rows='10' cols='100' id='import'></textarea><br><input type='button' onclick='importcode ()' value='Импортировать'> <a target='_blank' href='http://localhost/server_screen.txt'> Взять экран с сервера</a> <br><a href='http://localhost/editor.html'> Назад</a> ";
}

function importcode() {
    localStorage.setItem('Web_blocks_opc', document.getElementById('import').value);
    setTimeout(document.location.reload(true), 0);
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}

function colordiv(el) {
    el.style.backgroundColor = document.getElementById("picker").style.backgroundColor;
    document.getElementById("context-menu").classList.remove("active");
}

function delel(el) {
	if (el.id != "pole0") {
        el.remove();
		document.getElementById("context-menu").classList.remove("active");
    }
}

function moveleft(divid) {
	console.log(divid);
    let thisdiv = document.getElementById(divid);
    let contentBuf = thisdiv.innerHTML;
    let styleBuf = thisdiv.getAttribute('style');
    if (thisdiv.previousElementSibling != null) prevdiv = thisdiv.previousElementSibling;
    else prevdiv = thisdiv.nextElementSibling;
    thisdiv.innerHTML = prevdiv.innerHTML;
    thisdiv.setAttribute('style', prevdiv.getAttribute('style'));
    prevdiv.innerHTML = contentBuf;
    prevdiv.setAttribute('style', styleBuf);
    document.getElementById("context-menu").classList.remove("active");
}

function addListenerBigDiv() {
    let elem = document.getElementsByClassName("bigdiv");
    [].forEach.call(elem, function(el) {
        el.addEventListener("contextmenu", function(event) {
            event.preventDefault();
            var cm = document.getElementById("context-menu");
            cm.style.top = (event.clientY +cm.offsetHeight > window.innerHeight) ? window.innerHeight - cm.offsetHeight + "px" : event.clientY + "px";
            cm.style.left = (event.clientX + cm.offsetWidth > window.innerWidth) ? window.innerWidth - cm.offsetWidth + "px" : event.clientX +"px";
            cm.classList.add("active");
            cidel.innerHTML = "  Delete " + el.id;
            cicc.setAttribute('onclick', 'colordiv(' + el.id + ')');
            ciml.setAttribute('onclick', 'moveleft(\'' + el.id + '\')');
            ciat.setAttribute('onclick', 'addDiv(\'' + el.id + '\')');
            cidel.setAttribute('onclick', 'delel(' + el.id + ')');
        });
    });
}

//window.addEventListener("click", function(){
//	document.getElementById("context-menu").classList.remove("active");	
//});
function addTagIdListener() {
    let elem = document.getElementsByClassName("tagvals");
    [].forEach.call(elem, function(el) {
        el.addEventListener("mouseenter", function(event) {
            document.getElementById('idfield').innerHTML = el.id;
        });
    });
}