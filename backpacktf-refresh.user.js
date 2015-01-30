// ==UserScript==
// @name         backpack.tf refresh
// @namespace    http://steamcommunity.com/id/caresx/
// @version      0.3
// @description  Refresh user backpacks to update classifieds listings on backpack.tf
// @author       cares
// @match        http://backpack.tf/*
// @grant        none
// ==/UserScript==

$(function () {
    $('a.listing-report').each(function () {
        $(this).parent().prepend('<a class="btn btn-xs btn-bottom btn-primary listing-refreshbp" data-tip="top" title="" data-original-title="Update this user\'s backpack."><i class="fa fa-sw fa-refresh"></i></a>');
    });
    
    var scr = document.createElement('script');
    
    scr.innerText = "$('.listing-refreshbp').tooltip({placement: get_tooltip_placement,animation: false});";
    document.querySelector('head').appendChild(scr);
    
    var done = [];
    $('.listing-buttons').on('click', '.listing-refreshbp', function () {
        var refresh = $(this),
            mediaobj = refresh.parent().parent().parent().find('.media-object'),
            steamid = mediaobj.find('li')[0].dataset.listingSteamid;
        
        if (done.indexOf(steamid) !== -1) {
            refresh.fadeOut();
            return;
        }
        
        done.push(steamid);
        $.get("http://backpack.tf/profiles/" + steamid, function () {    
            refresh.fadeOut();
        });
    });
    
    $('#profile-dropdown-container .dropdown-menu li').eq(7).after('<li><a href="#refresh-all" id="refresh-all"><i class="fa fa-fw fa-refresh"></i>Refresh All</a></li>');
    
    $("#refresh-all").click(function (e) {
        var delay = 0,
            DELAY_EACH = 400;
        
        e.preventDefault();
        
        $('.listing-refreshbp .fa-refresh').each(function () {
            var $this = $(this);
            
            setTimeout(function () {
                $this.click();
            }, delay);
            
            delay += DELAY_EACH;
        });
    });
});
