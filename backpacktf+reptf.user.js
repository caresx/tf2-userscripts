// ==UserScript==
// @name         backpack rep.tf integration
// @namespace    http://steamcommunity.com/id/caresx/
// @version      0.9.3
// @description  rep.tf integration for backpack.tf
// @author       cares
// @match        *://backpack.tf/profiles/*
// @match        *://backpack.tf/id/*
// @match        *://backpack.tf/u/*
// @match        *://backpack.tf/trust/*
// @match        *://backpack.tf/friends/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

$(function () {
    var steamid = (document.querySelector('.avatar-container a').href || "").replace(/\D/g, '');
    
    if (!steamid) return;
    var groups = [];
    var bans = [];
    function spinner(name) {
        var id = name.replace(/\.|-/g, '');
        groups.push("<li id='" + id + "li' class='rep-entry' style='display: none'><small>" + name + "</small><span id='" + id + "status'><span class='label pull-right label-default rep-tooltip' data-placement='bottom'><i class='fa fa-spin fa-spinner'></i></span></span></li>");
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
        
        var id = name.replace(/\.|-/g, '');
        var status = $('#' + id + 'li');
        status.find('.rep-tooltip')
        	.removeClass('label-default')
        	.addClass("label-" + ({good: "success", bad: "danger"}[obj.banned]))
            .data('content', obj.message)
            .text({good: "OK", bad: "BAN"}[obj.banned]);
    }
    
    function handleBans(response) {
        var json = JSON.parse(response.responseText);
        
        if (!json.success) return;
 
        ban("Outpost", json.opBans);
        ban("Bazaar", json.bzBans);
        ban("Scrap.tf", json.stfBans);
        ban("PPM", json.ppmBans);
        //ban("TF2-Trader", json.tf2tBans);
        //ban("MCT", json.mctBans);
        /*ban("BBG", json.bbgBans);*/
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
        modal("rep.tf bans", html);
    }
    
    function showHtml(show) {
        $('.rep-entry').toggle(show);
    }
    
    $('.btn > .stm-tf2outpost').parent().after('<a class="btn btn-primary btn-xs" href="http://rep.tf/' + steamid + '" target="_blank" style="margin-left: 4px">rep.tf</a>')
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
