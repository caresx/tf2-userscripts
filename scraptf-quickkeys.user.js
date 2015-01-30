// ==UserScript==
// @name         Scrap.tf quickkeys
// @namespace    http://steamcommunity.com/id/caresx/
// @version      1.0
// @description  Consistently checks to see if there are keys available on scrap.tf, useful if you're high on metal and want quick, easy, and in most cases cheap keys.
// @author       cares
// @include      https://scrap.tf/keys
// @grant        none
// ==/UserScript==

/* Amount of milliseconds between key count on scrap.tf being pulled
   Used for notifications */
var KEY_POLL_INTERVAL = 10000; 
/* Amount of milliseconds for which the key count notification is shown */
var NOTIFICATION_CLOSE_TIME = 5000;
/* Maximum amount of keys you can buy per batch, this is 8 right now.
   You can optionally modify this to choose how many keys you want maximum per batch. */
var MAX_KEYS_PER_BATCH = 8; 

function quickkeys() {
    var lastnotif,
        $rkeys = $(".refresh-keys");
    
    function closenotif() {
        if (lastnotif) {
            lastnotif.close();
            lastnotif = null;
        }
    }
    
    if ($("#buykeybox").css("display") === "none") {
        ScrapTF.Keys.ToggleBuyKeys();
    }
    
    $(".bank-welcome h1").text("Quickkey Banking");
    setInterval(function () {
        closenotif();
        
        $rkeys.button('loading');
        ScrapTF.Api("GetKeysAvailable", {}, function (data) {
            var numkeys = data.numkeys, kc;
            
            if (data.success === true && numkeys > 0) {
                if ($("#buykeybox").css("display") === "none") {
                    ScrapTF.Keys.ToggleBuyKeys();
                }
                
                $("#keys-available").css("display", "inline");
                $("#no-keys-available").css("display", "none");
                
                kc = numkeys;
                if (numkeys > MAX_KEYS_PER_BATCH) {
                    kc = 8;
                }
                
                $("#num-keys").text(kc);
                $("#num-keys-textbox").val(kc);
                
                lastnotif = new Notification("Scrap.TF - Keys Available", {
                    icon: "http://scrap.tf/favicon.ico",
                    body: "There are " + numkeys + " available on scrap.tf right now.",
                    tag: 'keyCountNotification'
                });
                
                setTimeout(closenotif, NOTIFICATION_CLOSE_TIME);
                console.log("Keys available: " + numkeys);
            } else {
                $("#no-keys-available").css("display", "inline");
                $("#keys-available").css("display", "none");
                $("#num-keys-textbox").val("0");
                
                console.log("No keys available.");
            }
            
            setTimeout(function () {
                $(".refresh-keys").button('reset');
            }, 1000);
        });
    }, KEY_POLL_INTERVAL);
}

Notification.requestPermission(function (status) {
    if (status !== "granted") {
        return console.error("You need to grant notification permissions to use this.");
    }
    
    // Hack for CF Rocket
    setTimeout(function checkscraptf() {
        if (window.ScrapTF) {
            quickkeys();
        } else {
            setTimeout(checkscraptf, 0);
        }
    }, 5);
});
