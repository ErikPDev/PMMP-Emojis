// ==UserScript==
// @name         PMMP Emojis
// @namespace    https://github.com/ErikPDev/PMMP-Emojis
// @version      1.2
// @description  A simple script that adds emoji support to the forums!
// @author       ErikPDev
// @match        https://forums.pmmp.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
//
// ██████╗░███╗░░░███╗███╗░░░███╗██████╗░░░░░░░███████╗███╗░░░███╗░█████╗░░░░░░██╗██╗░██████╗
// ██╔══██╗████╗░████║████╗░████║██╔══██╗░░░░░░██╔════╝████╗░████║██╔══██╗░░░░░██║██║██╔════╝
// ██████╔╝██╔████╔██║██╔████╔██║██████╔╝█████╗█████╗░░██╔████╔██║██║░░██║░░░░░██║██║╚█████╗░
// ██╔═══╝░██║╚██╔╝██║██║╚██╔╝██║██╔═══╝░╚════╝██╔══╝░░██║╚██╔╝██║██║░░██║██╗░░██║██║░╚═══██╗
// ██║░░░░░██║░╚═╝░██║██║░╚═╝░██║██║░░░░░░░░░░░███████╗██║░╚═╝░██║╚█████╔╝╚█████╔╝██║██████╔╝
// ╚═╝░░░░░╚═╝░░░░░╚═╝╚═╝░░░░░╚═╝╚═╝░░░░░░░░░░░╚══════╝╚═╝░░░░░╚═╝░╚════╝░░╚════╝░╚═╝╚═════╝░
// PMMP-Emojis, an Emoji system for the Pocketmine Forums
// Copyright (c) 2021 ErikPDev  < https://github.com/ErikPDev >
//
//
// This software is distributed under "GNU General Public License v3.0".
// This license allows you to use it and/or modify it but you are not at
// all allowed to sell this plugin at any cost. If found doing so the
// necessary action required would be taken.
//
// PMMP-Emojis is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License v3.0 for more details.
//
// You should have received a copy of the GNU General Public License v3.0
// along with this program. If not, see
// <https://opensource.org/licenses/GPL-3.0>.
// ------------------------------------------------------------------------
//

(function() {
    'use strict';

    const EmojisApi = "https://raw.githubusercontent.com/ErikPDev/PMMP-Emojis/main/emojis.json"; // Caching support, We don't want to call github every time.
    var DomInUse = false;
    var PreviousEmoji = "";
    var PreviousConversation = "";
    if(localStorage.Emoji == undefined){
        console.log("Fetching data.");
        fetch(EmojisApi)
            .then(response => { response.text().then(response => {localStorage.setItem("Emoji",response);})});
        console.log("Data fetched completed!");
    }else{
    console.log("Already fetched, using localstorage as data");
    };
    let Emojis = JSON.parse(localStorage.getItem("Emoji"));
    if(Emojis == null){document.location.reload(true);}
    function escapeRegExp(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }


    window.addEventListener("load", function(){
        DomInUse = true;
        let RegexShortCode = /:(\w+):/g;
        let EmojisShortCode = document.body.innerHTML.match(RegexShortCode);
        if(EmojisShortCode == null){return};
        for(var num in EmojisShortCode){
            const listOfBlockquote = document.body.getElementsByTagName("blockquote");
            for (var blockquote in listOfBlockquote){
                if(listOfBlockquote[blockquote].innerHTML == undefined){continue;}
                var EmojiCS = Emojis[EmojisShortCode[num]];
                if(EmojiCS == undefined){EmojiCS = "❓";}
                listOfBlockquote[blockquote].innerHTML = listOfBlockquote[blockquote].innerHTML.replace(new RegExp(escapeRegExp(EmojisShortCode[num]), 'g'), EmojiCS);
            }
            const listofSignature = document.getElementsByClassName("signature");
            for (var signature in listofSignature){
                if(listofSignature[signature].innerHTML == undefined){continue;}
                EmojiCS = Emojis[EmojisShortCode[num]];
                if(EmojiCS== undefined){EmojiCS = "❓";}
                listofSignature[signature].innerHTML = listofSignature[signature].innerHTML.replace(new RegExp(escapeRegExp(EmojisShortCode[num]), 'g'), EmojiCS);
            }
        }
        DomInUse = false;
    });

    const observerOptions = {
        childList: true,
        attributes: true,

        // Omit (or set to false) to observe only changes to the parent node
        subtree: true
    }

    const observer = new MutationObserver(function(mutations){
        if(DomInUse){return};
        DomInUse = true;
        mutations.forEach(function(mutation) {
            if (mutation.type != 'childList' ){return;}
            if (mutation.addedNodes.length == 0) {return;}
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                if(mutation.addedNodes[i].innerHTML == undefined || mutation.addedNodes[i].innerHTML == ""){return;}
                let RegexShortCode = /:(\w+):/g;
                let EmojisShortCode = mutation.addedNodes[i].innerHTML.match(RegexShortCode);
                if(EmojisShortCode == null){return};
                for(var num in EmojisShortCode){
                    const listOfBlockquote = mutation.addedNodes[i].getElementsByTagName("blockquote");
                    for (var blockquote in listOfBlockquote){
                        if(listOfBlockquote[blockquote].innerHTML == undefined){continue;}
                        listOfBlockquote[blockquote].innerHTML = listOfBlockquote[blockquote].innerHTML.replace(new RegExp(escapeRegExp(EmojisShortCode[num]), 'g'), Emojis[EmojisShortCode[num]]);
                    }
                }
            }
        });
        DomInUse = false;
    });
    observer.observe(document, observerOptions);



    window.addEventListener('input', updateValue); // Adds support for emoji to text, This is buggy so PR's to fix this is helpful!

    function updateValue(e) {
        const IsEmojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
        if(!e.target.value.match(IsEmojiRegex)){ return; }
            e.target.value.match(IsEmojiRegex).forEach(EmojiID =>{
                if(EmojiID == PreviousEmoji){e.target.value=PreviousConversation;return;}
                e.target.value = e.target.value.replace(EmojiID, getKeyByValue(Emojis, EmojiID));
                PreviousEmoji = EmojiID;
                PreviousConversation = e.target.value;
            });
        }
})();
