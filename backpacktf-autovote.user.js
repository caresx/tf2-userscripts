// ==UserScript==
// @name         backpack.tf autovote
// @namespace    http://steamcommunity.com/id/caresx/
// @version      0.1
// @description  Automatically vote on backpack.tf upon loading a voting page
// @author       cares
// @match        http://backpack.tf/vote*
// @grant        none
// ==/UserScript==

$(function () {
  $('.label-belt').not('.label-white-text').closest('.vote').find('.vote-agree').not('.active').click();
  $('.label-belt.label-white-text').closest('.vote').find('.vote-disagree').not('.active').click();
});
