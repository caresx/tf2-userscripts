// ==UserScript==
// @name         Steam Community Market - Item Histories
// @namespace    http://steamcommunity.com/id/caresx/
// @version      1.1
// @description  Shows links to item histories for items on the Steam Community Market. Not all items are in the given third party sites' database. TF2, CS:GO, and Dota 2 supported.
// @author       cares
// @include      /https?:\/\/steamcommunity\.com\/market\/listings\/.*/
// @grant        none
// ==/UserScript==

function addLinks() {
    $J('.market_listing_row').each(function () {
        var $this = $J(this),
            buybutton = $this.find('.market_listing_buy_button a'),
            buyhref = buybutton.attr('href') || "";
        if (!buyhref) return; // 'Sold!'
        var params = buyhref.split(/'(.*?)'/g),
            gameid = parseInt(params[4].replace(/,/g, '')),
            id = params[7],
            $nameblock = $this.find('.market_listing_item_name_block'),
            htm = '<div>';

        $nameblock.find('.market_listing_game_name').append(' - Item History');
        if (gameid === 440) { // TF2
            htm += '<small><a href="http://backpack.tf/item/' + id + '">backpack.tf</a></small>'+
                ' <small><a href="https://tf2outpost.com/item/440,' + id + '">TF2 Outpost</a></small>'+
                ' <small><a href="http://tf2items.com/item/' + id + '">TF2 Items</a></small>';
        } else if (gameid === 730) { // CS:GO
            htm += '<small><a href="http://csgo.exchange/item/' + id + '">csgo.exchange</a></small>'+
                      ' <small><a href="http://www.tf2outpost.com/item/730,' + id + '">TF2 Outpost</a></small>';
        } else if (gameid === 570) {
            htm += '<small><a href="http://www.dotaoutpost.com/item/570,' + id + '">Dota Outpost</a></small>';
        } else {
            htm += '[unavailable]';
        }

        htm += "</div>";
        $nameblock.append(htm);
    });
}

setTimeout(function () {
    addLinks();
    // Pagination
    (new MutationObserver(addLinks)).observe(document.querySelector('#searchResultsRows'), {childList: true});
}, 1600); // SIH support
