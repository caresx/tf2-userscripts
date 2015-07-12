// ==UserScript==
// @name         FoG forum search on steamrep.com
// @namespace    http://steamcommunity.com/id/caresx/
// @author       cares
// @version      1.0.0
// @match        *://steamrep.com/*
// @grant        none
// ==/UserScript==

$('.quicktoolbox.qbright .action:last a').text('FoG Forum').attr('href', '##').click(function (e) {
    var form = document.createElement('form');
    form.setAttribute('action', 'http://forums.f-o-g.eu/search.php?do=process');
    form.setAttribute('method', 'POST');
    form.setAttribute('target', '_blank');

    e.preventDefault();

    var params = {query: g_SteamID64, titleonly: 0, searchuser: '', exactname: 1, tag: '', dosearch: 'Search+Now', searchdate:0, beforeafter: 'after', sortby: 'relevance', order: 'descending', s: '', securitytoken: 'guest', do: 'process', searchthreadid: ''};

    for (var key in params) {
        var input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", key);
        input.setAttribute("value", params[key]);

        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
});
