var CATEGORY_LIST = {
    unknown : { name : "???"},
    xml3d: { name: "XML3D" },
    xflow : { name: "Xflow"}
}

var LESSON_LIST = {
    basic : { name : "The Basics of XML3D", cat: "xml3d", steps: 3,
            info: "Get to know the basic concepts of XML3D: " +
                  "3D geometry, transform hierarchie, viewpoints, shaders and lightsources."}
}

var CURRENT_LESSON = null;
var CURRENT_STEP = null;
var CURRENT_CATEGORY = null;

var pagePattern = /.*\/([^/]+)-(\d+)[.]x?html/

function initPage(){

    for(var key in LESSON_LIST){
        LESSON_LIST[key].key = key;
        LESSON_LIST[key].startUrl = "lessons/" + key + "/" + key + "-0.html";
        LESSON_LIST[key].urlPrefix =  "lessons/" + key + "/" + key;
    }

    var url = window.location.href;
    var matches = url.match(pagePattern);
    if(matches){
        CURRENT_LESSON = LESSON_LIST[matches[1]];
        CURRENT_CATEGORY = CATEGORY_LIST[CURRENT_LESSON.cat];
        CURRENT_STEP = matches[2];
    }

    window.LINK_PREFIX = "";
    if(CURRENT_LESSON){
        window.LINK_PREFIX= "../../";
    }

    if(window.PAGE_INDEX){
        buildIndex();
    }

    buildNavigation();

    var header = $('<div id="header" ><h1><a href="'+ LINK_PREFIX + 'index.html" >Tutorials</a></h1><h2></h2><h3></h3></div>')
    $(document.body).prepend(header);
    var footer = $('<div id="footer" ></div>')
    $(document.body).append(footer);

    if(CURRENT_LESSON){
        header.find("h2").text( CURRENT_CATEGORY.name);
        header.find("h3").text( CURRENT_LESSON.name);

        $("#content h1").after(createStepList());
        $("#content").append(createStepList());
    }
    else{
        header.find("h2").hide();
        header.find("h3").hide();
    }


    document.title = "XML3D Tutorial: " + (CURRENT_LESSON ? CURRENT_LESSON.name : "Index");
}

function createStepList(){
    var result = $('<ul class="stepList"></ul>');
    if(CURRENT_STEP > 0)
        result.append($('<li><a href="' + getStepUrl(CURRENT_STEP*1-1) +'" >&lt;&lt;</a></li>'));
    else
        result.append($('<li class="pseudo">&lt;&lt;</li>'));

    for(var i = 0; i < CURRENT_LESSON.steps; ++i){
        var entry = $('<li><a href="' + LINK_PREFIX + CURRENT_LESSON.urlPrefix + '-' + i + '.html" >' + (i+1) + '</a></li>');
        if(i == CURRENT_STEP) entry.addClass("current");
        result.append(entry);
    }
    if(CURRENT_STEP < CURRENT_LESSON.steps-1)
        result.append($('<li><a href="' + getStepUrl(CURRENT_STEP*1+1) +'" >&gt;&gt;</a></li>'));
    else
        result.append($('<li class="pseudo">&gt;&gt;</li>'));

    return result;
}

function getStepUrl(step){
    return LINK_PREFIX + CURRENT_LESSON.urlPrefix + '-' + step + '.html';
}


function buildIndex(){
    var content = $("#content");
    var container = $('<div id="start" ></div>');
    var list = buildTestList();
    container.append(list);
    content.append(container);
}

function buildNavigation(){
    var navi = $('<div id="navigation" ></div>');
    navi.append($("<h4>Navigation</h4>"));

    function adjustNavi(){
        navi.height($(document.body).hasClass("navi_hidden") ? 43 : $(window).height() - 8);
    }

    navi.find("h4").click(function(){
        $(document.body).toggleClass("navi_hidden");
        adjustNavi();
    });
    $(window).bind('resize', adjustNavi);
    adjustNavi();

    var inner = $('<div class="inner"></div>');
    navi.append(inner);
    var naviList = buildTestList();
    inner.append(naviList);


    var indexEntry = $('<li class="entry"><a href="' + LINK_PREFIX + 'index.html">Index</a></li>');
    if(!CURRENT_LESSON) indexEntry.addClass("current");
    naviList.prepend(indexEntry);

    $(document.body).prepend(navi);
}

function buildTestList(){
    var naviList = $('<ul class="main" ></ul>');

    for(var i in CATEGORY_LIST)
        CATEGORY_LIST[i].lessons = [];

    for(var i in LESSON_LIST){
        (CATEGORY_LIST[LESSON_LIST[i].cat] || CATEGORY_LIST.unknown).lessons.push(LESSON_LIST[i]);
    }

    for(var catId in CATEGORY_LIST){
        var cat = CATEGORY_LIST[catId];
        if(cat.lessons.length == 0)
            continue;
        var header = $('<li><h5>' + cat.name + '</h5></li>');
        var list = $('<ul class="sub" ></ul>');
        for(var i in cat.lessons){
            var entry = cat.lessons[i];
            var domEntry = $('<li class="entry"><a href="' + LINK_PREFIX + entry.startUrl + '">' + entry.name + '</a><span class="info">' +
                ( entry.info || "" ) + '</span></li>');
            if(entry == CURRENT_LESSON)
                domEntry.addClass("current");

            list.append(domEntry)

        }
        header.append(list);
        naviList.append(header);
    }

    return naviList;
}

function initHighlight(){
    if(CURRENT_LESSON){
        var link = $('<link rel="stylesheet" href="../../style/highlight/github.css">');
        var script = $('<script type="text/javascript" src="../../script/highlight.pack.js"></script>');

        $(document.head).append(link);
        $(document.head).append(script);
    }

}

function unescapeHtml(html){
    return html.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">");
}

var c_whiteSpaceStart = /^(\s*)/;

var c_htmlPre = '<!DOCTYPE html>' + "\n" +
                '<html>' + "\n" +
                '<head>' + "\n" +
                '  <title>XML3D Example</title>' + "\n" +
                '  <script type="text/javascript" src="../../script/xml3d.js"></script>' + "\n" +
                '  <link rel="stylesheet" type="text/css" media="all" href="../../style/example.css"/>' + "\n" +
                '</head>' + "\n" +
                '<body>';
var c_htmlPost ='</body>' + "\n" +
                '</html>';


function initCodeExamples(){
    $("tag").each(function(index,element){
        $(element).text("<" + element.innerHTML + ">");
    });

    var examples = $(".exampleCode").each(function(index, element){

        var code = element.innerHTML;
        element = $(element);

        element.empty();
        var iframeHeight = element.attr("data-iframe-height");
        var lines = code.split("\n");
        while(lines.length && lines[0].match(/^\s*$/))
            lines.shift();
        while(lines.length && lines[lines.length-1].match(/^\s*$/))
            lines.pop();
        var firstLineMatch = lines[0].match(c_whiteSpaceStart);
        var skipString = firstLineMatch[1], skipLength = skipString.length;
        var visible = true;
        var parts = [];
        var part = {visible: true, code: "", mark: false};
        var encode = false, mark = false;
        var cleanedCode = "";
        for(var i = 0; i < lines.length; ++i){
            var line = lines[i];
            if(line.indexOf("====") != -1){
                var setVisible = (line.indexOf("HIDE") == -1);
                encode = (line.indexOf("ENCODE") != -1);
                var setMark = (line.indexOf("MARK") != -1)
                if(visible != setVisible || mark != setMark){
                    visible = setVisible;
                    mark = setMark;
                    if(part.code.length > 0){
                        parts.push(part);
                        part = {visible: setVisible, code: "", mark: mark};
                    }
                    else{
                        part.visible = setVisible;
                        part.mark = setMark;
                    }

                }
            }
            else{
                var codeLine = line.substr(skipLength) + "\n";
                if(encode)
                    codeLine = unescapeHtml(codeLine);
                part.code += codeLine;
                cleanedCode += codeLine + "\n";
            }
        }
        parts.push(part);
        var preElement = $("<pre></pre>");

        for(var i = 0; i < parts.length; ++i){
            var codeElement = $("<code></code>");
            codeElement.html( hljs.highlightAuto(parts[i].code).value);
            preElement.append(codeElement);
            if(!parts[i].visible){
                codeElement.addClass("hiddenCode");
                preElement.append('<code class="hiddenCodeReplace" >...</code>');
            }
            if(parts[i].mark)
                codeElement.addClass("marked");
            console.log(parts[i].code);
            console.log("-------------");
        }
        preElement.find(".hiddenCode").hide();
        preElement.find(".hiddenCode").click(function(){
            preElement.find(".hiddenCode").hide();
            preElement.find(".hiddenCodeReplace").show();
        });
        preElement.find(".hiddenCodeReplace").click(function(){
            preElement.find(".hiddenCodeReplace").hide();
            preElement.find(".hiddenCode").show();
        });

        element.append(preElement);

        if(element.hasClass("live")){

            var result = $('<div class="result" ></div>');
            var iframe = $("<iframe></iframe>");
            result.append(iframe);
            element.prepend(result);
            if(iframeHeight){
                iframe[0].style.height = iframeHeight +"px";
                preElement[0].style.minHeight = iframeHeight + "px";
            }

            var iframeDoc = iframe[0].contentWindow.document;
            iframeDoc.open('text/html', 'replace');

            var html = cleanedCode;

            if(html.indexOf('<html>') == -1)
                html = c_htmlPre + html + c_htmlPost;

            iframeDoc.write(html);
            iframeDoc.close();
        }
    });
}



$(function(){
    initPage();
    initHighlight();
    initCodeExamples();
});
