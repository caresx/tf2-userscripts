// ==UserScript==
// @name         backpack.tf freerep
// @namespace    http://steamcommunity.com/id/caresx/
// @version      0.3
// @description  Automatically downvote suggestions on the main page without links on backpack.tf
// @author       cares
// @match        http://backpack.tf/
// @grant        none
// ==/UserScript==

$(function () {
    // expect >=yellow belts to not make proofless suggestions, saves on a lot of http requests
    // only consider recent suggestions, active ones will have been checked by mods
    $('.panel:contains(Recent Suggestions) .label-belt.label-white-text').each(function () {
        var $this = $(this),
            vote = $this.closest('.vote'),
            buttons = vote.find('.vote-agree, .vote-disagree');
        
        // already voted on
        if (buttons.length !== buttons.not('active').length) {
            return;
        }
        
        // ignore suggestions that the user has visited (ones that don't have a red discussion icon)
        var discuss = vote.find('h6:contains(Talk)').parent().find('.btn-danger')[0];
        if (!discuss) return;
        var href = discuss.href;
        $.ajax({
            url: href,
            success: function (data) {
                var op = $($('.op', data)[0], data);
                var linkc = op.find('.body a', data).length;
                console.log(data, op, linkc);
                if (linkc === 0 || op.length === 0) { // no links | suggester deleted comment
                    vote.find('.vote-disagree').click();
                }
            },
            dataType: "html"
        });
    });
});
