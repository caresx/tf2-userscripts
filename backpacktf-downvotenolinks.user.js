// ==UserScript==
// @name         backpack.tf downvotenolinks
// @namespace    http://steamcommunity.com/id/caresx/
// @version      0.1
// @description  Automatically downvote suggestions without links on backpack.tf
// @author       cares
// @match        http://backpack.tf/*
// @grant        none
// ==/UserScript==

$(function () {
    // expect >=yellow belts to not make proofless suggestions, saves on a lot of http requests
    // also ignore votes in the active price suggestions panel
    $('.panel:not(:contains(Active Price Suggestions)) .label-belt.label-white-text').each(function () {
        var $this = $(this),
            vote = $this.closest('.vote'),
            buttons = vote.find('.vote-agree, .vote-disagree');
        
        // already voted on
        if (buttons.length !== buttons.not('active').length) {
            return;
        }
        
        // ignore suggestions that the user has visited (ones that don't have a red discussion icon)
        var discuss = vote.find('.btn-danger')[0];
        if (!discuss) return;
        var href = discuss.href;
        $.ajax({
            url: href,
            success: function (data) {
                var linkc = $($('.op', data)[0], data).find('.body a').length;
                
                if (linkc === 0) {
                    vote.find('.vote-disagree').click();
                }
            },
            dataType: "html"
        });
    });
});
