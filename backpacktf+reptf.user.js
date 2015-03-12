// ==UserScript==
// @name         backpack rep.tf integration
// @namespace    http://steamcommunity.com/id/caresx/
// @version      0.9.6
// @description  rep.tf integration for backpack.tf
// @author       cares
// @match        *://backpack.tf/profiles/*
// @match        *://backpack.tf/id/*
// @match        *://backpack.tf/u/*
// @match        *://backpack.tf/trust/*
// @match        *://backpack.tf/friends/*
// @match        *://backpack.tf/users/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require      https://cdn.rawgit.com/twbs/bootstrap/ba1345f144283d579b07cd40b5ae5a5b84d2b2e7/js/tooltip.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==

$(function () {
    var steamid = (document.querySelector('.avatar-container a').href || "").replace(/\D/g, '');
    
    if (!steamid) return;
    var groups = [];
    var bans = [];
    function spinner(name) {
        var id = name.replace(/\.|-/g, '').toLowerCase();
        groups.push("<li id='" + id + "-li' class='rep-entry' style='display: none'><small>" + name + "</small><span class='label pull-right label-default rep-tooltip' data-placement='bottom'><i class='fa fa-spin fa-spinner'></i></span></li>");
    }
    
    function addHtml() {
        spinner("Outpost");
        spinner("Bazaar");
        spinner("Scrap.tf");
        spinner("PPM");
        //spinner("TF2-Trader");
        //spinner("MCT");
        //spinner("BBG");
        $('.community-statii .stats li').last().after($(groups.join("")));
    }
    
    function ban(name, obj) {
        if (!obj.banned) return;
        
        if (obj.banned === "bad") {
            bans.push({name: name, reason: obj.message});
        }
        
        var id = name.replace(/\.|-/g, '').toLowerCase();
        var status = $('#' + id + '-li');
        if (!status.length) return;
        status.find('.rep-tooltip')
        	.removeClass('label-default')
        	.addClass("label-" + ({good: "success", bad: "danger"}[obj.banned]))
            .data('content', obj.message)
            .text({good: "OK", bad: "BAN"}[obj.banned]);
    }
    
    function handleBans(response) {
        var json = JSON.parse(response.responseText);
        
        if (!json.success) return;
 
        ban("SteamRep", json.srBans);
        ban("Outpost", json.opBans);
        ban("Bazaar", json.bzBans);
        ban("Backpack.tf", json.bptfBans);
        ban("Scrap.tf", json.stfBans);
        ban("PPM", json.ppmBans);
        ban("TF2-Trader", json.tf2tBans);
        ban("MCT", json.mctBans);
        ban("BBG", json.bbgBans);
        
        $('.rep-tooltip').tooltip({html: true, title: function () { return $(this).data('content'); }});
        $('#showrep').css('color', bans.length ? 'red' : 'green');
    }
    
    function showBansModal() {
        if (!bans.length) return;
        
        var html = "<b style='color:red'>User is banned on</b> ⋅ <a href='http://rep.tf/" + steamid + "' target='_blank'>rep.tf</a><br><br><ul>";
        bans.forEach(function (ban) {
            html += "<li><b>" + ban.name + "</b> - " + ban.reason + "</li>";
        });
        html += "</ul>";
        unsafeWindow.modal("rep.tf bans", html);
    }
    
    function showHtml(show) {
        $('.rep-entry').toggle(show);
    }
    
    $('.btn > .stm-tf2outpost').parent().after('<a class="btn btn-primary btn-xs" href="http://rep.tf/' + steamid + '" target="_blank" style="margin-left: 4px">rep.tf</a>');
    $('small:contains(Community)').html('Community <a id="showrep" style="font-size: 13px; cursor: pointer;">+</a>');
    
    var bansShown = false;
    $('#showrep').on('click', function (e) {
        var $this = $(this),
            open = $this.text() === '+';
        
        if (open) {
            if (!bansShown) {
                showBansModal();
                bansShown = true;
            }
            
            showHtml(true);
            $this.text('-');
        } else {
            $this.text('+');
            showHtml(false);
        }
    });
    
    addHtml();
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://rep.tf/api/bans?str=" + steamid,
        onload: handleBans
    });
});
