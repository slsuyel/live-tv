
(function(){
"use strict";
var __mlbdExternalScripts=["https://cdn.jsdelivr.net/npm/hls.js@1.6.16/dist/hls.min.js","https://unpkg.com/shaka-player@5.0.0/dist/shaka-player.compiled.js"];

function __mlbdCssEscape(v){
  try{ return window.CSS && CSS.escape ? CSS.escape(v) : String(v).replace(/["\\]/g,"\\$&"); }catch(e){ return String(v||""); }
}
function __mlbdLoadScript(src){
  return new Promise(function(resolve){
    if(!src){resolve();return;}
    try{
      var existing=document.querySelector('script[data-mlbd-dynamic-src="'+__mlbdCssEscape(src)+'"]');
      if(existing){resolve();return;}
    }catch(e){}
    var s=document.createElement("script");
    s.src=src;
    s.async=false;
    s.defer=false;
    s.setAttribute("data-mlbd-dynamic-src",src);
    s.onload=function(){resolve();};
    s.onerror=function(){resolve();};
    (document.head||document.documentElement).appendChild(s);
  });
}
function __mlbdRun(fn){
  try{ fn(); }catch(e){ /* silent production */ }
}

var __mlbdInlineScripts=[];
__mlbdInlineScripts.push(function(){
(function(){function fmt(sec){sec=Math.max(0,Math.floor(sec));var h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;return (h?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}function tick(){var el=document.querySelector('[data-score-clock]');if(!el)return;var st=parseInt(el.getAttribute('data-start')||'0',10),en=parseInt(el.getAttribute('data-end')||'0',10),mode=el.getAttribute('data-mode')||'';var now=Math.floor(Date.now()/1000);if(mode==='live'&&st){el.textContent='● '+fmt(now-st)}else if(st&&now<st){el.textContent='Starts in '+fmt(st-now)}else if(en&&now<=en){el.textContent='● '+fmt(now-st)}else{el.textContent='Live TV'}}tick();setInterval(tick,1000)})();
;
(function(){
  "use strict";

  const CHANNELS = [{"key":"dsports","name":"D Sports","image":"https://upload.wikimedia.org/wikipedia/commons/5/5a/DSports.png","category":"Sports","quality":"HD","status":"live","sort":0,"views":0,"live":0,"resolution":"","play_token":"1781829647.bb199c3c98a30355b85714c575205b481c73e44806547b491691b1fb710aab0a","play_exp":1781829647,"source_types":["dash"],"source_count":1},{"key":"golive","name":"GOLIVE - English","image":"https://rtb-images.glueapi.io/320x0/live/GoLiveNew.png","category":"Sports","quality":"HD","status":"live","sort":1,"views":0,"live":0,"resolution":"","play_token":"1781829647.7fe4ae11645cf40b5e9bb622b9d703db2df9ccd613c7412457c4f69f91ca4c03","play_exp":1781829647,"source_types":["hls"],"source_count":1},{"key":"ios3","name":"iOS - FIFA 2026 Server 3","image":"https://i.guim.co.uk/img/media/993d3ff63f81efb3bd6d4a93be34a98a815a2453/0_0_5000_3297/master/5000.jpg?width=1900\u0026dpr=2\u0026s=none\u0026crop=none","category":"Sports","quality":"HD","status":"live","sort":2,"views":0,"live":0,"resolution":"","play_token":"1781829647.10f820e1a4ce7205182d1f87dfa89b2e29246f1e6b5eddfd9fb020b3bc8e8aa5","play_exp":1781829647,"source_types":["hls"],"source_count":1},{"key":"beinsports","name":"iOS - beIN SPORTS 1 (Arabic)","image":"https://i.ibb.co.com/S7tZS6cg/Bein-Sports-1-Direct.png","category":"Sports","quality":"HD","status":"live","sort":2,"views":0,"live":0,"resolution":"","play_token":"1781829647.db62e18053055cfd9457f8b68f16a1a4011c3dbd34530844475a9c954b9b12a7","play_exp":1781829647,"source_types":["hls"],"source_count":1},{"key":"cazetv","name":"CazéTV 1080p 60Fps","image":"https://upload.wikimedia.org/wikipedia/en/thumb/6/64/Caz%C3%A9TV_logo.svg/1280px-Caz%C3%A9TV_logo.svg.png","category":"Sports","quality":"HD","status":"live","sort":4,"views":0,"live":0,"resolution":"","play_token":"1781829647.56bbfa3a5715bc46c852ac05d9017d918cdf4f2477e1262298bd2ee483d5dc24","play_exp":1781829647,"source_types":["dash"],"source_count":1},{"key":"iptv-729668","name":"AR: beIN SPORTS Pop Up FHD","image":"https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/international/beinsports/old/stacked/bein-sports-int.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"FHD","status":"live","sort":7000,"views":0,"live":0,"resolution":"","play_token":"1781829647.39196776e7a1ecb96b2bd42df44f2af0c6d03517578d23b3ae6b83578a5c249c","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-729021","name":"AR: beIN SPORTS NEWS FHD (H.265)","image":"https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/international/beinsports/old/stacked/bein-sports-news-arabic-int.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"FHD","status":"live","sort":7001,"views":0,"live":0,"resolution":"","play_token":"1781829647.0fd6e303524062483aa1ad56148d4a4a8c24ed326c548e025b43016156bad7f1","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-729022","name":"AR: beIN SPORTS NEWS HD","image":"https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/international/beinsports/old/stacked/bein-sports-news-arabic-int.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"HD","status":"live","sort":7002,"views":0,"live":0,"resolution":"","play_token":"1781829647.09e0a8fc8c648db9799606ccc72adadcca04071ab79eb34acbaab84223fbfca1","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-729023","name":"AR: beIN SPORTS FHD (H.265)","image":"https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/international/beinsports/old/stacked/bein-sports-int.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"FHD","status":"live","sort":7003,"views":0,"live":0,"resolution":"","play_token":"1781829647.ec3f379e5809254f4f6c576ddf1a520f57df82ece0676eacb16e827907b82864","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-729024","name":"AR: beIN SPORTS HD","image":"https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/international/beinsports/old/stacked/bein-sports-int.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"HD","status":"live","sort":7004,"views":0,"live":0,"resolution":"","play_token":"1781829647.8c47946bae4f523caaef82e129301e4cb9081afa477be0e9b291f7b5eccb8df9","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-729453","name":"TOD WC 01: Arabic Feed: FIFA World Cup 2026: Argentina vs. Algeria","image":"https://i.imgur.com/rIIIAi2.jpeg","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"HD","status":"live","sort":7005,"views":0,"live":0,"resolution":"","play_token":"1781829647.3b91cb1a18ecf6d2d079aedf614b13c10b5e7f72e753b64a613eb5b8befa8b84","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-729454","name":"TOD WC 02: Arabic Feed: FIFA World Cup 2026: Argentina vs. Algeria - HD","image":"https://i.imgur.com/rIIIAi2.jpeg","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"HD","status":"live","sort":7006,"views":0,"live":0,"resolution":"","play_token":"1781829647.4dc01502d4ba93aebf455be50123b4d12ca25d4a7c4311046769bd906d2606ca","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-729558","name":"TOD WC 03: : كأس العالم: الأرجنتين ضد الجزائر - HDR [EN-AR]","image":"https://i.imgur.com/rIIIAi2.jpeg","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"4K","status":"live","sort":7007,"views":0,"live":0,"resolution":"","play_token":"1781829647.531cbf168766c6f51d20e48325eaa973222d6a5fd89639a9f32ef250f105000b","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-729576","name":"TOD WC 04: كأس العالم: السعودية ضد أوروغواي - HD","image":"https://i.imgur.com/rIIIAi2.jpeg","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"HD","status":"live","sort":7008,"views":0,"live":0,"resolution":"","play_token":"1781829647.72d4c0c18148009610c99fe55ad54824160411e46bab7e3fc934a23860f997fa","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-729577","name":"TOD WC 05: FIFA World Cup: Saudi Arabia vs Uruguay - ENG","image":"https://i.imgur.com/rIIIAi2.jpeg","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"HD","status":"down","sort":7009,"views":0,"live":0,"resolution":"","play_token":"1781829647.6ee9263a996ccddb884a06da1dadbd4e30e7e9efe6e652d3fbb0810a5f25f6c5","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-729429","name":"beIN SPORTS 4K HDR","image":"https://assets.bein.com/mena/sites/4/2026/05/4K-HDR-200x200-1.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"4K","status":"live","sort":7010,"views":0,"live":0,"resolution":"","play_token":"1781829647.da8f8eb15f521adcfceaf3eadfe7807c499c51a636d0cc3c68862047ea39a5aa","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-729578","name":"beIN SPORTS 4K HDR*","image":"https://assets.bein.com/mena/sites/4/2026/05/4K-HDR-200x200-1.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"4K","status":"live","sort":7011,"views":0,"live":0,"resolution":"","play_token":"1781829647.349d27ec52645926ccc8a3a034329e41736580d04edb229854f583c1ed42c343","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727604","name":"beIN SPORTS MAX 1 FHD HEVC Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX1_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"FHD","status":"live","sort":7012,"views":0,"live":0,"resolution":"","play_token":"1781829647.438e969cf27a8b7f4a28503a7602561943fe3cf40a6f0f64ed5c5dfe6d539482","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727606","name":"beIN SPORTS MAX 1 FHD Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX1_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"FHD","status":"live","sort":7013,"views":0,"live":0,"resolution":"","play_token":"1781829647.b01a25c678d3fc789fae82a629fc516ae732dd9bd2258c99e6597298abccdb70","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727607","name":"beIN SPORTS MAX 1 HD Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX1_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"HD","status":"live","sort":7014,"views":0,"live":0,"resolution":"","play_token":"1781829647.cb9f362a68193a54cd72c68c966e9563e248ddda5ea4dc846712b3116d2eca5d","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727608","name":"beIN SPORTS MAX 1 SD+ Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX1_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"SD","status":"live","sort":7015,"views":0,"live":0,"resolution":"","play_token":"1781829647.ce530b975254fe3bf2d832c63b543fb4447d78730a4daa960991ea284189cdc3","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727605","name":"beIN SPORTS MAX 2 FHD HEVC Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX2_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"FHD","status":"live","sort":7016,"views":0,"live":0,"resolution":"","play_token":"1781829647.fee6a30110805de433fae23d0379fe62e892d8c5e07cf18d909c95a81626314a","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727609","name":"beIN SPORTS MAX 2 FHD Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX2_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"FHD","status":"live","sort":7017,"views":0,"live":0,"resolution":"","play_token":"1781829647.8d1293a6c3691d0363f162749ff3125a3160e6c330da0f2b08db7cb5e2be9611","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727610","name":"beIN SPORTS MAX 2 HD Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX2_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"HD","status":"live","sort":7018,"views":0,"live":0,"resolution":"","play_token":"1781829647.b280ddef8f9a03604b8dbb24f54571075b12660922fb1340b68eba10ba9493b8","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727611","name":"beIN SPORTS MAX 2 SD+ Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX2_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"SD","status":"live","sort":7019,"views":0,"live":0,"resolution":"","play_token":"1781829647.68532ac14ead4346958583affd8c7e03117041b7e0145232546c9505f368a9e2","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727612","name":"beIN SPORTS MAX 3 FHD HEVC Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX3_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"FHD","status":"live","sort":7020,"views":0,"live":0,"resolution":"","play_token":"1781829647.0bf6ce3a651375a09479764c36aa279eefaaca17b08a874c35892b26326d3524","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727613","name":"beIN SPORTS MAX 3 FHD Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX3_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"FHD","status":"live","sort":7021,"views":0,"live":0,"resolution":"","play_token":"1781829647.d46c8e826688c1a24aac41fb8305bac941f7c9213236fb94152acbc3fbc1b6c2","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727614","name":"beIN SPORTS MAX 3 HD Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX3_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"HD","status":"live","sort":7022,"views":0,"live":0,"resolution":"","play_token":"1781829647.e16de78fc35594247f51341a15ef26b2f5fc772996d679d91b7a34cd3b0761f9","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727615","name":"beIN SPORTS MAX 3 SD+ Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX3_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"SD","status":"live","sort":7023,"views":0,"live":0,"resolution":"","play_token":"1781829647.10ea5a06057f5430beab76747422c6611e015acacbde71b56f7e04ec16901fbc","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727616","name":"beIN SPORTS MAX 4 FHD HEVC Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX4_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"FHD","status":"live","sort":7024,"views":0,"live":0,"resolution":"","play_token":"1781829647.31579e985947b47d05332531c6d582d34561dcf766584891efe79620961c8612","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727617","name":"beIN SPORTS MAX 4 FHD Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX4_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"FHD","status":"live","sort":7025,"views":0,"live":0,"resolution":"","play_token":"1781829647.601dffb037d75e23cfd7ca88f8049d6e07d20a7b1ac62bbb3b100d293fd7246b","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727618","name":"beIN SPORTS MAX 4 HD Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX4_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"HD","status":"live","sort":7026,"views":0,"live":0,"resolution":"","play_token":"1781829647.4cd52eae1ff6f3868b23efc66dd6b609c92c9befa4f8c5f9ca50920618800733","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-727619","name":"beIN SPORTS MAX 4 SD+ Ⓖ","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX4_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"SD","status":"live","sort":7027,"views":0,"live":0,"resolution":"","play_token":"1781829647.09a07ba266efcce2ed0f1113e6070f264042910db57776d89f5fa4de94571751","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-729433","name":"beIN SPORTS MAX 1 FHD [♣]","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX1_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"FHD","status":"live","sort":7028,"views":0,"live":0,"resolution":"","play_token":"1781829647.ab4d16e6c0d89b14babc244cda8303e33a12a494ed033646a2f1dac6202e5629","play_exp":1781829647,"source_types":["hls","file"],"source_count":5},{"key":"iptv-729432","name":"beIN SPORTS MAX 1 FHD HEVC [♣]","image":"https://assets.bein.com/mena/sites/3/2015/06/beIN_SPORTS_MAX1_DIGITAL_Mono.png","category":"FIFA WC 2026™ beIN MAX Ⓖ","quality":"FHD","status":"live","sort":7029,"views":0,"live":0,"resolution":"","play_token":"1781829647.18304a1f23b384f0d32909e5d1dced2757f0aa07b3b3a43b7acb6576bf3d2938","play_exp":1781829647,"source_types":["hls","file"],"source_count":5}];
  const SERVER_STATS_CLIENT = "";
  const SERVER_SELECTED_KEY = "dsports";
  // Protected mode: page source contains no stream URLs/DRM keys; fetch only on play.
  const WC_START = "2026-06-19T01:00:00+06:00";
  const PLAY_API_URL = "/v1/mks/channel";
  const MKS_REALTIME_OFF = true;
  try{ window.MKS_REALTIME_OFF = MKS_REALTIME_OFF; }catch(e){}
  const VOTE_API_URL = "";
  const MATCHES_API_URL = "/v1/mks/matches";
  const MLBD_SYNC_BUILD = "2026-06-16-fast-fallback-admin-light-v1";

  const video = document.getElementById("liveVideo");
  const playerCard = document.getElementById("playerCard");
  const videoContainer = document.getElementById("videoContainer");
  const loader = document.getElementById("playerLoader");
  const errorBox = document.getElementById("errorBox");
  const statusText = document.getElementById("playerStatus");
  const playBtn = document.getElementById("playBtn");
  const muteBtn = document.getElementById("muteBtn");
  const refreshBtn = document.getElementById("refreshBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const iphonePlayerBtn = document.getElementById("iphonePlayerBtn");
  const qualitySelect = document.getElementById("qualitySelect");
  const barChannelSelect = document.getElementById("barChannelSelect");
  const barChannelPicker = document.getElementById("barChannelPicker");
  const barChannelPickerBtn = document.getElementById("barChannelPickerBtn");
  const barChannelMenu = document.getElementById("barChannelMenu");
  const barChannelLogo = document.getElementById("barChannelLogo");
  const barChannelName = document.getElementById("barChannelName");
  const shareBtn = document.getElementById("shareBtn");
  const searchInput = document.getElementById("channelSearch");
  const emptyState = document.getElementById("emptyState");
  const channelButtons = Array.from(document.querySelectorAll(".channel-card"));
  const channelFilterTabs = Array.from(document.querySelectorAll("[data-channel-filter]"));
  let channelFilterMode = "all";
  const sideServerButtons = Array.from(document.querySelectorAll("[data-side-channel]"));

  const currentLiveCount = document.getElementById("currentLiveCount");
  const currentViewCount = document.getElementById("currentViewCount");
  const currentResolution = document.getElementById("currentResolution");
  const sideCurrentName = document.getElementById("sideCurrentName");
  const sideCurrentSub = document.getElementById("sideCurrentSub");
  const sideCurrentLive = document.getElementById("sideCurrentLive");
  const sideCurrentViews = document.getElementById("sideCurrentViews");
  const sideCurrentQuality = document.getElementById("sideCurrentQuality");
  const sideTotalLive = document.getElementById("sideTotalLive");
  const sideTotalViews = document.getElementById("sideTotalViews");
  const sideActiveChannels = document.getElementById("sideActiveChannels");
  const watchChannelName = document.getElementById("watchChannelName");
  const watchPlaybackState = document.getElementById("watchPlaybackState");
  const STATS_URL = "";
  const STATS_PING_MS = 86400000;
  const PUBLIC_STATS_WRITE_ENABLED = false;
  const REALTIME_EDGE_BUCKET_MS = 60000;
  const STATS_SUMMARY_POLL_MS = 86400000;
  const VOTE_SUMMARY_POLL_MS = 86400000;
  function realtimeBucket(ms){ return Math.floor(Date.now() / Math.max(1000, Number(ms || REALTIME_EDGE_BUCKET_MS))); }

  const playerMatchStrips = Array.from(document.querySelectorAll("#playerMatchStrip"));
  function formatMatchCountdown(ms){
    if(ms <= 0) return "Starting now";
    const total = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const sec = total % 60;
    const pad = n => String(n).padStart(2, "0");
    if(d > 0) return d + "d " + pad(h) + "h " + pad(m) + "m " + pad(sec) + "s";
    if(h > 0) return pad(h) + "h " + pad(m) + "m " + pad(sec) + "s";
    return pad(m) + "m " + pad(sec) + "s";
  }
  function updatePlayerMatchStrip(){
    const now = Date.now();
    playerMatchStrips.forEach(function(strip){
      const countdown = strip.querySelector("#playerMatchCountdown, [data-player-match-countdown]");
      if(!countdown) return;
      const mode = strip.dataset.mode || "none";
      const start = parseInt(strip.dataset.start || "0", 10) * 1000;
      const end = parseInt(strip.dataset.end || "0", 10) * 1000;
      if(mode === "live"){
        if(end && now > end){ strip.style.display = "none"; return; }
        countdown.textContent = "Live now";
        return;
      }
      if(mode === "next" && start){ countdown.textContent = formatMatchCountdown(start - now); }
    });
  }
  updatePlayerMatchStrip();
  setInterval(updatePlayerMatchStrip, 1000);

  let hls = null;
  let shakaPlayer = null;
  let currentKey = null;
  let bufferTimer = null;
  let stallTimer = null;
  let lastGoodTime = 0;
  let dashSyncTimer = null;
  let controlsHideTimer = null;
  let tempAutoCapTimer = null;
  let bufferAutoRecoverTimer = null;
  let bufferEventsInWindow = 0;
  let bufferWindowTimer = null;
  let userPaused = false;
  let userWantsSound = (localStorage.getItem("mlbd_livetv_sound") || getCookie("mlbd_livetv_sound") || "off") === "on";
  let autoplayMutedFallbackActive = false;
  let iosSoundUnlocked = false;
  let statsTimer = null;
  let mlbdLoadSafetyTimer = null;
  let currentResolutionLabel = "Auto";
  let currentQualityMode = "auto";
  let currentQualityOptions = [];
  let manualQualitySwitchAt = 0;
  let manualQualitySwitchChannel = "";
  let statsClient = localStorage.getItem("mlbd_livetv_client") || getCookie("mlbd_livetv_uid") || (Date.now().toString(36) + Math.random().toString(36).slice(2,12));
  localStorage.setItem("mlbd_livetv_client", statsClient);

  function voteStorageKey(matchId){ return "mlbd_vote_" + String(matchId || ""); }
  function labelForVote(card, opt){
    if(opt === "team1") return card.getAttribute("data-team1") || "Team 1";
    if(opt === "team2") return card.getAttribute("data-team2") || "Team 2";
    return "Draw";
  }
  function updateVoteCard(card, summary, picked){
    if(!card || !summary) return;
    const total = Number(summary.total || 0);
    const winner = summary.winner || "";
    const totalEl = card.querySelector("[data-vote-total]");
    if(totalEl) totalEl.textContent = (total >= 1000 ? (total/1000).toFixed(total >= 10000 ? 0 : 1).replace(/\.0$/,"") + "K" : total) + " votes";
    card.querySelectorAll("[data-vote-row]").forEach(function(row){
      const opt = row.getAttribute("data-vote-row") || "";
      const data = summary.options && summary.options[opt] ? summary.options[opt] : {percent:0,votes:0};
      const pct = Math.max(0, Math.min(100, Number(data.percent || 0)));
      row.classList.toggle("is-top", total > 0 && winner === opt);
      const fill = row.querySelector(".fan-result-fill");
      const pctEl = row.querySelector(".fan-result-pct");
      if(fill) fill.style.width = pct + "%";
      if(pctEl) pctEl.textContent = pct + "%";
    });
    card.querySelectorAll("[data-vote-option]").forEach(function(btn){
      const opt = btn.getAttribute("data-vote-option") || "";
      btn.classList.toggle("is-picked", picked && picked === opt);
      btn.disabled = false;
    });
    const insight = card.querySelector("[data-vote-insight]");
    if(insight){
      if(total <= 0){
        insight.innerHTML = '<i class="fa fa-bolt"></i> <span>Be the first to predict this match.</span>';
      }else{
        const name = labelForVote(card, winner);
        const my = picked ? ' Your pick: <b>' + labelForVote(card, picked).replace(/[&<>"]/g, function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}) + '</b>.' : '';
        insight.innerHTML = '<i class="fa fa-chart-line"></i> <span>Fans predict <b>' + name.replace(/[&<>"]/g, function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}) + '</b> has the highest win chance.' + my + '</span>';
      }
    }
  }
  function initFanVotes(){
    if(MKS_REALTIME_OFF) return;
    document.querySelectorAll("[data-vote-card]").forEach(function(card){
      const matchId = card.getAttribute("data-match-id") || "";
      const saved = localStorage.getItem(voteStorageKey(matchId)) || "";
      if(saved) card.querySelectorAll("[data-vote-option]").forEach(function(btn){ btn.classList.toggle("is-picked", btn.getAttribute("data-vote-option") === saved); card.classList.toggle("has-picked", !!saved); });
      card.querySelectorAll("[data-vote-option]").forEach(function(btn){
        btn.addEventListener("click", async function(){
          const opt = btn.getAttribute("data-vote-option") || "";
          if(!matchId || !opt) return;
          // Always send vote to Redis so UI/localStorage never gets out of sync.
          card.querySelectorAll("[data-vote-option]").forEach(function(b){ b.disabled = true; });
          try{
            const form = new FormData();
            form.set("match_id", matchId);
            form.set("option", opt);
            form.set("client", statsClient);
            form.set("access", card.getAttribute("data-access") || "");
            const res = await fetch(VOTE_API_URL, {method:"POST", body:form, credentials:"same-origin", cache:"no-store"});
            const json = await res.json().catch(function(){ return {}; });
            if(!res.ok || !json.success) throw new Error(json.message || "Vote failed");
            localStorage.setItem(voteStorageKey(matchId), opt);
            document.querySelectorAll('[data-vote-card][data-match-id="' + CSS.escape(matchId) + '"]').forEach(function(other){ other.setAttribute('data-vote-synced','1'); updateVoteCard(other, json.summary || json.vote_summary, opt); });
            setTimeout(function(){refreshVoteSummaries(true)}, 80);
            setTimeout(function(){refreshVoteSummaries(true)}, 700);
          }catch(err){
            const insight = card.querySelector("[data-vote-insight]");
            if(insight) insight.innerHTML = '<i class="fa fa-triangle-exclamation"></i> <span>' + String(err.message || "Vote failed") + '</span>';
            card.querySelectorAll("[data-vote-option]").forEach(function(b){ b.disabled = false; });
          }
        });
      });
    });
  }

  let mlbdVoteServerTime = 0;
  function getVoteCardIds(){
    var ids=[]; var seen={};
    document.querySelectorAll('[data-vote-card][data-match-id]').forEach(function(card){
      var id=card.getAttribute('data-match-id')||'';
      if(id && !seen[id]){seen[id]=1; ids.push(id);}
    });
    return ids;
  }
  function markVotesSyncing(){
    document.querySelectorAll('[data-vote-card]').forEach(function(card){
      if(card.getAttribute('data-vote-synced')==='1') return;
      var totalEl=card.querySelector('[data-vote-total]');
      if(totalEl) totalEl.textContent='Syncing votes';
    });
  }
  function refreshVoteSummaries(forceFresh){
    if(MKS_REALTIME_OFF || !VOTE_API_URL) return Promise.resolve(null);
    var ids=getVoteCardIds();
    if(!ids.length) return Promise.resolve(null);
    var vu = VOTE_API_URL + '?mode=summary&ids=' + encodeURIComponent(ids.join(',')) + '&v=' + encodeURIComponent(MLBD_SYNC_BUILD) + (forceFresh ? '&force=1&_=' + Date.now() : '&t=' + realtimeBucket(REALTIME_EDGE_BUCKET_MS));
    return fetch(vu, {credentials:'same-origin', cache:(forceFresh?'no-store':'default'), headers:{'Accept':'application/json'}})
      .then(function(r){return r.text()})
      .then(function(t){try{return JSON.parse(t)}catch(e){return null}})
      .then(function(d){
        if(!d || d.success===false) return;
        var vt=Number(d.vote_version_ms || d.vote_generated_at || d.server_time || 0);
        if(vt && mlbdVoteServerTime && vt < mlbdVoteServerTime) return;
        if(vt) mlbdVoteServerTime=vt;
        var list=[];
        if(Array.isArray(d.matches)) list=d.matches;
        else if(d.summaries){ Object.keys(d.summaries).forEach(function(id){list.push({id:id,vote_summary:d.summaries[id]})}); }
        list.forEach(function(m){
          if(!m || !m.id || !m.vote_summary) return;
          var picked=localStorage.getItem(voteStorageKey(m.id)) || '';
          document.querySelectorAll('[data-vote-card][data-match-id="' + CSS.escape(m.id) + '"]').forEach(function(card){
            card.setAttribute('data-vote-synced','1');
            updateVoteCard(card, m.vote_summary, picked);
          });
        });
      }).catch(function(){});
  }
  if(!MKS_REALTIME_OFF){
    markVotesSyncing();
    setInterval(refreshVoteSummaries, VOTE_SUMMARY_POLL_MS);
    setTimeout(refreshVoteSummaries, 0);
    setTimeout(refreshVoteSummaries, 1200);
  }

    sideServerButtons.forEach(function(btn){
    btn.addEventListener("click", function(){
      var key = btn.getAttribute("data-side-channel") || "";
      if(key) playStream(key, {user:true});
    });
  });

  if(!MKS_REALTIME_OFF) initFanVotes();

  // Auto fallback engine: if a source fails, try backup source first, then the next best live channel.
  let currentPlayId = 0;
  let currentSourceIndex = 0;
  let currentSourceList = [];
  let currentStreamType = "";
  let fallbackBusy = false;
  const channelFailScore = {};
  const channelBufferScore = {};
  const channelStableScore = {};
  let bufferStartedAt = 0;
  let bufferSwitchTimer = null;
  let autoSwitchRetryTimer = null;
  let lastStableAt = 0;
  const dashSameSourceRetry = {};
  let switchAutoplayTimer = null;

  // MLBD FINAL AUTO-FALLBACK STABILITY FIX:
  // Auto-switch only on real playback failure, not on normal DASH/HLS buffering.
  // Prevents loop: one failed source -> backup URL -> one/two best stable channels -> stop/retry same.
  let autoFallbackSessionId = 0;
  let autoFallbackSwitchCount = 0;
  let autoFallbackSourceHopCount = 0;
  let autoFallbackStartedAt = 0;
  let lastAutoFallbackAt = 0;
  const autoFallbackTriedKeys = {};
  const AUTO_FALLBACK_MAX_CHANNEL_SWITCHES = 6;
  const AUTO_FALLBACK_MAX_SOURCE_HOPS = 3;
  const AUTO_FALLBACK_COOLDOWN_MS = 0; // source error hole cooldown chara next stable server/source
  const AUTO_FALLBACK_SWITCH_DELAY_MS = 3000; // failed source/channel max 3s countdown before switching
  const AUTO_FALLBACK_FINAL_RETRY_DELAY_MS = 6000;

  function resetAutoFallbackSession(){
    autoFallbackSessionId++;
    autoFallbackSwitchCount = 0;
    autoFallbackSourceHopCount = 0;
    autoFallbackStartedAt = Date.now();
    Object.keys(autoFallbackTriedKeys).forEach(function(k){ delete autoFallbackTriedKeys[k]; });
  }

  function isHardFailureReason(reason){
    const r = String(reason || '').toLowerCase();
    return !!(
      r.indexOf('failed') >= 0 || r.indexOf('fatal') >= 0 || r.indexOf('error') >= 0 ||
      r.indexOf('timeout') >= 0 || r.indexOf('unavailable') >= 0 || r.indexOf('not supported') >= 0 ||
      r.indexOf('403') >= 0 || r.indexOf('404') >= 0 || r.indexOf('bad_http_status') >= 0 ||
      r.indexOf('http_error') >= 0 || r.indexOf('manifest') >= 0 || r.indexOf('source') >= 0 ||
      r.indexOf('network failed') >= 0 || r.indexOf('media failed') >= 0
    );
  }

  function fallbackCooldownActive(){
    return lastAutoFallbackAt && (Date.now() - lastAutoFallbackAt) < AUTO_FALLBACK_COOLDOWN_MS;
  }

  const channelMap = {};
  CHANNELS.forEach(function(ch){ channelMap[ch.key] = ch; });

  function channelOptionLabel(ch){
    // Player dropdown should stay clean: channel name only, no quality/watching text.
    return (ch && ch.name) ? String(ch.name) : "LiveTV";
  }

  function renderChannelLogo(target, ch){
    if(!target) return;
    const name = channelOptionLabel(ch);
    const image = ch && ch.image ? String(ch.image) : "";
    if(image){
      target.innerHTML = '<img src="' + image.replace(/"/g, '&quot;') + '" alt="" loading="lazy" onerror="this.parentNode.innerHTML=\'<i class=&quot;fa fa-tv&quot;></i>\';">';
    }else{
      target.innerHTML = '<i class="fa fa-tv"></i>';
    }
    target.setAttribute("title", name);
  }

  function initBarChannelSelect(){
    if(barChannelSelect) barChannelSelect.innerHTML = "";
    if(barChannelMenu) barChannelMenu.innerHTML = "";
    CHANNELS.forEach(function(ch){
      if(!ch || !ch.key || ch.status === "hidden") return;
      if(typeof shouldShowChannelOnDevice === "function" && !shouldShowChannelOnDevice(ch)) return;
      if(barChannelSelect){
        const opt = document.createElement("option");
        opt.value = ch.key;
        opt.textContent = channelOptionLabel(ch);
        if(ch.status === "down") opt.disabled = true;
        barChannelSelect.appendChild(opt);
      }
      if(barChannelMenu){
        const item = document.createElement("button");
        item.type = "button";
        item.className = "bar-channel-item" + (ch.status === "down" ? " is-down" : "");
        item.setAttribute("role", "option");
        item.setAttribute("data-key", ch.key);
        item.disabled = ch.status === "down";
        item.innerHTML = '<span class="bar-channel-logo"></span><span class="bar-channel-name"></span>';
        item.querySelector(".bar-channel-name").textContent = channelOptionLabel(ch);
        renderChannelLogo(item.querySelector(".bar-channel-logo"), ch);
        barChannelMenu.appendChild(item);
      }
    });
    if(barChannelSelect && !barChannelSelect.options.length){
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No channel available";
      barChannelSelect.appendChild(opt);
    }
    if(barChannelMenu && !barChannelMenu.children.length){
      barChannelMenu.innerHTML = '<div class="bar-channel-item is-down">No channel available</div>';
    }
  }

  function syncBarChannelSelect(key){
    if(!key) return;
    const ch = channelMap[key] || null;
    if(barChannelSelect && barChannelSelect.value !== key) barChannelSelect.value = key;
    if(barChannelName) barChannelName.textContent = channelOptionLabel(ch);
    renderChannelLogo(barChannelLogo, ch);
    if(barChannelMenu){
      barChannelMenu.querySelectorAll(".bar-channel-item[data-key]").forEach(function(item){
        item.classList.toggle("is-active", item.getAttribute("data-key") === key);
      });
    }
  }

  // Channel dropdown/list is initialized after device detection so iPhone can show HLS-only servers.

  // iPhone/iPad playback support:
  // iOS Safari does not reliably support MSE/DASH/ClearKey. Use native HLS/MP4 only.
  const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  try{
    document.documentElement.classList.toggle("mlbd-ios-device", !!IS_IOS);
    document.body.classList.toggle("mlbd-ios-device", !!IS_IOS);
    if(iphonePlayerBtn){
      iphonePlayerBtn.remove();
    }
  }catch(e){}
  const IS_SAFARI = /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(navigator.userAgent || "");
  const NATIVE_HLS = !!(video && video.canPlayType && video.canPlayType("application/vnd.apple.mpegurl"));
  const MLBD_AUTOPLAY_MUTED_MODE = !!(IS_IOS || (IS_SAFARI && NATIVE_HLS));
  const MLBD_AUTOPLAY_UNMUTED_MODE = !MLBD_AUTOPLAY_MUTED_MODE;

  // Separate autoplay mode:
  // - iPhone/iPad/Safari native HLS: muted autoplay, user taps Sound to unmute.
  // - Android/Chrome/desktop web: unmuted autoplay first, muted fallback only if browser blocks sound autoplay.
  if(MLBD_AUTOPLAY_UNMUTED_MODE){
    userWantsSound = true;
    iosSoundUnlocked = true;
    try{
      if(video){
        video.muted = false;
        video.defaultMuted = false;
        video.volume = 1;
        video.removeAttribute("muted");
      }
    }catch(e){}
  }

  function prepareIOSVideo(){
    try{
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.setAttribute("x-webkit-airplay", "allow");
      video.setAttribute("autoplay", "");
      video.autoplay = true;
      video.playsInline = true;
      video.webkitPlaysInline = true;
      video.preload = "auto";

      if(MLBD_AUTOPLAY_MUTED_MODE){
        // iPhone/iPad/Safari native HLS must start muted for autoplay.
        video.defaultMuted = true;
        if(!iosSoundUnlocked){
          video.muted = true;
          video.volume = 0;
          video.setAttribute("muted", "muted");
        }
      }else if(userWantsSound){
        // Android/desktop web should start in unmuted autoplay mode.
        video.defaultMuted = false;
        video.muted = false;
        video.volume = 1;
        video.removeAttribute("muted");
      }
    }catch(e){}
  }
  prepareIOSVideo();

  function channelHasHls(ch){
    if(!ch) return false;
    const types = Array.isArray(ch.source_types) ? ch.source_types.map(function(t){ return String(t || "").toLowerCase(); }) : [];
    if(types.indexOf("hls") !== -1) return true;
    const raw = String(
      (ch.url || "") + "\n" +
      (ch.urls || "") + "\n" +
      (ch.fallback_urls || "") + "\n" +
      (ch.backup_urls || "") + "\n" +
      (ch.backups || "")
    ).toLowerCase();
    return raw.indexOf(".m3u8") !== -1;
  }

  function shouldShowChannelOnDevice(ch){
    if(!ch || !ch.key || ch.status === "hidden") return false;
    if(IS_IOS) return channelHasHls(ch);
    return true;
  }

  function deviceVisibleChannels(){
    return CHANNELS.filter(function(ch){ return shouldShowChannelOnDevice(ch); });
  }

  function applyIphoneHlsOnlyServers(){
    if(!IS_IOS) return;
    const visible = deviceVisibleChannels();
    const visibleKeys = {};
    visible.forEach(function(ch){ visibleKeys[ch.key] = true; });

    let n = 1;
    document.querySelectorAll(".channel-card[data-key]").forEach(function(card){
      const key = card.getAttribute("data-key") || "";
      const show = !!visibleKeys[key] || card.getAttribute("data-hls") === "1";
      card.hidden = !show;
      card.style.display = show ? "" : "none";
      card.setAttribute("aria-hidden", show ? "false" : "true");
      if(show){
        const num = card.querySelector(".server-number");
        if(num) num.textContent = String(n++).padStart(2, "0");
      }else{
        card.classList.remove("active");
      }
    });

    let s = 1;
    document.querySelectorAll("[data-side-channel]").forEach(function(row){
      const key = row.getAttribute("data-side-channel") || "";
      const show = !!visibleKeys[key] || row.getAttribute("data-hls") === "1";
      row.hidden = !show;
      row.style.display = show ? "" : "none";
      row.setAttribute("aria-hidden", show ? "false" : "true");
      if(show){
        const rank = row.querySelector(".side-rank");
        if(rank) rank.textContent = String(s++).padStart(2, "0");
      }
    });

    document.querySelectorAll(".switch-count").forEach(function(switchCount){
      switchCount.textContent = Math.max(visible.length, n - 1) + " channels";
    });

    const emptyState = document.getElementById("emptyState");
    if(emptyState){
      emptyState.textContent = visible.length ? "" : "iPhone এর জন্য কোনো HLS server পাওয়া যায়নি।";
      emptyState.style.display = visible.length ? "none" : "block";
    }

    const hiddenSaved = getLastChannelKey && getLastChannelKey();
    if(hiddenSaved && !visibleKeys[hiddenSaved]){
      try{ localStorage.removeItem("mlbd_livetv_last_channel"); localStorage.removeItem("mlbd_last_channel"); localStorage.removeItem("livetv_last_channel"); }catch(e){}
      try{ sessionStorage.removeItem("mlbd_livetv_last_channel"); sessionStorage.removeItem("mlbd_last_channel"); sessionStorage.removeItem("livetv_last_channel"); }catch(e){}
    }
  }

  initBarChannelSelect();
  applyIphoneHlsOnlyServers();

  function isSourcePlayableOnThisDevice(source){
    if(!source || !source.url) return false;
    const t = String(source.type || detectStreamType(source.url, "hls")).toLowerCase();
    const u = String(source.url || "").toLowerCase();
    if(IS_IOS){
      // iPhone/iPad: show/play HLS-only servers. Hide/skip MPD/DASH/MP4/other sources.
      return !!NATIVE_HLS && (t === "hls" || u.includes(".m3u8"));
    }
    if(IS_SAFARI && NATIVE_HLS){
      if(t === "dash" || t === "mpd" || u.includes(".mpd")) return false;
      if(t === "hls" || u.includes(".m3u8")) return true;
      if(t === "mp4" || u.match(/\.(mp4|m4v|mov)(\?|$)/)) return true;
      return false;
    }
    return true;
  }

  function getPlayableSources(ch){
    return getChannelSources(ch).filter(isSourcePlayableOnThisDevice);
  }

  // Public CHANNELS intentionally do not contain real stream URLs/DRM keys.
  // So restore/best-channel checks must NOT use getPlayableSources(publicChannel),
  // otherwise saved channel always looks unplayable after reload.
  function publicChannelCanPlay(ch){
    if(!ch || !ch.key) return false;
    if(ch.status === "hidden" || ch.status === "down") return false;
    if(!ch.play_token) return false;
    const types = Array.isArray(ch.source_types) ? ch.source_types.map(function(t){ return String(t || "").toLowerCase(); }) : [];
    if(IS_IOS){
      return channelHasHls(ch);
    }
    if(!types.length) return true;
    if(IS_SAFARI && NATIVE_HLS){
      return types.some(function(t){ return t === "hls" || t === "file" || t === "mp4"; });
    }
    return true;
  }

  function validChannelKey(key){
    key = String(key || "").trim();
    return key && channelMap[key] && publicChannelCanPlay(channelMap[key]) ? key : "";
  }

  function setCookie(name, value, days){
    try{
      var maxAge = Math.max(1, Number(days || 365)) * 86400;
      document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(String(value || "")) + "; Max-Age=" + maxAge + "; Path=/; SameSite=Lax";
    }catch(e){}
  }
  function getCookie(name){
    try{
      var key = encodeURIComponent(name) + "=";
      var list = String(document.cookie || "").split(";");
      for(var i=0;i<list.length;i++){
        var item = list[i].trim();
        if(item.indexOf(key) === 0) return decodeURIComponent(item.slice(key.length));
      }
    }catch(e){}
    return "";
  }
  function saveLastChannelKey(key){
    key = String(key || "").trim();
    if(!key) return;
    // Save same value under every old/new key used by old UI scripts so reload/auto-best never overrides selection.
    try{
      localStorage.setItem("mlbd_livetv_channel", key);
      localStorage.setItem("mlbd_livetv_current_channel", key);
      localStorage.setItem("mlbd_livetv_last_channel", key);
      localStorage.setItem("mlbd_last_channel", key);
      localStorage.setItem("livetv_last_channel", key);
    }catch(e){}
    try{
      sessionStorage.setItem("mlbd_livetv_channel", key);
      sessionStorage.setItem("mlbd_livetv_current_channel", key);
      sessionStorage.setItem("mlbd_livetv_last_channel", key);
      sessionStorage.setItem("mlbd_last_channel", key);
      sessionStorage.setItem("livetv_last_channel", key);
    }catch(e){}
    setCookie("mlbd_livetv_channel", key, 365);
    setCookie("mlbd_livetv_current_channel", key, 365);
    setCookie("mlbd_livetv_last_channel", key, 365);
    setCookie("mlbd_last_channel", key, 365);
    setCookie("livetv_last_channel", key, 365);
  }
  function getLastChannelKey(){
    // Read from multiple storages because some browsers/CDN flows may block one of them.
    // Priority: localStorage > sessionStorage > cookie > older fallback keys.
    var keys = [
      "mlbd_livetv_channel",
      "mlbd_livetv_current_channel",
      "mlbd_livetv_last_channel",
      "mlbd_last_channel",
      "livetv_last_channel"
    ];
    for(var i=0;i<keys.length;i++){
      try{
        var v1 = localStorage.getItem(keys[i]) || "";
        if(validChannelKey(v1)) return v1;
      }catch(e){}
      try{
        var v2 = sessionStorage.getItem(keys[i]) || "";
        if(validChannelKey(v2)) return v2;
      }catch(e){}
      var v3 = getCookie(keys[i]) || "";
      if(validChannelKey(v3)) return v3;
    }
    return "";
  }
  function forceSavePlayerState(){
    try{
      if(currentKey) saveLastChannelKey(currentKey);
      if(currentKey && qualitySelect){
        var qv = qualitySelect.value || "auto";
        if(qv) saveQuality(currentKey, qv);
      }
    }catch(e){}
  }

  

  function normalizeUrlList(value){
    const out = [];
    function push(v){
      v = String(v || "").trim();
      if(!v) return;
      if(!/^https?:\/\//i.test(v) && v.charAt(0) !== "/") return;
      if(!out.includes(v)) out.push(v);
    }
    if(Array.isArray(value)) value.forEach(push);
    else String(value || "").split(/[\n,|]+/).forEach(push);
    return out;
  }

  function detectStreamType(url, fallback){
    url = String(url || "").toLowerCase();
    fallback = String(fallback || "hls").toLowerCase();
    if(url.includes(".mpd")) return "dash";
    if(url.includes(".m3u8")) return "hls";
    if(url.match(/\.(mp4|webm|mov|m4v)(\?|$)/)) return "mp4";
    return fallback || "hls";
  }

  function getChannelSources(ch){
    const urls = [];
    normalizeUrlList(ch && ch.url).forEach(function(u){ urls.push(u); });
    normalizeUrlList(ch && (ch.fallback_urls || ch.urls || ch.backup_urls || ch.backups)).forEach(function(u){ urls.push(u); });
    const unique = [];
    urls.forEach(function(u){ if(!unique.includes(u)) unique.push(u); });
    return unique.map(function(u){
      return {
        url:u,
        type:detectStreamType(u, ch && ch.type),
        drm:ch && ch.drm,
        key_id:ch && ch.key_id,
        key_value:ch && ch.key_value
      };
    });
  }

  function qualityScoreFromText(value){
    value = String(value || "").toLowerCase();
    if(value.indexOf("4k") >= 0 || value.indexOf("2160") >= 0) return 260;
    if(value.indexOf("1440") >= 0 || value.indexOf("2k") >= 0) return 210;
    if(value.indexOf("1080") >= 0 || value.indexOf("fhd") >= 0) return 170;
    if(value.indexOf("720") >= 0 || value.indexOf("hd") >= 0) return 120;
    if(value.indexOf("480") >= 0) return 70;
    return 40;
  }

  function sourceTypeScore(ch){
    const types = Array.isArray(ch && ch.source_types) ? ch.source_types.map(function(t){ return String(t || "").toLowerCase(); }) : [];
    let score = 0;
    if(types.indexOf("hls") !== -1) score += 90;
    if(types.indexOf("dash") !== -1 || types.indexOf("mpd") !== -1) score += 75;
    if(types.indexOf("file") !== -1 || types.indexOf("mp4") !== -1) score += 35;
    return score;
  }

  function channelScore(ch){
    if(!ch || ch.status === "hidden" || ch.status === "down") return -1;
    if(!shouldShowChannelOnDevice(ch)) return -1;
    let score = 0;
    if(ch.status === "live") score += 1600;
    else if(ch.status === "upcoming") score += 200;
    score += qualityScoreFromText((ch.resolution || "") + " " + (ch.quality || ""));
    score += sourceTypeScore(ch);
    score += Math.min(180, Math.max(0, Number(ch.source_count || 0)) * 45);
    score += Math.min(130, Math.max(0, Number(ch.live || 0)) / 10);
    score += Math.min(80, Math.max(0, Number(ch.views || 0)) / 100);
    score -= (channelBufferScore[ch.key] || 0) * 120;
    score -= (channelFailScore[ch.key] || 0) * 260;
    score += (channelStableScore[ch.key] || 0) * 80;
    return score;
  }

  function sortOrderValue(ch){
    var n = Number(ch && ch.sort);
    return isFinite(n) ? n : 9999;
  }

  function sortedFallbackChannels(){
    return CHANNELS.filter(function(ch){ return ch && ch.key && publicChannelCanPlay(ch) && channelScore(ch) >= -500; })
      .slice()
      .sort(function(a,b){
        var diff = channelScore(b) - channelScore(a);
        if(Math.abs(diff) > 0.001) return diff;
        return (sortOrderValue(a)-sortOrderValue(b)) || String(a.name||'').localeCompare(String(b.name||''));
      });
  }

  function bestChannelKey(exclude){
    // Fallback goes to the best available source: live + stable + higher quality + more backup sources.
    exclude = exclude || {};
    var list = sortedFallbackChannels();
    for(var i=0; i<list.length; i++){
      var ch = list[i];
      if(!ch || !ch.key || exclude[ch.key]) continue;
      return ch.key;
    }
    return null;
  }

  function firstPlayableKey(){
    // Hard sync fix: URL/channel card choice wins over old localStorage cookie.
    // This prevents public player title/active card/source mismatch after cache or previous saved channel.
    let urlKey = "";
    try{
      const sp = new URLSearchParams(window.location.search || "");
      urlKey = validChannelKey(sp.get("ch") || sp.get("channel") || sp.get("server") || sp.get("key") || "");
    }catch(e){}
    let activeCardKey = "";
    try{
      const activeCard = document.querySelector(".channel-card.active[data-key]");
      activeCardKey = activeCard ? validChannelKey(activeCard.getAttribute("data-key") || "") : "";
    }catch(e){}
    const savedKey = validChannelKey(getLastChannelKey());
    const serverKey = validChannelKey(SERVER_SELECTED_KEY);
    // Reload must restore user's last selected channel. URL ?ch= still wins for direct share/debug.
    return urlKey || savedKey || activeCardKey || serverKey || bestChannelKey({}) || (CHANNELS[0] && publicChannelCanPlay(CHANNELS[0]) ? CHANNELS[0].key : null);
  }

  function markChannelFailed(key){
    if(!key) return;
    channelFailScore[key] = (channelFailScore[key] || 0) + 1;
    channelStableScore[key] = Math.max(0, (channelStableScore[key] || 0) - 1);
  }

  function markChannelBuffered(key){
    if(!key) return;
    channelBufferScore[key] = Math.min(8, (channelBufferScore[key] || 0) + 1);
    channelStableScore[key] = Math.max(0, (channelStableScore[key] || 0) - 1);
  }

  function markChannelStable(key){
    if(!key) return;
    channelStableScore[key] = Math.min(8, (channelStableScore[key] || 0) + 1);
    if(channelBufferScore[key]) channelBufferScore[key] = Math.max(0, channelBufferScore[key] - 1);
    if(channelFailScore[key]) channelFailScore[key] = Math.max(0, channelFailScore[key] - 1);
    lastStableAt = Date.now();
  }

  function clearChannelFailure(key){
    if(key && channelFailScore[key]) channelFailScore[key] = Math.max(0, channelFailScore[key] - 1);
  }

  function fallbackCountdownThenPlay(message, key, opts){
    // Failed source/channel switches within 3 seconds. Normal buffering never calls this.
    var sid = autoFallbackSessionId;
    if(sid !== autoFallbackSessionId || !currentKey || userPaused){ fallbackBusy=false; return; }
    var delay = Math.max(0, Number((opts && opts.delayMs) || AUTO_FALLBACK_SWITCH_DELAY_MS));
    var until = Date.now() + delay;
    function paint(){
      var left = Math.max(0, Math.ceil((until - Date.now()) / 1000));
      var text = (message || "Source failed") + " • switching in " + left + "s";
      setWatchState(text);
      if(statusText) statusText.textContent = "Switching in " + left + "s";
    }
    paint();
    var tick = setInterval(function(){
      if(sid !== autoFallbackSessionId || userPaused){ clearInterval(tick); fallbackBusy=false; return; }
      paint();
    }, 250);
    setTimeout(function(){
      clearInterval(tick);
      fallbackBusy = false;
      if(sid !== autoFallbackSessionId || userPaused) return;
      playStream(key, opts || {auto:true});
    }, delay);
  }

  function autoFallback(reason){
    if(!currentKey || userPaused) return;

    const hardFailure = isHardFailureReason(reason);

    // Normal DASH buffering/waiting is not a failure. Keep same 4K/DASH source alive.
    if(currentStreamType === "dash" && !hardFailure){
      hideLoader();
      hideError();
      if(statusText) statusText.textContent = "DASH retrying";
      setWatchState(reason ? ("DASH retrying • " + reason) : "DASH retrying • keeping same source");
      if(shakaPlayer){ try{ shakaPlayer.retryStreaming(); }catch(e){} }
      return;
    }

    // Quality selection must never jump to another/best channel.
    try{
      const qSelecting = !!(window.__mlbdQualitySelecting || (playerCard && playerCard.getAttribute('data-quality-selecting') === '1'));
      const recentManual = !!(manualQualitySwitchAt && manualQualitySwitchChannel === currentKey && (Date.now() - manualQualitySwitchAt) < 3500);
      const qReason = String(reason || '').toLowerCase();
      if(qSelecting || (recentManual && (qReason.indexOf('dash') >= 0 || qReason.indexOf('quality') >= 0 || qReason.indexOf('variant') >= 0 || qReason.indexOf('stream error') >= 0))){
        setWatchState('Manual quality kept • same channel');
        if(statusText) statusText.textContent = 'Manual quality';
        return;
      }
    }catch(e){}

    const failedKey = currentKey;
    const hasBackupSource = !!(failedKey && currentSourceList && currentSourceIndex + 1 < currentSourceList.length && autoFallbackSourceHopCount < AUTO_FALLBACK_MAX_SOURCE_HOPS);
    if(fallbackBusy || (fallbackCooldownActive() && !hasBackupSource)){
      if(currentStreamType === "dash" && shakaPlayer){ try{ shakaPlayer.retryStreaming(); }catch(e){} }
      return;
    }
    fallbackBusy = true;
    if(!hasBackupSource) lastAutoFallbackAt = Date.now();

    hideError();
    hideLoader();
    if(failedKey) autoFallbackTriedKeys[failedKey] = true;

    setWatchState("Auto switching • Finding stable stream");
    if(statusText) statusText.textContent = "Auto switching";

    // 1) Same channel backup URL first. This is safer and fast; cooldown does not block source hopping.
    if(hasBackupSource){
      autoFallbackSourceHopCount++;
      const nextSource = currentSourceIndex + 1;
      fallbackCountdownThenPlay("Source error", failedKey, {sourceIndex:nextSource, auto:true, reason:reason || "backup source"});
      return;
    }

    // 2) Switch to a stable live channel only a limited number of times.
    markChannelFailed(failedKey);
    const exclude = {};
    Object.keys(autoFallbackTriedKeys).forEach(function(k){ exclude[k] = true; });
    let nextKey = null;
    if(autoFallbackSwitchCount < AUTO_FALLBACK_MAX_CHANNEL_SWITCHES){
      nextKey = bestChannelKey(exclude);
    }

    if(nextKey && nextKey !== failedKey){
      autoFallbackSwitchCount++;
      autoFallbackTriedKeys[nextKey] = true;
      fallbackCountdownThenPlay("Source error", nextKey, {sourceIndex:0, auto:true, reason:reason || "channel fallback"});
      return;
    }

    // 3) Loop guard: do not keep jumping forever. Retry current selected source quietly.
    if(autoSwitchRetryTimer) clearTimeout(autoSwitchRetryTimer);
    autoSwitchRetryTimer = setTimeout(function(){
      autoSwitchRetryTimer = null;
      if(!currentKey || userPaused) return;
      if(currentStreamType === "dash" && shakaPlayer){
        try{ shakaPlayer.retryStreaming(); }catch(e){}
        setWatchState("DASH retrying • no more auto switch");
        if(statusText) statusText.textContent = "Retrying DASH";
      }else if(failedKey){
        setWatchState("Retrying selected stream • no loop");
        if(statusText) statusText.textContent = "Retrying";
        playStream(failedKey, {sourceIndex:0, auto:true, reason:reason || "final retry"});
      }
    }, AUTO_FALLBACK_FINAL_RETRY_DELAY_MS);
  }

  function shortNumber(n){
    n = Number(n || 0);
    if(n >= 1000000000) return (n/1000000000).toFixed(2).replace(/\.00$/,"").replace(/0$/,"") + "B";
    if(n >= 1000000) return (n/1000000).toFixed(2).replace(/\.00$/,"").replace(/0$/,"") + "M";
    if(n >= 1000) return (n/1000).toFixed(2).replace(/\.00$/,"").replace(/0$/,"") + "K";
    return String(Math.floor(n));
  }

  function bestResolutionFromList(list){
    const heights = [];
    (list || []).forEach(function(x){
      const h = Number(x && (x.height || x.videoHeight || x.bandwidthHeight));
      if(h > 0) heights.push(h);
    });
    if(!heights.length) return "Auto";
    const max = Math.max.apply(null, heights);
    if(max >= 2160) return "4K";
    if(max >= 1440) return "1440p";
    if(max >= 1080) return "1080p";
    if(max >= 720) return "720p";
    if(max >= 480) return "480p";
    return max + "p";
  }

  function qualityLabel(height, bitrate, fps){
    height = Number(height || 0);
    bitrate = Number(bitrate || 0);
    fps = Number(fps || 0);
    let label = "Auto";
    if(height >= 2160) label = Math.round(height) + "p 4K";
    else if(height >= 720) label = Math.round(height) + "p HD";
    else if(height > 0) label = Math.round(height) + "p SD";
    else if(bitrate > 0) label = Math.round((bitrate / 1000000) * 10) / 10 + " Mbps";
    if(bitrate >= 1000000 && label !== "Auto"){
      const mb = Math.round((bitrate / 1000000) * 10) / 10;
      label += " (" + mb + " Mbps)";
    }else if(bitrate >= 1000 && label !== "Auto"){
      label += " (" + Math.round(bitrate / 1000) + " Kbps)";
    }
    if(fps >= 45 && label !== "Auto") label += " " + Math.round(fps) + "Fps";
    return label;
  }

  function compactQualityLabel(height, fps){
    height = Number(height || 0); fps = Number(fps || 0);
    let label = height >= 2160 ? "4K" : (height > 0 ? height + "p" : "Auto");
    if(height >= 720 && height < 2160) label += " HD";
    if(fps >= 50 && label !== "Auto") label += " " + Math.round(fps) + "FPS";
    return label;
  }

  function realVideoHeight(){
    try{ return Number(video && video.videoHeight ? video.videoHeight : 0) || 0; }catch(e){ return 0; }
  }

  function validDashQualityTracks(){
    if(!shakaPlayer || !shakaPlayer.getVariantTracks) return [];
    let tracks = [];
    try{ tracks = shakaPlayer.getVariantTracks() || []; }catch(e){ tracks = []; }

    const usedIds = {};
    return tracks.filter(function(t){
      if(!t) return false;
      const id = t.id;
      const h = Number(t.height || 0);
      const w = Number(t.width || 0);
      if(id === undefined || id === null || id === "") return false;
      if(usedIds[String(id)]) return false;
      if(t.allowedByApplication === false || t.allowedByKeySystem === false) return false;
      if(!Number.isFinite(h) || h < 144) return false;
      if(w && w < 144) return false;
      usedIds[String(id)] = true;
      return true;
    }).sort(function(a,b){
      const ah = Number(a.height || 0), bh = Number(b.height || 0);
      const ab = Number(a.bandwidth || a.videoBandwidth || 0), bb = Number(b.bandwidth || b.videoBandwidth || 0);
      const af = Number(a.frameRate || a.framerate || 0), bf = Number(b.frameRate || b.framerate || 0);
      return (bh - ah) || (bb - ab) || (bf - af) || (Number(a.id || 0) - Number(b.id || 0));
    });
  }

  function isRecentManualQualitySwitch(){
    return !!(manualQualitySwitchAt && manualQualitySwitchChannel === currentKey && (Date.now() - manualQualitySwitchAt) < 45000);
  }

  function manualQualityLocked(){
    return currentQualityMode === "manual" && isRecentManualQualitySwitch();
  }

  function normalizeQualityMenuLabel(label){
    label = String(label || "").trim();
    if(!label || label.toLowerCase() === "smart auto") return "Auto";
    return label.replace(/\s+/g," ");
  }

  function uniqueQualityOptions(options){
    const used = {};
    const out = [];
    (options || []).forEach(function(opt){
      if(!opt || !opt.value) return;
      const label = normalizeQualityMenuLabel(opt.label || opt.value);
      if(!label) return;
      const h = Number(opt.height || 0);
      const fps = Number(opt.fps || 0);
      const bw = Number(opt.bandwidth || opt.bitrate || 0);
      // Keep every real rendition: same 1080p with 8 Mbps, 6 Mbps, 5 Mbps must all show.
      // Only remove exact duplicate option values/labels.
      const key = String(opt.value) + "|" + label.toLowerCase() + "|" + h + "|" + bw + "|" + (fps ? Math.round(fps) : 0);
      if(used[key]) return;
      used[key] = true;
      out.push(Object.assign({}, opt, {label: label, bandwidth: bw || opt.bandwidth || opt.bitrate || 0}));
    });
    return out;
  }

  function savedQualityKey(channelKey){ return "mlbd_livetv_quality_" + String(channelKey || ""); }

  function getSavedQuality(channelKey){
    var key = savedQualityKey(channelKey);
    var q = "";
    try{ q = localStorage.getItem(key) || sessionStorage.getItem(key) || ""; }catch(e){}
    // Per-channel only: do not borrow another channel's last quality.
    return q || getCookie(key) || "";
  }

  function getStorageValue(key){
    key = String(key || "");
    if(!key) return "";
    try{ var v1 = localStorage.getItem(key) || ""; if(v1) return v1; }catch(e){}
    try{ var v2 = sessionStorage.getItem(key) || ""; if(v2) return v2; }catch(e){}
    return getCookie(key) || "";
  }

  function setStorageValue(key, value, days){
    key = String(key || "");
    value = String(value || "");
    if(!key) return;
    try{ localStorage.setItem(key, value); }catch(e){}
    try{ sessionStorage.setItem(key, value); }catch(e){}
    setCookie(key, value, days || 365);
  }

  function selectedQualityMeta(){
    var meta = {value:"auto", label:"Auto", height:0, fps:0, bandwidth:0};
    try{
      if(!qualitySelect) return meta;
      var opt = qualitySelect.options[qualitySelect.selectedIndex];
      if(!opt) return meta;
      meta.value = String(opt.value || "auto");
      meta.label = normalizeQualityMenuLabel(opt.textContent || "Auto");
      meta.height = Number(opt.getAttribute("data-height") || 0) || 0;
      meta.fps = Number(opt.getAttribute("data-fps") || 0) || 0;
      meta.bandwidth = Number(opt.getAttribute("data-bandwidth") || 0) || 0;
    }catch(e){}
    return meta;
  }

  function getSavedQualityMeta(channelKey){
    var key = savedQualityKey(channelKey);
    var meta = {value:getSavedQuality(channelKey), label:"", height:0, fps:0, bandwidth:0};
    try{
      var raw = getStorageValue(key + "_meta");
      if(raw){
        var parsed = JSON.parse(raw);
        if(parsed && typeof parsed === "object"){
          meta.value = String(parsed.value || meta.value || "");
          meta.label = String(parsed.label || "");
          meta.height = Number(parsed.height || 0) || 0;
          meta.fps = Number(parsed.fps || 0) || 0;
          meta.bandwidth = Number(parsed.bandwidth || 0) || 0;
        }
      }
    }catch(e){}
    if(!meta.label) meta.label = String(getStorageValue(key + "_label") || "");
    return meta;
  }

  function saveQuality(channelKey, value){
    if(!channelKey) return;
    value = value || "auto";
    var key = savedQualityKey(channelKey);
    setStorageValue(key, value, 365);
    setStorageValue("mlbd_livetv_last_quality", value, 365);
    try{
      var meta = selectedQualityMeta();
      meta.value = String(value || meta.value || "auto");
      if(!meta.label) meta.label = selectedQualityLabel ? selectedQualityLabel() : "Auto";
      setStorageValue(key + "_label", meta.label || "Auto", 365);
      setStorageValue(key + "_meta", JSON.stringify(meta), 365);
      setStorageValue("mlbd_livetv_last_quality_label", meta.label || "Auto", 365);
    }catch(e){}
  }

  function resetQualitySelector(label){
    currentQualityMode = "auto";
    const cleanLabel = "Auto";
    currentQualityOptions = [{value:"auto", label:cleanLabel, height:0, fps:0}];
    if(!qualitySelect) return;
    qualitySelect.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "auto";
    opt.textContent = cleanLabel;
    qualitySelect.appendChild(opt);
    qualitySelect.value = "auto";
    qualitySelect.disabled = true;
    updateQualityButtonFinalSafe();
  }

  function bestQualityValue(options){
    options = options || [];
    // Default should be Auto for smooth playback; menu still shows every valid high quality.
    return "auto";
  }

  function setQualityOptions(options, selectedValue){
    if(!qualitySelect) return;
    const previousVal = qualitySelect.value || "";
    options = uniqueQualityOptions(options || []);
    if(!options.length) options = [{value:"auto", label:"Auto", height:0, fps:0}];
    currentQualityOptions = options;
    const selectingNow = !!(window.__mlbdQualitySelecting || (playerCard && playerCard.getAttribute("data-quality-selecting") === "1"));
    const keepManual = (manualQualityLocked() || selectingNow) && previousVal && options.some(function(opt){ return opt.value === previousVal; });
    qualitySelect.innerHTML = "";
    options.forEach(function(opt){
      const el = document.createElement("option");
      el.value = opt.value;
      el.textContent = normalizeQualityMenuLabel(opt.label);
      if(opt.height) el.setAttribute("data-height", String(opt.height));
      if(opt.fps) el.setAttribute("data-fps", String(opt.fps));
      if(opt.bandwidth) el.setAttribute("data-bandwidth", String(opt.bandwidth));
      qualitySelect.appendChild(el);
    });
    const exists = options.some(function(opt){ return opt.value === selectedValue; });
    qualitySelect.value = keepManual ? previousVal : (exists && selectedValue ? selectedValue : bestQualityValue(options));
    qualitySelect.disabled = options.length <= 1;
    try{ qualitySelect.setAttribute("data-mlbd-quality-count", String(options.length)); }catch(e){}
    updateQualityButtonFinalSafe();
  }

  function selectedQualityLabel(){
    if(!qualitySelect) return "Auto";
    const opt = qualitySelect.options[qualitySelect.selectedIndex];
    return opt ? normalizeQualityMenuLabel(opt.textContent) : "Auto";
  }

  function chooseDefaultQualityValue(options, saved){
    options = options || [];
    saved = String(saved || "");
    if(saved && options.some(function(opt){ return opt.value === saved; })) return saved;

    var meta = getSavedQualityMeta(currentKey);
    var savedLabel = String(meta.label || "").trim().toLowerCase();
    if(savedLabel){
      var byLabel = options.find(function(opt){ return normalizeQualityMenuLabel(opt.label || "").toLowerCase() === savedLabel; });
      if(byLabel) return byLabel.value;
    }

    var savedHeight = Number(meta.height || 0) || 0;
    var savedFps = Number(meta.fps || 0) || 0;
    var savedBandwidth = Number(meta.bandwidth || 0) || 0;
    if(savedHeight > 0){
      var sameHeight = options.filter(function(opt){ return Number(opt.height || 0) === savedHeight; });
      if(sameHeight.length){
        if(savedFps > 0){
          var sameFps = sameHeight.find(function(opt){ return Math.round(Number(opt.fps || 0)) === Math.round(savedFps); });
          if(sameFps) return sameFps.value;
        }
        if(savedBandwidth > 0){
          sameHeight.sort(function(a,b){ return Math.abs(Number(a.bandwidth || 0) - savedBandwidth) - Math.abs(Number(b.bandwidth || 0) - savedBandwidth); });
        }
        return sameHeight[0].value;
      }
    }

    // If a channel previously saved manual quality but the player generated new DASH track ids,
    // keep the same quality by text/height instead of falling back to Auto.
    return "auto";
  }

  function selectBestHlsAudio(){
    if(!hls) return;
    try{
      const tracks = hls.audioTracks || [];
      if(!tracks.length) return;
      let best = 0;
      tracks.forEach(function(t, i){
        const n = String((t && (t.name || t.lang || t.groupId)) || "").toLowerCase();
        const current = tracks[best] || {};
        const curName = String(current.name || current.lang || current.groupId || "").toLowerCase();
        if(t && (t.default || t.autoselect) && !(current.default || current.autoselect)) best = i;
        if(n.includes("eng") && !curName.includes("eng")) best = i;
        if(n.includes("main") && !curName.includes("main")) best = i;
      });
      hls.audioTrack = best;
    }catch(e){}
  }

  function selectBestDashAudio(){
    if(!shakaPlayer) return;
    try{
      const audioTracks = shakaPlayer.getAudioTracks ? shakaPlayer.getAudioTracks() : [];
      if(audioTracks && audioTracks.length){
        let picked = audioTracks.find(function(t){ return t && t.active; })
          || audioTracks.find(function(t){ return t && String(t.language || "").toLowerCase().startsWith("en"); })
          || audioTracks[0];
        if(picked && shakaPlayer.selectAudioTrack) shakaPlayer.selectAudioTrack(picked, true);
      }else if(shakaPlayer.selectAudioLanguage){
        shakaPlayer.selectAudioLanguage("en");
      }
    }catch(e){}
  }

  function applyHlsQuality(value){
    if(!hls) return;
    value = value || "auto";
    currentQualityMode = value === "auto" ? "auto" : "manual";
    try{
      if(value === "auto"){
        hls.currentLevel = -1; hls.loadLevel = -1; hls.nextLevel = -1; hls.startLevel = -1; hls.autoLevelCapping = -1;
        try{ if(typeof hls.nextAutoLevel === "number") hls.nextAutoLevel = -1; }catch(e){}
        smoothInitialAutoCap();
        setResolutionLabel(bestResolutionFromList(hls.levels));
        setWatchState("Auto • Highest available when stable");
        scheduleSmartHdBoost("hls-auto");
      }else if(value.indexOf("hls:") === 0){
        manualQualitySwitchAt = Date.now();
        manualQualitySwitchChannel = currentKey || "";
        const idx = parseInt(value.split(":")[1], 10);
        if(Number.isFinite(idx) && hls.levels && hls.levels[idx]){
          const lv = hls.levels[idx];
          hls.autoLevelCapping = -1; hls.currentLevel = idx; hls.loadLevel = idx; hls.nextLevel = idx;
          setResolutionLabel(qualityLabel(lv.height, lv.bitrate, lv.frameRate || lv.attrs && lv.attrs["FRAME-RATE"]));
          setWatchState("Manual quality selected • " + qualityLabel(lv.height, lv.bitrate, lv.frameRate || lv.attrs && lv.attrs["FRAME-RATE"]));
        }else{
          setWatchState("Selected quality not available in this source");
          if(qualitySelect && qualitySelect.value !== value) qualitySelect.value = value;
          return;
        }
      }
      saveQuality(currentKey, value);
      pingStats("heartbeat");
    }catch(e){}
  }

  function updateQualityButtonFinalSafe(){
    try{
      const label = selectedQualityLabel();
      document.querySelectorAll('#mlbdQualityV11Btn .mlbd-qv11-text, #mlbdV8QualityBtn span, #mlbdV6QualityBtn span, .mlbd-v6-quality-btn span').forEach(function(btn){
        if(btn) btn.textContent = label || 'Auto';
      });
      if(window.mlbdQualityV11Sync) window.mlbdQualityV11Sync();
    }catch(e){}
  }

  function buildHlsQualitySelector(applyNow){
    if(!hls || !hls.levels || !hls.levels.length){ if(!manualQualityLocked()) resetQualitySelector("Auto"); return; }
    const opts = [{value:"auto", label:"Auto", height:0, fps:0}];
    hls.levels.map(function(level, idx){ return {level:level, idx:idx}; })
      .filter(function(item){ return Number(item.level.height || 0) >= 144; })
      .sort(function(a,b){
        return (Number(b.level.height||0)-Number(a.level.height||0)) || (Number(b.level.bitrate||0)-Number(a.level.bitrate||0));
      }).forEach(function(item){
        const fps = Number(item.level.frameRate || (item.level.attrs && item.level.attrs["FRAME-RATE"]) || 0);
        const label = qualityLabel(item.level.height, item.level.bitrate, fps);
        if(label && label !== "Auto") opts.push({value:"hls:" + item.idx, label:label, height:Number(item.level.height||0), fps:fps, bandwidth:Number(item.level.bitrate||0)});
      });
    const selected = chooseDefaultQualityValue(opts, getSavedQuality(currentKey));
    setQualityOptions(opts, selected);
    selectBestHlsAudio();
    if(applyNow !== false) applyHlsQuality(qualitySelect && qualitySelect.value ? qualitySelect.value : selected);
  }

  function buildShakaQualitySelector(applyNow){
    if(!shakaPlayer){ if(!manualQualityLocked()) resetQualitySelector("Auto"); return; }
    const tracks = validDashQualityTracks();
    if(!tracks.length){ if(!manualQualityLocked()) resetQualitySelector("Auto"); updateQualityButtonFinalSafe(); return; }
    const opts = [{value:"auto", label:"Auto", height:0, fps:0}];
    tracks.forEach(function(track){
      const fps = Number(track.frameRate || track.framerate || 0);
      const label = qualityLabel(track.height, track.bandwidth || track.videoBandwidth, fps);
      if(label && label !== "Auto") opts.push({value:"dash:" + track.id, label:label, height:Number(track.height||0), fps:fps, bandwidth:Number(track.bandwidth || track.videoBandwidth || 0)});
    });
    const selected = chooseDefaultQualityValue(opts, getSavedQuality(currentKey));
    setQualityOptions(opts, selected);
    selectBestDashAudio();
    if(applyNow === true) applyDashQuality(qualitySelect && qualitySelect.value ? qualitySelect.value : selected);
    updateQualityButtonFinalSafe();
  }

  function applyDashQuality(value){
    if(!shakaPlayer) return;
    value = value || "auto";
    currentQualityMode = value === "auto" ? "auto" : "manual";
    try{
      if(value === "auto"){
        shakaPlayer.configure({abr:{enabled:true, defaultBandwidthEstimate:isSlowConnection()?1200000:8000000, switchInterval:1, clearBufferSwitch:false}});
        const tracks = validDashQualityTracks();
        setResolutionLabel(bestResolutionFromList(tracks));
        setWatchState("Auto • Highest available when stable");
        scheduleSmartHdBoost("dash-auto");
      }else if(value.indexOf("dash:") === 0){
        manualQualitySwitchAt = Date.now();
        manualQualitySwitchChannel = currentKey || "";
        const id = Number(value.split(":")[1]);
        const tracks = validDashQualityTracks();
        const track = tracks.find(function(t){ return Number(t.id) === id; });
        if(track){
          shakaPlayer.configure({abr:{enabled:false}});
          shakaPlayer.selectVariantTrack(track, true);
          setResolutionLabel(qualityLabel(track.height, track.bandwidth || track.videoBandwidth, track.frameRate));
          setWatchState("Manual quality selected • " + qualityLabel(track.height, track.bandwidth || track.videoBandwidth, track.frameRate));
        }else{
          setWatchState("Selected quality not available in this source");
          if(qualitySelect && qualitySelect.value !== value) qualitySelect.value = value;
          return;
        }
      }
      saveQuality(currentKey, value);
      pingStats("heartbeat");
    }catch(e){}
  }

  function applySelectedQuality(){
    const value = qualitySelect ? qualitySelect.value : "auto";
    if(value.indexOf("hls:") === 0 || (hls && value === "auto")) applyHlsQuality(value);
    else if(value.indexOf("dash:") === 0 || (shakaPlayer && value === "auto")) applyDashQuality(value);
    else setResolutionLabel(selectedQualityLabel());
    updateQualityButtonFinalSafe();
    showPlayerControls();
  }

  function setResolutionLabel(label){
    currentResolutionLabel = label || "Auto";
    if(currentResolution) currentResolution.textContent = currentResolutionLabel;
    if(currentKey){
      const resEl = document.querySelector('[data-res-key="' + CSS.escape(currentKey) + '"]');
      if(resEl) resEl.textContent = currentResolutionLabel;
    }
  }

  function setWatchState(text){
    if(watchPlaybackState) watchPlaybackState.textContent = text || "Live now • Auto quality • Smooth playback";
  }

  function isSlowConnection(){
    try{
      const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if(!c) return false;
      const type = String(c.effectiveType || "").toLowerCase();
      return !!(c.saveData || type === "slow-2g" || type === "2g" || type === "3g" || Number(c.downlink || 99) < 2.2);
    }catch(e){ return false; }
  }

  function applyHdrHdEnhancement(){
    try{
      if(videoContainer) videoContainer.classList.add("hd-hdr-enhance");
      // Prefer a little sharper browser rendering while staying subtle.
      if(video){
        video.style.imageRendering = "auto";
        video.style.webkitFontSmoothing = "antialiased";
      }
    }catch(e){}
  }

  function bestHdHlsLevelIndex(minHeight){
    if(!hls || !hls.levels || !hls.levels.length) return -1;
    minHeight = Number(minHeight || 720);
    let best = -1;
    let bestScore = -1;
    hls.levels.forEach(function(level, idx){
      const h = Number(level.height || 0);
      const b = Number(level.bitrate || 0);
      if(h >= minHeight){
        // Prefer 1080p/HD. Avoid jumping to 4K on unstable live streams unless it is the only HD-ish option.
        const score = (h > 1080 ? 1080 : h) * 100000000 + b;
        if(score > bestScore){ bestScore = score; best = idx; }
      }
    });
    if(best < 0){
      hls.levels.forEach(function(level, idx){
        const h = Number(level.height || 0);
        const b = Number(level.bitrate || 0);
        const score = h * 100000000 + b;
        if(score > bestScore){ bestScore = score; best = idx; }
      });
    }
    return best;
  }

  function scheduleSmartHdBoost(reason){
    applyHdrHdEnhancement();
    if(scheduleSmartHdBoost._t) clearTimeout(scheduleSmartHdBoost._t);
    scheduleSmartHdBoost._t = setTimeout(function(){
      try{
        if(!currentKey || userPaused || !video || video.paused || video.ended) return;
        if(isSlowConnection()) return;

        // HLS: stay in Auto, but guide the next level toward HD after playback is stable.
        if(hls && currentQualityMode === "auto" && hls.levels && hls.levels.length){
          hls.autoLevelCapping = -1;
          const idx = bestHdHlsLevelIndex(720);
          if(idx >= 0 && hls.levels[idx]){
            hls.nextLevel = idx;
            try{ if(typeof hls.nextAutoLevel === "number") hls.nextAutoLevel = idx; }catch(e){}
            setResolutionLabel(qualityLabel(hls.levels[idx].height, hls.levels[idx].bitrate) + " HD");
            setWatchState("HDR look • Smart HD quality");
          }
        }

        // Shaka/DASH: origin player must stay tester-like. Do not force minHeight/restrictions.
        if(shakaPlayer && currentQualityMode === "auto"){
          const tracks = shakaPlayer.getVariantTracks ? shakaPlayer.getVariantTracks() : [];
          try{
            shakaPlayer.configure({abr:{enabled:true, defaultBandwidthEstimate:12000000, switchInterval:2, clearBufferSwitch:false, restrictToElementSize:false, restrictToScreenSize:false}});
            if(tracks && tracks.length) setResolutionLabel(bestResolutionFromList(tracks) + " Auto");
            setWatchState("DASH auto quality • tester-like");
          }catch(e){}
        }
      }catch(e){}
    }, 6500);
  }

  function smoothInitialAutoCap(){
    if(!hls || !hls.levels || !hls.levels.length) return;
    if(tempAutoCapTimer){ clearTimeout(tempAutoCapTimer); tempAutoCapTimer = null; }
    if(!isSlowConnection()) return;
    try{
      let target = 0;
      hls.levels.forEach(function(level, idx){
        const h = Number(level.height || 0);
        if(h > 0 && h <= 720) target = idx;
      });
      hls.autoLevelCapping = target;
      setWatchState("Slow network detected • Starting lower for smooth play");
      tempAutoCapTimer = setTimeout(function(){
        try{ if(hls) hls.autoLevelCapping = -1; }catch(e){}
        setWatchState("Auto • Fast start • Buffer guard");
          scheduleSmartHdBoost("slow-cap-release");
        }, 30000);
    }catch(e){}
  }

  function forceAutoForSmooth(reason){
    if(manualQualityLocked()){
      setWatchState("Manual quality kept • Buffer recovery running");
      return;
    }
    currentQualityMode = "auto";
    if(qualitySelect){
      const hasAuto = Array.from(qualitySelect.options || []).some(function(o){ return o.value === "auto"; });
      if(hasAuto) qualitySelect.value = "auto";
    }
    try{
      if(hls){
        hls.currentLevel = -1; hls.loadLevel = -1; hls.nextLevel = -1; hls.startLevel = -1;
        if(hls.levels && hls.levels.length){
          let cap = -1;
          hls.levels.forEach(function(level, idx){ if(Number(level.height || 0) <= 720) cap = idx; });
          hls.autoLevelCapping = cap >= 0 ? cap : -1;
          if(tempAutoCapTimer) clearTimeout(tempAutoCapTimer);
          tempAutoCapTimer = setTimeout(function(){ try{ if(hls) hls.autoLevelCapping = -1; }catch(e){} }, 25000);
        }
      }
      if(shakaPlayer){
        shakaPlayer.configure({abr:{enabled:true, defaultBandwidthEstimate:1800000, switchInterval:1, clearBufferSwitch:false}});
      }
    }catch(e){}
    // Temporary buffer recovery must not overwrite the user's saved quality preference.
    setWatchState(reason || "Buffer detected • Switched to Auto smooth");
  }

  function bufferGuardSwitch(reason){
    if(!currentKey || userPaused) return;
    const key = currentKey;
    markChannelBuffered(key);

    // New rule: buffering/waiting/stall is NOT a source error.
    // Keep the selected server/source alive and only optimize/retry internally.
    if(currentStreamType === "dash"){
      hideLoader();
      if(statusText) statusText.textContent = "Buffering DASH…";
      setWatchState("DASH buffering • keeping selected source");
      if(shakaPlayer){ try{ shakaPlayer.retryStreaming(); }catch(e){} }
      return;
    }

    if(manualQualityLocked()){
      setWatchState("Manual quality kept • buffer recovery only");
      return;
    }

    forceAutoForSmooth(reason || "Buffering • optimizing same stream");
    if(bufferSwitchTimer) clearTimeout(bufferSwitchTimer);
    bufferSwitchTimer = setTimeout(function(){
      if(!currentKey || currentKey !== key || userPaused) return;
      if(video && !video.paused && !video.ended && video.readyState < 2){
        if(statusText) statusText.textContent = "Buffering…";
        setWatchState("Buffering • keeping same source");
        try{ if(hls) hls.startLoad(-1); }catch(e){}
      }
    }, 6500);
  }

  function bumpNumber(el, value){
    if(!el) return;
    const text = String(value == null ? "0" : value);
    if(el.textContent !== text){
      el.textContent = text;
      el.classList.remove("count-bump");
      void el.offsetWidth;
      el.classList.add("count-bump");
    }
  }

  function updateOverviewPanel(publicCh, row){
    publicCh = publicCh || (currentKey ? channelMap[currentKey] : null) || {};
    row = row || publicCh || {};
    if(sideCurrentName) sideCurrentName.textContent = publicCh.name || "LiveTV";
    if(sideCurrentSub) sideCurrentSub.textContent = publicCh.quality || row.resolution || "Auto quality";
    if(sideCurrentLive) bumpNumber(sideCurrentLive, row.live_text || shortNumber(row.live || publicCh.live || 0));
    if(sideCurrentViews) bumpNumber(sideCurrentViews, row.views_text || shortNumber(row.views || publicCh.views || 0));
    if(sideCurrentQuality) sideCurrentQuality.textContent = row.resolution || publicCh.resolution || publicCh.quality || "Auto";
  }

  function updateOverviewTotals(stats){
    if(!stats) return;
    var totalLive = 0, totalViews = 0, active = 0;
    Object.keys(stats).forEach(function(key){
      if(channelMap && !channelMap[key]) return;
      var row = stats[key] || {};
      var lv = Number(row.live || 0), vw = Number(row.views || 0);
      totalLive += lv; totalViews += vw; if(lv > 0) active++;
    });
    if(sideTotalLive) bumpNumber(sideTotalLive, shortNumber(totalLive));
    if(sideTotalViews) bumpNumber(sideTotalViews, shortNumber(totalViews));
    if(sideActiveChannels) bumpNumber(sideActiveChannels, active);
  }

  let mlbdStatsState = {};
  let mlbdStatsServerTime = 0;
  let mlbdStatsLastAppliedAt = 0;
  function markStatsSyncing(){
    try{
      document.querySelectorAll('[data-live-key],[data-views-key]').forEach(function(el){el.textContent='…';});
      [currentLiveCount,currentViewCount,sideCurrentLive,sideCurrentViews,sideTotalLive,sideTotalViews,sideActiveChannels].forEach(function(el){if(el)el.textContent='…';});
      var plv=document.querySelector('#mlbdProgressLiveViews b'); if(plv)plv.textContent='…';
    }catch(e){}
  }
  function normalizeStatsPayload(stats){
    var out = {};
    try{
      Object.keys(channelMap || {}).forEach(function(k){
        out[k] = {views:0, views_text:"0", live:0, live_text:"0", resolution:"", last_seen:0};
      });
      Object.keys(stats || {}).forEach(function(k){
        if(channelMap && !channelMap[k]) return;
        var r = stats[k] || {};
        var views = Number(r.views || 0);
        var live = Number(r.live || 0);
        out[k] = {
          views: views,
          views_text: r.views_text || shortNumber(views),
          live: live,
          live_text: r.live_text || shortNumber(live),
          resolution: r.resolution || "",
          last_seen: Number(r.last_seen || 0)
        };
      });
    }catch(e){ return stats || {}; }
    return out;
  }

  function updateStatsUI(stats){
    if(!stats) return;
    stats = normalizeStatsPayload(stats);
    mlbdStatsState = stats;
    updateOverviewTotals(stats);
    Object.keys(stats).forEach(function(key){
      if(channelMap && !channelMap[key]) return;
      const row = stats[key] || {};
      const liveText = row.live_text || shortNumber(row.live || 0);
      const viewText = row.views_text || shortNumber(row.views || 0);
      document.querySelectorAll('[data-live-key="' + CSS.escape(key) + '"]').forEach(function(el){ bumpNumber(el, liveText); });
      document.querySelectorAll('[data-views-key="' + CSS.escape(key) + '"]').forEach(function(el){ bumpNumber(el, viewText); });
      document.querySelectorAll('[data-res-key="' + CSS.escape(key) + '"]').forEach(function(el){ if(row.resolution) el.textContent = row.resolution; });
    });
    if(currentKey && stats[currentKey]){
      const row = stats[currentKey];
      bumpNumber(currentLiveCount, row.live_text || shortNumber(row.live || 0));
      bumpNumber(currentViewCount, row.views_text || shortNumber(row.views || 0));
      try{ var plv=document.querySelector("#mlbdProgressLiveViews b"); if(plv) bumpNumber(plv, row.live_text || shortNumber(row.live || 0)); }catch(e){}
      if(row.resolution && currentQualityMode === "auto") setResolutionLabel(row.resolution);
      updateOverviewPanel(channelMap[currentKey], row);
    }
  }

  function setRealtimeStatus(connected){
    try{
      var el=document.getElementById('mlbdRealtimeStatus');
      if(!el) return;
      el.classList.remove('is-on','is-off');
      if(connected){ el.textContent='Live Sync Connected'; el.title='Realtime connected'; el.classList.add('is-on'); }
      else { el.textContent='Live Sync Connecting'; el.title='Realtime connecting'; el.classList.add('is-off'); }
    }catch(e){}
  }
  try{ setRealtimeStatus(true); }catch(e){}

  function applyStatsResponse(d){
    try{
      if(!d || d.success===false) return;
      var st = Number(d.stats_version_ms || d.stats_generated_at || d.server_time || 0);
      if(st && mlbdStatsServerTime && st < mlbdStatsServerTime) return;
      if(st) mlbdStatsServerTime = st;
      mlbdStatsLastAppliedAt = Date.now();
      if(d.realtime) setRealtimeStatus(!!d.realtime.connected);
      if(d.stats) updateStatsUI(d.stats);
      else if(d.current && currentKey){
        var one={}; one[currentKey]=d.current;
        var merged = Object.assign({}, mlbdStatsState || {}, one);
        updateStatsUI(merged);
      }
      if(d.totals && !d.stats){
        if(sideTotalLive) bumpNumber(sideTotalLive, d.totals.total_live_text || shortNumber(d.totals.total_live || 0));
        if(sideTotalViews) bumpNumber(sideTotalViews, d.totals.total_views_text || shortNumber(d.totals.total_views || 0));
        if(sideActiveChannels) bumpNumber(sideActiveChannels, d.totals.active_channels || 0);
      }
    }catch(e){}
  }

  function fetchStatsSummary(forceFresh){
    if(MKS_REALTIME_OFF || !STATS_URL) return;
    try{
      fetch(STATS_URL + '?mode=summary&v=' + encodeURIComponent(MLBD_SYNC_BUILD) + '&t=' + realtimeBucket(REALTIME_EDGE_BUCKET_MS), {credentials:'same-origin', cache:'force-cache', headers:{'Accept':'application/json','X-LiveKhela-Stats':'redis-global-cache'}})
        .then(function(r){return r.text()})
        .then(function(txt){try{return JSON.parse(txt)}catch(e){return null}})
        .then(applyStatsResponse)
        .catch(function(){setRealtimeStatus(false)});
    }catch(e){setRealtimeStatus(false)}
  }

  function statsQuery(action, pixelMode){
    const q = new URLSearchParams();
    if(pixelMode){
      q.set("livetv_ping", "1");
      q.set("mode", "pixel");
    }else{
      q.set("livetv_stats", "1");
      q.set("mode", "json");
    }
    q.set("client", statsClient);
    q.set("key", currentKey || "");
    q.set("action", action || "heartbeat");
    q.set("resolution", currentResolutionLabel || "Auto");
    q.set("_", String(Date.now()));
    return q;
  }

  function pingStatsPixel(action){
    if(MKS_REALTIME_OFF || !STATS_URL || !currentKey) return;
    try{
      const img = new Image(1,1);
      img.referrerPolicy = "no-referrer";
      img.src = STATS_URL + "?" + statsQuery(action, true).toString();
    }catch(e){}
  }

  function shouldSendStartForChannel(key){
    if(!key) return false;
    try{
      const storageKey = "mlbd_livetv_counted_" + String(key);
      const now = Date.now();
      const last = Number(localStorage.getItem(storageKey) || 0);
      if(last && (now - last) < 55 * 60 * 1000) return false;
      localStorage.setItem(storageKey, String(now));
      return true;
    }catch(e){ return true; }
  }

  function pingStats(action){
    if(MKS_REALTIME_OFF || !STATS_URL || !currentKey || !PUBLIC_STATS_WRITE_ENABLED) return;

    action = action || "heartbeat";
    const now = Date.now();

    if(action === "heartbeat"){
      if(pingStats._lastHeartbeat && (now - pingStats._lastHeartbeat) < Math.max(12000, STATS_PING_MS - 5000)) return;
      pingStats._lastHeartbeat = now;
    }

    var payload = {
      mode:"json",
      client:statsClient,
      key:currentKey || "",
      action:action,
      resolution:currentResolutionLabel || "Auto"
    };

    try{
      fetch(STATS_URL, {
        method:"POST",
        credentials:"same-origin",
        cache:"no-store",
        headers:{"Content-Type":"application/json","Accept":"application/json"},
        body:JSON.stringify(payload)
      }).then(function(r){return r.text()})
        .then(function(txt){try{return JSON.parse(txt)}catch(e){return null}})
        .then(function(d){
          // Do not apply POST heartbeat/start response to UI. Public numbers update only
          // from the single global Redis summary cache so every component matches.
          if(d && d.success!==false){ setRealtimeStatus(true); }
          else { setRealtimeStatus(false); pingStatsPixel(action); }
        })
        .catch(function(){ setRealtimeStatus(false); pingStatsPixel(action); });
    }catch(e){ setRealtimeStatus(false); pingStatsPixel(action); }
  }

  function startStats(){
    if(statsTimer){ clearInterval(statsTimer); statsTimer = null; }
    if(MKS_REALTIME_OFF || !PUBLIC_STATS_WRITE_ENABLED) return;
    if(shouldSendStartForChannel(currentKey)) pingStats("start");
    else pingStats("heartbeat");
    var jitter = Math.floor(Math.random() * 30000);
    statsTimer = setTimeout(function beat(){
      if(videoIsActivelyWatching()) pingStats("heartbeat");
      statsTimer = setTimeout(beat, STATS_PING_MS + Math.floor(Math.random() * 30000));
    }, STATS_PING_MS + jitter);
  }

  if(!MKS_REALTIME_OFF){
    markStatsSyncing();
    setTimeout(function(){fetchStatsSummary(true)}, 0);
    setInterval(function(){fetchStatsSummary(true)}, STATS_SUMMARY_POLL_MS);
  }

  function videoIsActivelyWatching(){
    try{ return !!(video && !video.paused && !video.ended && video.readyState >= 2); }catch(e){ return false; }
  }

  document.addEventListener("visibilitychange", function(){
    if(MKS_REALTIME_OFF) return;
    // Do not remove live viewer immediately when tab is hidden.
    // A user may keep listening/watching in background; last_seen will expire after 5 minutes if heartbeats stop.
    if(document.hidden){
      if(videoIsActivelyWatching()) pingStats("heartbeat");
      else pingStats("stop");
    } else if(currentKey){
      pingStats("heartbeat");
    }
  });
  window.addEventListener("focus", function(){ if(!MKS_REALTIME_OFF && videoIsActivelyWatching()) pingStats("heartbeat"); });

  function releasePosterHold(){
    try{
      if(video){
        if(!video.dataset.mlbdOriginalPoster) video.dataset.mlbdOriginalPoster = video.getAttribute("poster") || "";
        video.removeAttribute("poster");
      }
      if(playerCard) playerCard.classList.add("is-switching-fast");
    }catch(e){}
  }
  function showLoader(){ releasePosterHold(); if(loader) loader.classList.remove("hidden"); }
  function clearLoadSafety(){ if(mlbdLoadSafetyTimer){ clearTimeout(mlbdLoadSafetyTimer); mlbdLoadSafetyTimer = null; } }
  function hideLoader(){ clearLoadSafety(); if(loader) loader.classList.add("hidden"); if(playerCard) playerCard.classList.remove("is-switching-fast"); }
  function withTimeout(promise, ms, message){
    return new Promise(function(resolve, reject){
      let done = false;
      const t = setTimeout(function(){
        if(done) return;
        done = true;
        reject(new Error(message || "Load timeout"));
      }, Math.max(3000, Number(ms || 12000)));
      Promise.resolve(promise).then(function(v){
        if(done) return;
        done = true;
        clearTimeout(t);
        resolve(v);
      }).catch(function(err){
        if(done) return;
        done = true;
        clearTimeout(t);
        reject(err);
      });
    });
  }
  function startLoadSafety(key, playId, ms){
    clearLoadSafety();
    mlbdLoadSafetyTimer = setTimeout(function(){
      if(playId !== currentPlayId || key !== currentKey || userPaused) return;
      if(video && video.readyState >= 2){ hideLoader(); return; }
      // Safety timer is NOT a fallback trigger. Slow buffering/loading must keep the selected source.
      // Real source errors still switch through HLS/Shaka/native error handlers.
      hideLoader();
      if(statusText) statusText.textContent = "Connecting";
      setWatchState("Still connecting • keeping selected source");
      try{ if(hls) hls.startLoad(-1); }catch(e){}
      try{ if(shakaPlayer) shakaPlayer.retryStreaming(); }catch(e){}
      startSwitchAutoplayWatch(playId, "Live", 10000);
    }, Math.max(10000, Number(ms || 16000)));
  }
  function showError(text){
    // Do not show scary red stream errors to public users.
    // Keep switching silently so the page feels smooth.
    if(errorBox) errorBox.classList.remove("show");
    if(statusText) statusText.textContent = "Finding stable channel";
    setWatchState("Auto switching • Finding stable stream");
  }
  function hideError(){ if(errorBox) errorBox.classList.remove("show"); }

  function destroyHls(){
    if(hls){
      try{ hls.destroy(); }catch(e){}
      hls = null;
    }
  }

  async function destroyShaka(){
    if(dashSyncTimer){ clearInterval(dashSyncTimer); dashSyncTimer = null; }
    if(shakaPlayer){
      const oldPlayer = shakaPlayer;
      shakaPlayer = null;
      try{
        await Promise.race([
          oldPlayer.destroy(),
          new Promise(function(resolve){ setTimeout(resolve, 900); })
        ]);
      }catch(e){}
    }
  }

  async function resetVideo(){
    destroyHls();
    await destroyShaka();
    if(bufferTimer) clearTimeout(bufferTimer);
    if(stallTimer) clearTimeout(stallTimer);
    if(controlsHideTimer) clearTimeout(controlsHideTimer);
    if(tempAutoCapTimer) clearTimeout(tempAutoCapTimer);
    if(bufferAutoRecoverTimer) clearTimeout(bufferAutoRecoverTimer);
    if(bufferWindowTimer) clearTimeout(bufferWindowTimer);
    if(bufferSwitchTimer) clearTimeout(bufferSwitchTimer);
    if(autoSwitchRetryTimer) clearTimeout(autoSwitchRetryTimer);
    if(switchAutoplayTimer){ clearInterval(switchAutoplayTimer); switchAutoplayTimer = null; }
    autoSwitchRetryTimer = null;
    tempAutoCapTimer = null;
    bufferAutoRecoverTimer = null;
    bufferWindowTimer = null;
    bufferSwitchTimer = null;
    bufferStartedAt = 0;
    bufferEventsInWindow = 0;

    try{ video.pause(); }catch(e){}
    prepareIOSVideo();
    video.controls = false;
    video.removeAttribute("controls");
    video.removeAttribute("src");
    video.load();
    video.playbackRate = 1;
    lastGoodTime = 0;
    keepControlsVisible();
    updatePlayButton();
  }

  function setActiveChannel(key){
    key = String(key || "").trim();
    if(!key) return;
    currentKey = key; try{ window.mlbdCurrentKey = key; window.currentKey = key; }catch(e){}
    try{ document.body.setAttribute("data-mlbd-current-key", key); }catch(e){}
    syncBarChannelSelect(key);
    channelButtons.forEach(function(btn){
      const active = btn.getAttribute("data-key") === key;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  function updateMuteButton(){
    if(!muteBtn) return;
    const isMuted = !!(video.muted || video.volume === 0);
    if(isMuted){
      muteBtn.innerHTML = '<i class="fa fa-volume-mute"></i> Unmute';
      muteBtn.classList.add("primary");
      muteBtn.setAttribute("aria-label", "Unmute");
      muteBtn.setAttribute("aria-pressed", "false");
    }else{
      muteBtn.innerHTML = '<i class="fa fa-volume-up"></i> Mute';
      muteBtn.classList.remove("primary");
      muteBtn.setAttribute("aria-label", "Mute");
      muteBtn.setAttribute("aria-pressed", "true");
    }
  }

  function updatePlayButton(){
    if(!playBtn) return;
    const isPaused = !!(video.paused || video.ended);
    if(isPaused){
      playBtn.innerHTML = '<i class="fa fa-play"></i> Play';
      playBtn.classList.add("primary");
      playBtn.setAttribute("aria-label", "Play");
      playBtn.setAttribute("aria-pressed", "false");
    }else{
      playBtn.innerHTML = '<i class="fa fa-pause"></i> Pause';
      playBtn.classList.remove("primary");
      playBtn.setAttribute("aria-label", "Pause");
      playBtn.setAttribute("aria-pressed", "true");
    }
  }

  function syncMediaButtons(){
    updatePlayButton();
    updateMuteButton();
  }

  function forceUnmuteIfAllowed(){
    if(!userWantsSound) { syncMediaButtons(); return false; }
    if(MLBD_AUTOPLAY_MUTED_MODE && !iosSoundUnlocked){ syncMediaButtons(); return false; }
    try{
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;
      video.removeAttribute("muted");
    }catch(e){}
    syncMediaButtons();
    return !(video.muted || video.volume === 0);
  }

  function isFullscreenNow(){
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
  }

  function showPlayerControls(){
    if(!playerCard) return;
    playerCard.classList.remove("controls-hidden");
    if(controlsHideTimer){ clearTimeout(controlsHideTimer); controlsHideTimer = null; }

    if(isFullscreenNow() || document.body.classList.contains("livetv-auto-landscape")){
      controlsHideTimer = setTimeout(function(){
        if(barChannelPicker && barChannelPicker.classList.contains("is-open")) return;
        if(!video.paused && !video.ended) playerCard.classList.add("controls-hidden");
      }, 1000);
    }
  }

  function keepControlsVisible(){
    if(!playerCard) return;
    playerCard.classList.remove("controls-hidden");
    if(controlsHideTimer){ clearTimeout(controlsHideTimer); controlsHideTimer = null; }
  }

  function autoLandscapeMode(){
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;

    if(isMobile && isLandscape){
      document.body.classList.add("livetv-auto-landscape", "livetv-fullscreen");
      showPlayerControls();
    }else{
      document.body.classList.remove("livetv-auto-landscape");
      if(!isFullscreenNow()){
        document.body.classList.remove("livetv-fullscreen");
        if(playerCard) playerCard.classList.remove("controls-hidden");
      }
    }
  }

  function enableSound(){
    userWantsSound = true;
    autoplayMutedFallbackActive = false;
    iosSoundUnlocked = true;
    try{ localStorage.setItem("mlbd_livetv_sound", "on"); }catch(e){}
    setCookie("mlbd_livetv_sound", "on", 365);
    try{
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;
      video.removeAttribute("muted");
    }catch(e){}
    syncMediaButtons();
  }

  function disableSound(){
    userWantsSound = false;
    autoplayMutedFallbackActive = true;
    iosSoundUnlocked = false;
    try{ localStorage.setItem("mlbd_livetv_sound", "off"); }catch(e){}
    setCookie("mlbd_livetv_sound", "off", 365);
    try{
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.setAttribute("muted", "muted");
    }catch(e){}
    syncMediaButtons();
  }

  function applySoundPreference(){
    if(MLBD_AUTOPLAY_MUTED_MODE){
      // iPhone/iPad/Safari native HLS: muted autoplay; Sound button unlocks audio after user tap.
      if(userWantsSound && iosSoundUnlocked){
        forceUnmuteIfAllowed();
      }else{
        try{
          video.muted = true;
          video.defaultMuted = true;
          video.volume = 0;
          video.setAttribute("muted", "muted");
        }catch(e){}
        syncMediaButtons();
      }
      return;
    }

    // Android/Chrome/desktop web: unmuted mode by default.
    if(userWantsSound){
      forceUnmuteIfAllowed();
    }else{
      try{
        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;
        video.setAttribute("muted", "muted");
      }catch(e){}
      syncMediaButtons();
    }
  }

  function forceMutedAutoplayMode(){
    try{
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.setAttribute("muted", "muted");
    }catch(e){}
    syncMediaButtons();
  }

  function forceSoundAutoplayMode(){
    try{
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;
      video.removeAttribute("muted");
    }catch(e){}
    syncMediaButtons();
  }

  function kickAutoplayNow(playId, label){
    if(playId && playId !== currentPlayId) return;
    if(!video || userPaused) return;
    prepareIOSVideo();
    try{
      video.setAttribute("autoplay", "");
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
    }catch(e){}

    if(autoplayMutedFallbackActive){
      forceMutedAutoplayMode();
    }else if(!MLBD_AUTOPLAY_MUTED_MODE && userWantsSound){
      forceSoundAutoplayMode();
    }else if(MLBD_AUTOPLAY_MUTED_MODE && !(userWantsSound && iosSoundUnlocked)){
      forceMutedAutoplayMode();
    }

    try{
      const p = video.play();
      if(p && typeof p.then === "function"){
        p.then(function(){
          if(playId && playId !== currentPlayId) return;
          if(MLBD_AUTOPLAY_UNMUTED_MODE && userWantsSound) forceUnmuteIfAllowed();
          syncMediaButtons();
        }).catch(function(){
          // Server/channel switch often happens outside the first tap gesture.
          // Muted fallback keeps playback starting smoothly instead of staying paused.
          autoplayMutedFallbackActive = true;
          forceMutedAutoplayMode();
          try{
            const p2 = video.play();
            if(p2 && typeof p2.then === "function"){
              p2.then(function(){ syncMediaButtons(); }).catch(function(){
                if(statusText) statusText.textContent = "Autoplay retrying";
                setWatchState("Autoplay retrying • muted safe mode");
                syncMediaButtons();
              });
            }
          }catch(e){
            if(statusText) statusText.textContent = "Autoplay retrying";
            syncMediaButtons();
          }
        });
      }
    }catch(e){
      forceMutedAutoplayMode();
      try{ video.play(); }catch(x){}
    }
  }

  function startSwitchAutoplayWatch(playId, label, durationMs){
    if(switchAutoplayTimer){ clearInterval(switchAutoplayTimer); switchAutoplayTimer = null; }
    const started = Date.now();
    const maxMs = Math.max(9000, Number(durationMs || 18000));
    kickAutoplayNow(playId, label || "Live");
    switchAutoplayTimer = setInterval(function(){
      if(playId !== currentPlayId || userPaused || !video){ clearInterval(switchAutoplayTimer); switchAutoplayTimer = null; return; }
      if(!video.paused && !video.ended && video.readyState >= 2){ clearInterval(switchAutoplayTimer); switchAutoplayTimer = null; syncMediaButtons(); return; }
      if(Date.now() - started > maxMs){
        autoplayMutedFallbackActive = true;
        kickAutoplayNow(playId, label || "Live");
        clearInterval(switchAutoplayTimer); switchAutoplayTimer = null; syncMediaButtons(); return;
      }
      kickAutoplayNow(playId, label || "Live");
    }, 650);
  }

  function startAutoplaySafe(label){
    prepareIOSVideo();

    if(MLBD_AUTOPLAY_MUTED_MODE){
      if(userWantsSound && iosSoundUnlocked){
        forceUnmuteIfAllowed();
      }else{
        try{
          video.muted = true;
          video.defaultMuted = true;
          video.volume = 0;
          video.setAttribute("muted", "muted");
        }catch(e){}
      }
    }else if(userWantsSound){
      try{
        video.muted = false;
        video.defaultMuted = false;
        video.volume = 1;
        video.removeAttribute("muted");
      }catch(e){}
    }

    userPaused = false;
    const p = video.play();
    if(p && typeof p.then === "function"){
      p.then(function(){
        if(MLBD_AUTOPLAY_UNMUTED_MODE && userWantsSound) forceUnmuteIfAllowed();
        syncMediaButtons();
      }).catch(function(){
        // If Chrome/Android blocks sound autoplay, keep video running with muted fallback.
        autoplayMutedFallbackActive = true;
        try{
          video.muted = true;
          video.defaultMuted = true;
          video.volume = 0;
          video.setAttribute("muted", "muted");
          const p2 = video.play();
          if(p2 && typeof p2.then === "function"){
            p2.then(function(){ syncMediaButtons(); }).catch(function(){ if(statusText) statusText.textContent = "Autoplay retrying"; syncMediaButtons(); });
          }
        }catch(e){
          if(statusText) statusText.textContent = "Autoplay retrying";
        }
        syncMediaButtons();
      });
    }
    syncMediaButtons();
  }

  function tryPlay(channelName){
    prepareIOSVideo();
    applySoundPreference();
    if(userPaused){ updatePlayButton(); return; }
    startAutoplaySafe(channelName || "LiveTV");
  }

  function mlbdB64UrlToBytes(value){
    try{
      let s = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
      while(s.length % 4) s += "=";
      const bin = atob(s);
      const out = new Uint8Array(bin.length);
      for(let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
      return out;
    }catch(e){ return new Uint8Array(0); }
  }

  async function decodePayload(payload, accessToken){
    try{
      if(typeof payload === "string"){
        return JSON.parse(atob(String(payload || "").split("").reverse().join("")));
      }
      if(payload && payload.legacy && payload.data){
        return JSON.parse(atob(String(payload.data || "").split("").reverse().join("")));
      }
      if(!payload || Number(payload.v || 0) !== 2 || !window.crypto || !crypto.subtle) return null;
      const enc = new TextEncoder();
      const keyBytes = await crypto.subtle.digest("SHA-256", enc.encode(String(accessToken || "") + "|mlbd-web-stream-v2"));
      const key = await crypto.subtle.importKey("raw", keyBytes, {name:"AES-GCM"}, false, ["decrypt"]);
      const iv = mlbdB64UrlToBytes(payload.iv);
      const ct = mlbdB64UrlToBytes(payload.ct);
      const tag = mlbdB64UrlToBytes(payload.tag);
      if(!iv.length || !ct.length || !tag.length) return null;
      const packed = new Uint8Array(ct.length + tag.length);
      packed.set(ct, 0);
      packed.set(tag, ct.length);
      const plain = await crypto.subtle.decrypt({name:"AES-GCM", iv:iv, tagLength:128}, key, packed);
      return JSON.parse(new TextDecoder().decode(plain));
    }catch(e){ return null; }
  }

  async function fetchChannelPayload(key){
    const publicCh = channelMap[key];
    if(!publicCh || !publicCh.play_token){
      throw new Error("Protected stream token missing. Reload page.");
    }

    const body = new URLSearchParams();
    body.set("key", key);
    body.set("access", publicCh.play_token);

    const res = await fetch(PLAY_API_URL, {
      method: "POST",
      headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
      body: body.toString(),
      cache: "no-store",
      credentials: "same-origin"
    });

    let json = null;
    try{ json = await res.json(); }catch(e){}
    if(!res.ok || !json || !json.success){
      throw new Error((json && json.message) || "Channel source unavailable");
    }

    const payload = await decodePayload(json.payload, publicCh.play_token);
    if(!payload || !payload.url || (payload.exp && payload.exp < Math.floor(Date.now()/1000))){
      throw new Error("Stream source expired. Reload page.");
    }

    return Object.assign({}, publicCh, payload);
  }

  async function playIphoneNativePlayer(){
    const key = currentKey || firstPlayableKey();
    if(!key){ showError("No channel selected"); return; }
    try{
      if(statusText) statusText.textContent = "iPhone Player";
      setWatchState("iPhone Player • Loading HLS source");
      showLoader();
      let ch = null;
      try{ ch = await fetchChannelPayload(key); }catch(e){ ch = null; }
      if(!ch) throw new Error("Stream source unavailable");
      const sources = getChannelSources(ch).filter(function(src){
        const u = String(src.url || "").toLowerCase();
        const t = String(src.type || detectStreamType(src.url, "hls")).toLowerCase();
        return !!src.url && (t === "hls" || t === "mp4" || u.includes(".m3u8") || u.match(/\.(mp4|m4v|mov)(\?|$)/));
      });
      if(!sources.length){
        hideLoader();
        setWatchState("iPhone Player • This channel needs HLS source");
        if(statusText) statusText.textContent = "No iPhone source";
        showError("iPhone/Safari needs HLS (.m3u8) source. Add one backup HLS source for this channel.");
        return;
      }
      await resetVideo();
      const src = sources[0];
      currentKey = key; try{ window.mlbdCurrentKey = key; window.currentKey = key; }catch(e){}
      currentSourceList = sources;
      currentSourceIndex = 0;
      resetQualitySelector("Auto");
      setResolutionLabel(ch.resolution || ch.quality || "Auto");
      prepareIOSVideo();
      if(MLBD_AUTOPLAY_MUTED_MODE && !(userWantsSound && iosSoundUnlocked)){
        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;
        video.setAttribute("muted", "muted");
      }else{
        video.muted = false;
        video.defaultMuted = false;
        video.volume = 1;
        video.removeAttribute("muted");
      }
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.setAttribute("autoplay", "");
      video.autoplay = true;
      video.src = src.url;
      video.load();
      startAutoplaySafe("iPhone HLS");
      startSwitchAutoplayWatch(currentPlayId, "iPhone HLS", 16000);
      hideLoader();
      setActiveChannel(key);
      saveLastChannelKey(key);
      startStats();
      setWatchState("iPhone Player • Native HLS mode");
      if(statusText) statusText.textContent = "iPhone Player";
    }catch(err){
      hideLoader();
      setWatchState("iPhone Player • Tap Play or add HLS source");
      if(statusText) statusText.textContent = "iPhone Player failed";
    }
  }

  async function playStream(key, opts){
    opts = opts || {};
    if(!opts.auto) resetAutoFallbackSession();
    const publicCh = channelMap[key];
    if(!publicCh){ showError("Channel not found"); return; }

    if(publicCh.status === "down"){
      setActiveChannel(key);
      autoFallback("Channel is currently down");
      return;
    }

    const playId = ++currentPlayId;
    const sourceIndex = Math.max(0, Number(opts.sourceIndex || 0));

    if(currentKey && currentKey !== key){ pingStats("stop"); }
    currentKey = key; try{ window.mlbdCurrentKey = key; window.currentKey = key; }catch(e){}
    currentSourceIndex = sourceIndex;
    if(!opts.auto){ try{ dashSameSourceRetry[key + "|" + sourceIndex] = 0; }catch(e){} }

    if(watchChannelName) watchChannelName.textContent = publicCh.name || "LiveTV";
    setWatchState(opts.auto ? "Auto switching • Loading stable stream" : "Loading stream");
    resetQualitySelector("Auto");
    setResolutionLabel(publicCh.resolution || publicCh.quality || "Auto");
    if(currentLiveCount) currentLiveCount.textContent = "…";
    if(currentViewCount) currentViewCount.textContent = "…";
    try{ var plv=document.querySelector("#mlbdProgressLiveViews b"); if(plv) plv.textContent = "…"; }catch(e){}
    updateOverviewPanel(publicCh, {live_text:"…",views_text:"…",resolution:(publicCh.resolution||publicCh.quality||"Auto")});
    setTimeout(function(){ fetchStatsSummary(true); }, 800);
    saveLastChannelKey(key);

    startStats();
    setActiveChannel(key);
    releasePosterHold();
    try{ video.pause(); video.removeAttribute("src"); video.load(); }catch(e){}
    if(statusText) statusText.textContent = opts.auto ? "Switching" : "Connecting";
    setWatchState((opts.auto ? "Trying backup" : "Selected") + " • " + (publicCh.name || "LiveTV"));
    await resetVideo();
    if(playId !== currentPlayId) return;
    showLoader();
    hideError();
    startLoadSafety(key, playId, opts.auto ? 9000 : 8000);

    if(statusText) statusText.textContent = (opts.auto ? "Auto fallback" : "Loading");
    setWatchState(opts.auto ? "Trying fallback stream • Auto" : "Connecting • Auto smooth mode");

    let ch;
    try{
      ch = await withTimeout(fetchChannelPayload(key), 7000, "Stream source timeout");
    }catch(error){
      hideLoader();
      autoFallback(error && error.message ? error.message : "Channel source unavailable");
      return;
    }

    ch.name = ch.name || publicCh.name;
    currentSourceList = getPlayableSources(ch);
    if(!currentSourceList.length){
      hideLoader();
      markChannelFailed(key);
      autoFallback((IS_IOS || IS_SAFARI) ? "This channel has no iPhone supported HLS source" : "No source URL found");
      return;
    }

    const source = currentSourceList[sourceIndex] || currentSourceList[0];
    const playCh = Object.assign({}, ch, source, {
      url: source.url,
      type: source.type || ch.type || "hls",
      _playId: playId,
      _sourceIndex: sourceIndex,
      _sourceCount: currentSourceList.length
    });

    const url = String(playCh.url || "");
    const type = String(playCh.type || "hls").toLowerCase();
    const isDash = type === "dash" || type === "mpd" || url.toLowerCase().includes(".mpd");
    const isHls = type === "hls" || url.toLowerCase().includes(".m3u8");
    currentStreamType = isDash ? "dash" : (isHls ? "hls" : "file");

    if(isDash){ playDash(playCh); return; }
    if(isHls){ playHls(playCh); return; }
    playDirect(playCh);
  }

  async function playDash(ch){
    if(IS_IOS || (IS_SAFARI && NATIVE_HLS)){
      hideLoader();
      setWatchState("DASH is not supported on iPhone/Safari • finding HLS channel");
      if(statusText) statusText.textContent = "DASH unsupported";
      autoFallback("DASH not supported");
      return;
    }
    if(!window.shaka || !shaka.Player){
      hideLoader();
      setWatchState("DASH player library not loaded • finding stable channel");
      if(statusText) statusText.textContent = "Shaka missing";
      autoFallback("DASH player library not loaded");
      return;
    }

    function sameDashPlay(){ return !(ch._playId && ch._playId !== currentPlayId); }
    function dashCodeName(code){
      const names = {
        1001:"UNSUPPORTED_BROWSER",1002:"BROWSER_MISSING",3016:"VIDEO_ERROR",4001:"BAD_HTTP_STATUS",4002:"HTTP_ERROR",4007:"TIMEOUT",
        6001:"DRM_INIT_FAILED",6002:"DRM_NOT_SUPPORTED",6004:"LICENSE_REQUEST_FAILED",6007:"LICENSE_RESPONSE_REJECTED",6008:"ENCRYPTED_CONTENT_WITHOUT_DRM_INFO",
        7000:"LOAD_INTERRUPTED",7001:"OPERATION_ABORTED",8000:"MALFORMED_MANIFEST",8001:"MANIFEST_PARSE_ERROR",4012:"SEGMENT_MISSING"
      };
      return names[code] || "CODE_" + code;
    }
    function isCriticalDashError(error){
      try{
        if(window.shaka && shaka.util && shaka.util.Error && error && error.severity === shaka.util.Error.Severity.CRITICAL) return true;
      }catch(e){}
      const code = Number(error && error.code || 0);
      return [1001,1002,6001,6002,6004,6007,6008,8000,8001].indexOf(code) >= 0;
    }
    function dashLog(message, data){
      // Production mode: keep console clean so stream/DRM/debug details are not printed.
    }
    function dashState(text, ok){
      if(!sameDashPlay()) return;
      hideError();
      if(ok === true){ hideLoader(); if(statusText) statusText.textContent = "Playing"; }
      else if(ok === false){ hideLoader(); if(statusText) statusText.textContent = "DASH issue"; }
      else { if(statusText) statusText.textContent = text || "DASH"; }
      setWatchState(text || "DASH");
      syncMediaButtons();
    }

    let loaded = false;
    let firstFrame = false;
    let recoverableCount = 0;
    let criticalCount = 0;
    let softPlayTimer = null;

    try{
      shaka.polyfill.installAll();
      if(!shaka.Player.isBrowserSupported()){
        hideLoader();
        setWatchState("Browser does not support DASH playback • finding stable channel");
        if(statusText) statusText.textContent = "DASH unsupported";
        autoFallback("DASH browser unsupported");
        return;
      }

      video.controls = false;
      video.removeAttribute("controls");
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.autoplay = true;
      applySoundPreference();

      shakaPlayer = new shaka.Player();
      try{ window.mlbdShakaPlayer = shakaPlayer; }catch(e){}
      await shakaPlayer.attach(video);

      try{
        const net = shakaPlayer.getNetworkingEngine && shakaPlayer.getNetworkingEngine();
        if(net && net.registerRequestFilter){
          net.registerRequestFilter(function(type, request){
            request.allowCrossSiteCredentials = false;
            request.headers = {};
          });
        }
      }catch(e){}

      // Same behavior as source-tester: keep the selected DASH source alive.
      // No public smart-fallback, no forced low cap, no live-edge seek loop.
      shakaPlayer.configure({
        manifest:{
          defaultPresentationDelay:10,
          dash:{
            ignoreMinBufferTime:true,
            ignoreSuggestedPresentationDelay:true,
            autoCorrectDrift:true,
            ignoreEmptyAdaptationSet:true,
            ignoreMaxSegmentDuration:true,
            disableXlinkProcessing:true,
            initialSegmentLimit:1000
          },
          retryParameters:{maxAttempts:5,baseDelay:350,backoffFactor:1.5,fuzzFactor:.25,timeout:9000}
        },
        streaming:{
          lowLatencyMode:false,
          inaccurateManifestTolerance:3,
          rebufferingGoal:.75,
          bufferingGoal:18,
          bufferBehind:18,
          gapDetectionThreshold:.4,
          stallEnabled:true,
          stallThreshold:1.2,
          stallSkip:.25,
          startAtSegmentBoundary:true,
          failureCallback:function(error){
            if(!sameDashPlay()) return;
            dashLog("Shaka retry " + dashCodeName(error && error.code), {code:error && error.code, severity:error && error.severity});
            try{ shakaPlayer.retryStreaming(); }catch(e){}
          },
          retryParameters:{maxAttempts:8,baseDelay:350,backoffFactor:1.5,fuzzFactor:.25,timeout:12000}
        },
        abr:{
          enabled:true,
          defaultBandwidthEstimate:12000000,
          switchInterval:2,
          restrictToElementSize:false,
          restrictToScreenSize:false,
          clearBufferSwitch:false,
          bandwidthDowngradeTarget:.95,
          bandwidthUpgradeTarget:.68,
          useNetworkInformation:true
        }
      });

      if(ch.drm === "clearkey" && ch.key_id && ch.key_value){
        const clearKeys = {};
        clearKeys[String(ch.key_id).toLowerCase()] = String(ch.key_value).toLowerCase();
        shakaPlayer.configure({drm:{clearKeys:clearKeys,retryParameters:{maxAttempts:5,baseDelay:500,backoffFactor:1.6,fuzzFactor:.3,timeout:12000}}});
      }

      shakaPlayer.addEventListener("error", function(event){
        if(!sameDashPlay()) return;
        const d = event && event.detail ? event.detail : {};
        const code = Number(d.code || 0);
        if(isCriticalDashError(d)){
          criticalCount++;
          dashLog("CRITICAL DASH " + dashCodeName(code), {code:code, category:d.category, severity:d.severity});
          if(criticalCount >= 2 && !firstFrame){
            dashState("DASH failed • auto switching", false);
            autoFallback("DASH failed " + dashCodeName(code));
          }else{
            dashState("DASH retrying • " + dashCodeName(code), null);
            try{ shakaPlayer.retryStreaming(); }catch(e){}
          }
          return;
        }
        recoverableCount++;
        dashLog("Recoverable DASH " + dashCodeName(code), {code:code, severity:d.severity});
        dashState("DASH recovering • keeping same source", null);
        try{ shakaPlayer.retryStreaming(); }catch(e){}
      });

      shakaPlayer.addEventListener("buffering", function(event){
        if(!sameDashPlay()) return;
        if(event.buffering){
          markChannelBuffered(currentKey);
          if(!loaded) showLoader(); else hideLoader();
          dashState(loaded ? "Buffering DASH • keeping same source" : "Loading DASH...", null);
          try{ shakaPlayer.retryStreaming(); }catch(e){}
        }else{
          firstFrame = true;
          markChannelStable(currentKey);
          dashState("Playing DASH", true);
        }
      });

      video.addEventListener("loadeddata", function(){ firstFrame = true; dashState("Playing DASH", true); }, {once:true});
      video.addEventListener("canplay", function(){ firstFrame = true; dashState("Playing DASH", true); }, {once:true});
      video.addEventListener("playing", function(){ firstFrame = true; userPaused = false; dashState("Playing DASH", true); }, {once:true});

      dashState("Loading DASH...", null);
      showLoader();
      dashLog("Loading DASH " + ch.url);
      await withTimeout(shakaPlayer.load(ch.url), 10000, "DASH load timeout");
      loaded = true;
      if(!sameDashPlay()) return;

      clearChannelFailure(currentKey);
      selectBestDashAudio();
      try{ if(window.mlbdSyncAudioLanguages) window.mlbdSyncAudioLanguages(); }catch(e){}
      buildShakaQualitySelector(false);
      var savedDashQuality = qualitySelect && qualitySelect.value ? qualitySelect.value : chooseDefaultQualityValue(currentQualityOptions, getSavedQuality(currentKey));
      applyDashQuality(savedDashQuality || "auto");
      updateQualityButtonFinalSafe();
      scheduleSmartHdBoost("dash-loaded");
      hideLoader();
      dashState("Playing DASH", true);
      tryPlay(ch.name);
      startSwitchAutoplayWatch(ch._playId || currentPlayId, ch.name || "DASH", 18000);
      updateMuteButton();
      showPlayerControls();

      softPlayTimer = setInterval(function(){
        if(!sameDashPlay()) { clearInterval(softPlayTimer); return; }
        if(video && !userPaused && video.paused){ tryPlay(ch.name); }
        if(shakaPlayer){ try{ shakaPlayer.retryStreaming(); }catch(e){} }
        if(video && video.readyState >= 2){ firstFrame = true; hideLoader(); markChannelStable(currentKey); }
      }, 5000);
      setTimeout(function(){ if(softPlayTimer) clearInterval(softPlayTimer); }, 45000);

    }catch(error){
      hideLoader();
      const code = error && error.code ? Number(error.code) : 0;
      dashLog("DASH load failed", error && {message:error.message, code:error.code, stack:String(error.stack||"").split("\n").slice(0,4)});
      dashState("DASH failed • finding stable source", false);
      try{ if(shakaPlayer) shakaPlayer.retryStreaming(); }catch(e){}
      autoFallback("DASH failed " + (code ? dashCodeName(code) : (error && error.message ? error.message : "unknown")));
    }
  }

  function keepDashLiveStable(){
    // Ultra-soft mode: do not seek or speed-change DASH live streams.
    // Some 4K CMAF streams freeze if public player keeps forcing the live edge.
    if(dashSyncTimer) clearInterval(dashSyncTimer);
    dashSyncTimer = setInterval(function(){
      try{
        if(!shakaPlayer || !video || userPaused) return;
        video.playbackRate = 1;
        if(video.readyState >= 2){ clearChannelFailure(currentKey); markChannelStable(currentKey); hideLoader(); }
      }catch(e){}
    }, 5000);
  }

  function playHls(ch){
    const url = String(ch.url || "").trim();
    const nativeCanPlay = !!(video && video.canPlayType && video.canPlayType("application/vnd.apple.mpegurl"));
    let nativeFallbackTried = !!ch._nativeFallback;
    let hlsManifestTimer = null;
    let hlsFirstPlayTimer = null;

    prepareIOSVideo();
    video.controls = false;
    video.removeAttribute("controls");
    applySoundPreference();

    function samePlay(){ return !(ch._playId && ch._playId !== currentPlayId); }
    function clearHlsTimers(){
      if(hlsManifestTimer){ clearTimeout(hlsManifestTimer); hlsManifestTimer = null; }
      if(hlsFirstPlayTimer){ clearTimeout(hlsFirstPlayTimer); hlsFirstPlayTimer = null; }
    }
    function tryNativeFallback(reason){
      if(!samePlay()) return true;
      if(nativeCanPlay && !nativeFallbackTried){
        nativeFallbackTried = true;
        clearHlsTimers();
        try{ destroyHls(); }catch(e){}
        setWatchState("Native HLS fallback • " + (reason || "Trying browser player"));
        if(statusText) statusText.textContent = "Native HLS";
        playNativeHls(Object.assign({}, ch, {_nativeFallback:true}), url);
        return true;
      }
      return false;
    }

    // iPhone/iPad/Safari should use the browser's native HLS path first.
    // Some Android WebViews also expose native HLS; use it only when MSE/Hls.js is unavailable.
    if((IS_IOS || IS_SAFARI) && nativeCanPlay){
      playNativeHls(ch, url);
      return;
    }

    if(!(window.Hls && Hls.isSupported())){
      if(nativeCanPlay){ playNativeHls(ch, url); return; }
      hideLoader();
      autoFallback("HLS is not supported in this browser");
      return;
    }

    try{
      hls = new Hls({
        enableWorker:true,
        lowLatencyMode:false,
        autoStartLoad:true,
        startPosition:-1,
        liveDurationInfinity:true,
        startFragPrefetch:true,
        testBandwidth:true,
        capLevelToPlayerSize:true,
        startLevel:-1,
        maxStarvationDelay:3,
        maxLoadingDelay:4,
        maxFragLookUpTolerance:.35,
        backBufferLength:18,
        maxBufferLength:22,
        maxMaxBufferLength:36,
        maxBufferSize:48*1000*1000,
        maxBufferHole:.7,
        highBufferWatchdogPeriod:2,
        nudgeOffset:.12,
        nudgeMaxRetry:12,
        liveSyncDurationCount:3,
        liveMaxLatencyDurationCount:8,
        liveBackBufferLength:18,
        abrEwmaFastLive:2,
        abrEwmaSlowLive:5,
        abrEwmaDefaultEstimate:isSlowConnection()?1200000:6500000,
        abrBandWidthFactor:.88,
        abrBandWidthUpFactor:.72,
        manifestLoadingTimeOut:4500,
        manifestLoadingMaxRetry:1,
        manifestLoadingRetryDelay:250,
        manifestLoadingMaxRetryTimeout:1200,
        levelLoadingTimeOut:6500,
        levelLoadingMaxRetry:2,
        levelLoadingRetryDelay:350,
        levelLoadingMaxRetryTimeout:2500,
        fragLoadingTimeOut:10000,
        fragLoadingMaxRetry:4,
        fragLoadingRetryDelay:700,
        fragLoadingMaxRetryTimeout:6000,
        appendErrorMaxRetry:6
      });
      try{ window.mlbdHls = hls; }catch(e){}
    }catch(e){
      if(tryNativeFallback("HLS.js init failed")) return;
      hideLoader();
      autoFallback("HLS player init failed");
      return;
    }

    hls.on(Hls.Events.MEDIA_ATTACHED, function(){
      if(!samePlay()) return;
      try{ hls.loadSource(url); }
      catch(e){
        if(!tryNativeFallback("HLS source load failed")) autoFallback("HLS source load failed");
      }
    });

    hls.on(Hls.Events.MANIFEST_LOADING, function(){
      if(statusText) statusText.textContent = "Loading HLS";
      setWatchState("Loading HLS • Connected stream");
    });

    hls.on(Hls.Events.MANIFEST_PARSED, function(){
      if(!samePlay()) return;
      clearChannelFailure(currentKey);
      clearHlsTimers();
      try{ buildHlsQualitySelector(true); }
      catch(e){ try{ setResolutionLabel(bestResolutionFromList(hls.levels)); }catch(x){} }
      try{ smoothInitialAutoCap(); scheduleSmartHdBoost("hls-loaded"); }catch(e){}
      hideLoader();
      if(statusText) statusText.textContent = "Playing";
      tryPlay(ch.name);
      startSwitchAutoplayWatch(ch._playId || currentPlayId, ch.name || "HLS", 18000);
      updateMuteButton();
      showPlayerControls();
      hlsFirstPlayTimer = setTimeout(function(){
        if(!samePlay() || userPaused) return;
        if(video && video.readyState < 2){
          if(tryNativeFallback("HLS.js no video data")) return;
          try{ if(hls) hls.startLoad(-1); }catch(e){}
          setTimeout(function(){
            if(samePlay() && video && video.readyState < 2 && !userPaused){
              if(video.error){ autoFallback("HLS playable media error"); return; }
              setWatchState("HLS buffering • keeping selected source");
              if(statusText) statusText.textContent = "Buffering HLS";
              try{ if(hls) hls.startLoad(-1); }catch(e){}
            }
          }, 5000);
        }
      }, 7000);
    });

    hls.on(Hls.Events.LEVEL_LOADED, function(){
      if(!samePlay()) return;
      clearHlsTimers();
      clearChannelFailure(currentKey);
    });

    hls.on(Hls.Events.FRAG_LOADED, function(){
      if(!samePlay()) return;
      clearChannelFailure(currentKey);
    });

    hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, function(){ selectBestHlsAudio(); try{ if(window.mlbdSyncAudioLanguages) window.mlbdSyncAudioLanguages(); }catch(e){} });
    hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, function(){ updateMuteButton(); try{ if(window.mlbdSyncAudioLanguages) window.mlbdSyncAudioLanguages(); }catch(e){} });

    hls.on(Hls.Events.LEVEL_SWITCHED, function(event, data){
      if(!samePlay() || !statusText || !hls || !hls.levels || !hls.levels[data.level]) return;
      const lvl = hls.levels[data.level];
      const q = qualityLabel(lvl.height, lvl.bitrate, lvl.frameRate || lvl.attrs && lvl.attrs["FRAME-RATE"]);
      if(currentQualityMode === "auto") setResolutionLabel(q);
      statusText.textContent = "Playing" + (q ? " • " + q : "");
      pingStats("heartbeat");
    });

    hls.on(Hls.Events.ERROR, function(event, data){
      if(!data || !samePlay()) return;
      const details = String(data.details || "");

      if(!data.fatal){
        if(details === Hls.ErrorDetails.BUFFER_STALLED_ERROR || details === Hls.ErrorDetails.BUFFER_NUDGE_ON_STALL || details.indexOf("buffer") >= 0){
          try{ video.currentTime = Math.max(0, video.currentTime + .06); }catch(e){}
          if(bufferAutoRecoverTimer) clearTimeout(bufferAutoRecoverTimer);
          bufferAutoRecoverTimer = setTimeout(function(){
            if(samePlay() && !userPaused && video && video.readyState < 2) bufferGuardSwitch("HLS buffer recovery");
          }, 5200);
        }
        return;
      }

      if(isRecentManualQualitySwitch()){
        try{ hls.recoverMediaError(); hls.startLoad(-1); }catch(e){}
        setWatchState("Manual quality kept • retrying selected quality");
        if(statusText) statusText.textContent = "Manual quality";
        return;
      }

      if(data.type === Hls.ErrorTypes.NETWORK_ERROR){
        // Fatal network error means Hls.js already failed the source. Switch fast.
        if(video && video.readyState >= 2){
          setWatchState("HLS network retry • keeping current stream");
          if(statusText) statusText.textContent = "Retrying HLS";
          try{ hls.startLoad(-1); }catch(e){}
          return;
        }
        clearHlsTimers();
        if(tryNativeFallback("HLS.js network error")) return;
        autoFallback("HLS network failed");
        return;
      }

      if(data.type === Hls.ErrorTypes.MEDIA_ERROR){
        setWatchState("HLS media recovery • Continuing playback");
        if(statusText) statusText.textContent = "Recovering HLS";
        try{ hls.recoverMediaError(); }catch(e){}
        setTimeout(function(){
          if(!samePlay() || userPaused) return;
          if(video && video.readyState >= 2) return;
          if(tryNativeFallback("HLS.js media recovery failed")) return;
          autoFallback("HLS media failed");
        }, 1800);
        return;
      }

      clearHlsTimers();
      try{ destroyHls(); }catch(e){}
      if(tryNativeFallback("HLS.js fatal error")) return;
      autoFallback("Fatal HLS stream error");
    });

    hlsManifestTimer = setTimeout(function(){
      if(!samePlay() || userPaused) return;
      if(video && video.readyState >= 2) return;
      if(tryNativeFallback("HLS manifest timeout")) return;
      autoFallback("HLS manifest timeout");
    }, 3500);

    try{ hls.attachMedia(video); }
    catch(e){
      clearHlsTimers();
      if(tryNativeFallback("HLS media attach failed")) return;
      autoFallback("HLS media attach failed");
    }
  }

  function playNativeHls(ch, url){
    let settled = false;
    let failTimer = null;
    function cleanup(){
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
      video.removeEventListener("stalled", onStalled);
      video.removeEventListener("waiting", onWaiting);
      if(failTimer){ clearTimeout(failTimer); failTimer = null; }
    }
    function readyUI(){
      if(ch._playId && ch._playId !== currentPlayId) return;
      clearChannelFailure(currentKey);
      hideLoader();
      resetQualitySelector("Auto");
      setResolutionLabel(ch.quality || "Auto");
      if(statusText) statusText.textContent = "Playing";
      updateMuteButton();
      showPlayerControls();
    }
    function onReady(){
      if(settled) return;
      settled = true;
      readyUI();
      tryPlay(ch.name);
    }
    function onPlaying(){
      settled = true;
      cleanup();
      readyUI();
    }
    function onError(){
      cleanup();
      hideLoader();
      autoFallback("iPhone native HLS failed");
    }
    function onStalled(){
      hideLoader();
      if(statusText) statusText.textContent = "Reconnecting iPhone stream...";
      setWatchState("iPhone reconnecting • keeping same source");
    }
    function onWaiting(){
      hideLoader();
      if(statusText) statusText.textContent = "Buffering iPhone stream…";
      setWatchState("iPhone buffering • keeping same source");
      try{ video.play && video.play().catch(function(){}); }catch(e){}
    }

    prepareIOSVideo();
    applySoundPreference();
    try{ video.pause(); }catch(e){}
    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);
    video.addEventListener("stalled", onStalled);
    video.addEventListener("waiting", onWaiting);
    video.src = url;
    video.load();
    startAutoplaySafe("Native HLS");
    startSwitchAutoplayWatch(ch._playId || currentPlayId, "Native HLS", 16000);

    failTimer = setTimeout(function(){
      if(ch._playId && ch._playId !== currentPlayId) return;
      if(video.readyState < 2){
        if(video.error){
          cleanup();
          autoFallback(ch._nativeFallback ? "Native HLS media error" : "iPhone stream media error");
          return;
        }
        hideLoader();
        if(statusText) statusText.textContent = "Connecting";
        setWatchState("Native HLS connecting • keeping selected source");
        startSwitchAutoplayWatch(ch._playId || currentPlayId, "Native HLS", 12000);
      }
    }, 7000);
  }

  function playDirect(ch){
    prepareIOSVideo();
    video.controls = false;
    video.removeAttribute("controls");
    applySoundPreference();
    resetQualitySelector("Auto");
    video.setAttribute("autoplay", "");
    video.autoplay = true;

    video.addEventListener("canplay", function onCanPlay(){
      if(ch._playId && ch._playId !== currentPlayId) return;
      video.removeEventListener("canplay", onCanPlay);
      clearChannelFailure(currentKey);
      hideLoader();
      if(statusText) statusText.textContent = "Playing";
      tryPlay(ch.name);
      updateMuteButton();
      showPlayerControls();
    });

    video.addEventListener("error", function onError(){
      video.removeEventListener("error", onError);
      hideLoader();
      autoFallback("This stream format is not supported");
    });

    video.src = String(ch.url || "");
    video.load();
    startAutoplaySafe("Direct stream");
    startSwitchAutoplayWatch(ch._playId || currentPlayId, "Direct stream", 14000);
    setTimeout(function(){
      if(ch._playId && ch._playId !== currentPlayId) return;
      if(video && video.readyState < 2 && !userPaused){
        hideLoader();
        if(video.error){ autoFallback("Direct stream media error"); return; }
        if(statusText) statusText.textContent = "Connecting";
        setWatchState("Direct stream connecting • keeping selected source");
        startSwitchAutoplayWatch(ch._playId || currentPlayId, "Direct stream", 10000);
      }
    }, 7000);
  }

  function playCurrent(){
    prepareIOSVideo();

    if(video.paused || video.ended){
      userPaused = false;
      autoplayMutedFallbackActive = false;
      applySoundPreference();
      const p = video.play();
      if(p && typeof p.then === "function"){
        p.then(function(){ syncMediaButtons(); }).catch(function(){
          try{
            video.muted = true;
            video.defaultMuted = true;
            video.volume = 0;
            video.setAttribute("muted", "muted");
          }catch(e){}
          const retry = video.play();
          if(retry && typeof retry.catch === "function") retry.catch(function(){ if(statusText) statusText.textContent = "Tap again or select channel"; });
          syncMediaButtons();
        });
      }
    }else{
      userPaused = true;
      video.pause();
    }

    syncMediaButtons();
    showPlayerControls();
  }

  function refreshCurrent(){
    userPaused = false;
    forceSavePlayerState();
    if(currentKey) playStream(currentKey);
  }

  async function lockLandscape(){
    try{ if(screen.orientation && screen.orientation.lock) await screen.orientation.lock("landscape"); }catch(e){}
  }

  async function unlockOrientation(){
    try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){}
  }

  function updateFullscreenButton(active){
    if(!fullscreenBtn) return;
    fullscreenBtn.innerHTML = active ? '<i class="fa fa-compress"></i> Exit' : '<i class="fa fa-expand"></i> Fullscreen';
  }

  async function enterFullscreen(){
    const box = playerCard || video;
    try{
      if(box.requestFullscreen) await box.requestFullscreen();
      else if(box.webkitRequestFullscreen) await box.webkitRequestFullscreen();
      else if(video.webkitEnterFullscreen) video.webkitEnterFullscreen();

      document.body.classList.add("livetv-fullscreen");
      if(box) box.classList.add("is-fullscreen");

      await lockLandscape();
      updateFullscreenButton(true);
      showPlayerControls();

      setTimeout(function(){
        tryPlay(channelMap[currentKey] ? channelMap[currentKey].name : "LiveTV");
      }, 250);
    }catch(e){
      autoLandscapeMode();
    }
  }

  async function exitFullscreen(){
    try{
      if(document.exitFullscreen) await document.exitFullscreen();
      else if(document.webkitExitFullscreen) await document.webkitExitFullscreen();
      else if(document.msExitFullscreen) await document.msExitFullscreen();
    }catch(e){}

    document.body.classList.remove("livetv-fullscreen");

    if(playerCard){
      playerCard.classList.remove("is-fullscreen", "controls-hidden");
    }

    await unlockOrientation();
    updateFullscreenButton(false);
  }

  function toggleFullscreen(){
    if(isFullscreenNow()) exitFullscreen();
    else enterFullscreen();
  }

  function localStoreArray(key){
    try{ const v = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(v) ? v : []; }catch(e){ return []; }
  }

  function filterChannels(){
    const q = String(searchInput ? searchInput.value : "").trim().toLowerCase();
    const favs = localStoreArray("livekhela_v2_favorites");
    const recent = localStoreArray("livekhela_v2_recent");
    let visible = 0;

    channelButtons.forEach(function(btn){
      const key = btn.getAttribute("data-key") || "";
      const ch = channelMap[key] || null;
      const deviceOk = shouldShowChannelOnDevice(ch);
      const name = btn.getAttribute("data-name") || "";
      const category = btn.getAttribute("data-category") || "";
      const status = btn.getAttribute("data-status") || "";
      const isFav = favs.indexOf(key) !== -1;
      const isRecent = recent.indexOf(key) !== -1;
      const filterOk = channelFilterMode === "all" || (channelFilterMode === "live" && status === "live") || (channelFilterMode === "favorites" && isFav) || (channelFilterMode === "recent" && isRecent);
      const ok = deviceOk && filterOk && (!q || name.includes(q) || category.includes(q));
      btn.hidden = !deviceOk;
      btn.style.display = ok ? "" : "none";
      btn.setAttribute("aria-hidden", ok ? "false" : "true");
      if(ok) visible++;
    });

    if(emptyState){
      emptyState.textContent = channelFilterMode === "favorites" ? "Favorite list empty. Channel card er ⭐ tap kore add korun." : (channelFilterMode === "recent" ? "Recent channel empty. Channel play korlei ekhane ashbe." : "কোনো channel পাওয়া যায়নি।");
      emptyState.classList.toggle("show", visible === 0);
    }
  }

  function pad(n){ return String(n).padStart(2, "0"); }

  function updateEachMatchCountdown(){
    const now = Math.floor(Date.now() / 1000);
    document.querySelectorAll('[data-match-countdown]').forEach(function(el){
      const start = Number(el.getAttribute('data-start') || 0);
      const end = Number(el.getAttribute('data-end') || 0);
      const status = String(el.getAttribute('data-status') || '').toLowerCase();
      el.classList.remove('is-soon','is-finished');
      if(!start){ el.textContent = status === 'live' ? 'Live now' : 'Time TBA'; return; }
      if(status === 'live' && end && now <= end){
        let left = Math.max(0, end - now);
        const m = Math.floor(left / 60);
        const sec = left % 60;
        el.textContent = 'Live • ' + m + 'm ' + String(sec).padStart(2,'0') + 's left';
        return;
      }
      if(now < start){
        let diff = start - now;
        const d = Math.floor(diff / 86400); diff %= 86400;
        const h = Math.floor(diff / 3600); diff %= 3600;
        const m = Math.floor(diff / 60);
        const sec = diff % 60;
        if(d > 0) el.textContent = d + 'd ' + h + 'h ' + m + 'm ' + String(sec).padStart(2,'0') + 's';
        else el.textContent = h + 'h ' + m + 'm ' + String(sec).padStart(2,'0') + 's';
        if((start - now) <= 3600) el.classList.add('is-soon');
        return;
      }
      if(end && now < end){
        let left = end - now;
        const m = Math.floor(left / 60);
        const sec = left % 60;
        el.textContent = 'Live • ' + m + 'm ' + String(sec).padStart(2,'0') + 's left';
        return;
      }
      el.textContent = 'Finished';
      el.classList.add('is-finished');
    });
  }

  function updateCountdown(){
    const start = new Date(WC_START).getTime();
    let diff = start - Date.now();
    if(!Number.isFinite(diff) || diff < 0) diff = 0;

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const mins = Math.floor((diff / 60000) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const d = document.getElementById("wcDays");
    const h = document.getElementById("wcHours");
    const m = document.getElementById("wcMins");
    const s = document.getElementById("wcSecs");

    if(d) d.textContent = pad(days);
    if(h) h.textContent = pad(hours);
    if(m) m.textContent = pad(mins);
    if(s) s.textContent = pad(secs);
  }

  function startStallGuard(){
    setInterval(function(){
      if(!currentKey || video.paused || video.ended || userPaused) return;

      if(video.currentTime > 0 && video.currentTime === lastGoodTime){
        if(!stallTimer){
          stallTimer = setTimeout(function(){
            if(currentKey && video.currentTime === lastGoodTime && !userPaused){
              markChannelBuffered(currentKey);
              if(currentStreamType === "dash"){
                if(shakaPlayer){ try{ shakaPlayer.retryStreaming(); }catch(e){} }
                if(statusText) statusText.textContent = "Recovering DASH";
                setWatchState("DASH stall recovery • same stream");
              }else{
                try{ if(hls) hls.startLoad(-1); }catch(e){}
                if(statusText) statusText.textContent = "Recovering stream";
                setWatchState("Stream stall recovery • keeping same source");
              }
            }
            stallTimer = null;
          }, 3500);
        }
      }else{
        lastGoodTime = video.currentTime;
        if(stallTimer){ clearTimeout(stallTimer); stallTimer = null; }
      }
    }, 4000);
  }

  channelButtons.forEach(function(btn){
    btn.addEventListener("click", function(){
      userPaused = false;
      autoplayMutedFallbackActive = false;
      playStream(this.getAttribute("data-key"));
      playerCard.scrollIntoView({behavior:"smooth", block:"start"});
      showPlayerControls();
    });
  });

  function switchFromBarChannel(key){
    if(!key || key === currentKey) return;
    userPaused = false;
    autoplayMutedFallbackActive = false;
    playStream(key);
    showPlayerControls();
  }

  window.mlbdSwitchChannelSafe = function(key){
    key = String(key || "").trim();
    if(!key || key === currentKey) return false;
    try{ if(typeof setBarDropdownOpen === "function") setBarDropdownOpen(false); }catch(e){}
    userPaused = false;
    resetAutoFallbackSession();
    clearLoadSafety();
    playStream(key, {remote:true});
    showPlayerControls();
    return true;
  };

  if(barChannelSelect){
    barChannelSelect.addEventListener("change", function(){ switchFromBarChannel(this.value); });
  }
  if(barChannelPickerBtn && barChannelPicker){
    barChannelPickerBtn.addEventListener("click", function(e){
      e.preventDefault();
      e.stopPropagation();
      if(window.__mlbdBarDropdownPointerHandled){ window.__mlbdBarDropdownPointerHandled = false; return; }
      if(typeof setBarDropdownOpen === "function") setBarDropdownOpen(!barChannelPicker.classList.contains("is-open"));
      else {
        const open = !barChannelPicker.classList.contains("is-open");
        barChannelPicker.classList.toggle("is-open", open);
        barChannelPickerBtn.setAttribute("aria-expanded", open ? "true" : "false");
      }
    });
  }
  if(barChannelMenu && barChannelPicker){
    barChannelMenu.addEventListener("click", function(e){
      const item = e.target.closest(".bar-channel-item[data-key]");
      if(!item || item.disabled || item.classList.contains("is-down")) return;
      if(Date.now() < (window.__mlbdBarMenuDraggingUntil || 0)){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        return false;
      }
      const key = item.getAttribute("data-key") || "";
      if(typeof setBarDropdownOpen === "function") setBarDropdownOpen(false);
      else {
        barChannelPicker.classList.remove("is-open");
        if(barChannelPickerBtn) barChannelPickerBtn.setAttribute("aria-expanded", "false");
      }
      switchFromBarChannel(key);
    });
  }
  document.addEventListener("click", function(e){
    if(barChannelPicker && !barChannelPicker.contains(e.target)){
      if(typeof setBarDropdownOpen === "function") setBarDropdownOpen(false);
      else {
        barChannelPicker.classList.remove("is-open");
        if(barChannelPickerBtn) barChannelPickerBtn.setAttribute("aria-expanded", "false");
      }
    }
  });

  // MLBD FINAL FIX: reliable single public channel dropdown.
  // Old pointerdown+click combo was opening then instantly closing the menu.
  function setBarDropdownOpen(open){
    if(!barChannelPicker || !barChannelPickerBtn) return;
    open = !!open;
    barChannelPicker.classList.toggle("is-open", open);
    barChannelPickerBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if(playerCard){
      playerCard.classList.toggle("channel-dropdown-open", open);
      if(open) playerCard.classList.remove("controls-hidden");
    }
    if(open){
      try{ barChannelMenu && (barChannelMenu.style.display = "block"); }catch(e){}
      showPlayerControls();
    }
  }
  if(barChannelPickerBtn && barChannelPicker && !barChannelPickerBtn.dataset.mlbdFinalDropdownFix){
    barChannelPickerBtn.dataset.mlbdFinalDropdownFix = "1";
    barChannelPickerBtn.addEventListener("pointerdown", function(e){
      e.stopPropagation();
      window.__mlbdBarDropdownPointerHandled = false;
    }, true);
    barChannelPickerBtn.addEventListener("click", function(e){
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      setBarDropdownOpen(!barChannelPicker.classList.contains("is-open"));
      return false;
    }, true);
  }
  if(barChannelMenu && !barChannelMenu.dataset.mlbdFinalMenuFix){
    barChannelMenu.dataset.mlbdFinalMenuFix = "1";
    barChannelMenu.addEventListener("click", function(e){
      const item = e.target.closest(".bar-channel-item[data-key]");
      if(!item || item.disabled || item.classList.contains("is-down")) return;
      if(Date.now() < (window.__mlbdBarMenuDraggingUntil || 0)){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        return false;
      }
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      const key = item.getAttribute("data-key") || "";
      setBarDropdownOpen(false);
      if(key && key !== currentKey){
        userPaused = false;
        playStream(key);
        showPlayerControls();
      }
      return false;
    }, true);
  }
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && barChannelPicker && barChannelPicker.classList.contains("is-open")) setBarDropdownOpen(false);
  }, true);

  if(searchInput) searchInput.addEventListener("input", filterChannels);
  channelFilterTabs.forEach(function(tab){
    tab.addEventListener("click", function(){
      channelFilterTabs.forEach(function(t){ t.classList.remove("is-active"); });
      tab.classList.add("is-active");
      channelFilterMode = tab.getAttribute("data-channel-filter") || "all";
      filterChannels();
    });
  });
  if(playBtn) playBtn.addEventListener("click", playCurrent);
  if(muteBtn){
    muteBtn.addEventListener("click", function(){
      if(video.muted || video.volume === 0){
        userPaused = false;
        enableSound();
        forceUnmuteIfAllowed();
        if(video.paused || video.ended){
          const p = video.play();
          if(p && typeof p.then === "function") p.then(function(){ forceUnmuteIfAllowed(); syncMediaButtons(); }).catch(function(){ if(statusText) statusText.textContent = "Tap Play"; syncMediaButtons(); });
        }
      }else{
        disableSound();
      }
      syncMediaButtons();
      showPlayerControls();
    });
  }
  if(refreshBtn) refreshBtn.addEventListener("click", refreshCurrent);
  if(fullscreenBtn) fullscreenBtn.addEventListener("click", toggleFullscreen);
  if(iphonePlayerBtn) iphonePlayerBtn.addEventListener("click", function(){ playIphoneNativePlayer(); showPlayerControls(); });
  if(qualitySelect) qualitySelect.addEventListener("change", function(){
    if(qualitySelect.value && qualitySelect.value !== "auto"){
      manualQualitySwitchAt = Date.now();
      manualQualitySwitchChannel = currentKey || "";
      currentQualityMode = "manual";
    }
    applySelectedQuality();
    forceSavePlayerState();
  });

  ["fullscreenchange","webkitfullscreenchange","msfullscreenchange"].forEach(function(evt){
    document.addEventListener(evt, function(){
      const active = isFullscreenNow();
      updateFullscreenButton(active);

      if(active){
        document.body.classList.add("livetv-fullscreen");
        if(playerCard) playerCard.classList.add("is-fullscreen");
        lockLandscape();
        showPlayerControls();
      }else{
        document.body.classList.remove("livetv-fullscreen");
        if(playerCard) playerCard.classList.remove("is-fullscreen", "controls-hidden");
        unlockOrientation();
      }
    });
  });

  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && isFullscreenNow()) exitFullscreen();
  });

  ["mousemove","touchstart","pointermove","pointerdown"].forEach(function(evt){
    if(playerCard){
      playerCard.addEventListener(evt, function(){ showPlayerControls(); }, {passive:true});
    }
  });

  window.addEventListener("orientationchange", function(){
    setTimeout(function(){ autoLandscapeMode(); showPlayerControls(); }, 350);
  });
  window.addEventListener("resize", autoLandscapeMode);
  window.addEventListener("pagehide", function(){ forceSavePlayerState(); pingStats("stop"); });
  window.addEventListener("beforeunload", function(){ forceSavePlayerState(); pingStats("stop"); });
  document.addEventListener("visibilitychange", function(){
    if(document.hidden) forceSavePlayerState();
    if(!document.hidden && currentKey) startStats();
  });

  document.addEventListener("pointerdown", function(){
    syncMediaButtons();
  }, {once:true});

  // mlbd_state_save_events_v2: force-save current channel/quality before any reload/close/background.
  ["pagehide","beforeunload"].forEach(function(evt){
    window.addEventListener(evt, forceSavePlayerState, {capture:true});
  });
  document.addEventListener("visibilitychange", function(){
    if(document.visibilityState === "hidden") forceSavePlayerState();
  }, {capture:true});

  if(shareBtn){
    shareBtn.addEventListener("click", function(){
      const data = {title:document.title,text:"Watch LiveTV on MovieLinkBD",url:window.location.origin + ""};
      if(navigator.share){
        navigator.share(data).catch(function(){});
      }else if(navigator.clipboard){
        navigator.clipboard.writeText(data.url).then(function(){
          shareBtn.innerHTML = '<i class="fa fa-check"></i><span>Copied</span>';
          setTimeout(function(){ shareBtn.innerHTML = '<i class="fa fa-share-alt"></i><span>Share</span>'; }, 1200);
        });
      }
    });
  }

  video.addEventListener("click", function(e){
    try{ if(e){ e.preventDefault(); e.stopPropagation(); } }catch(_){}
    showPlayerControls();
  });

  video.addEventListener("waiting", function(){
    bufferEventsInWindow++;
    bufferStartedAt = Date.now();
    markChannelBuffered(currentKey);
    if(!bufferWindowTimer){
      bufferWindowTimer = setTimeout(function(){ bufferEventsInWindow = 0; bufferWindowTimer = null; }, 18000);
    }
    if(bufferTimer) clearTimeout(bufferTimer);
    bufferTimer = setTimeout(function(){
      if(currentStreamType === "dash"){
        // DASH/4K should behave like the test player: no big loading overlay on normal buffering.
        hideLoader();
        if(statusText) statusText.textContent = "Buffering DASH…";
        setWatchState("DASH buffering • keeping same source");
        if(shakaPlayer){ try{ shakaPlayer.retryStreaming(); }catch(e){} }
        return;
      }
      hideLoader();
      if(statusText) statusText.textContent = "Optimizing stream…";
      setWatchState("Optimizing playback • keeping stream smooth");
    }, 180);
    if(bufferAutoRecoverTimer) clearTimeout(bufferAutoRecoverTimer);
    bufferAutoRecoverTimer = setTimeout(function(){
      if(!currentKey || userPaused || video.paused) return;
      if(currentStreamType === "dash"){
        if(statusText) statusText.textContent = "Optimizing DASH…";
        setWatchState("DASH buffering • keeping same stream");
        if(shakaPlayer){ try{ shakaPlayer.retryStreaming(); }catch(e){} }
        return;
      }
      bufferGuardSwitch("Too much buffering");
    }, 6200);
  });

  video.addEventListener("playing", function(){
    userPaused = false;
    startStats();
    if(bufferTimer) clearTimeout(bufferTimer);
    if(bufferAutoRecoverTimer) clearTimeout(bufferAutoRecoverTimer);
    if(bufferSwitchTimer) clearTimeout(bufferSwitchTimer);
    bufferStartedAt = 0;
    markChannelStable(currentKey);
    hideLoader();
    if(currentKey && channelMap[currentKey] && statusText){
      statusText.textContent = "Playing";
    }
    if(currentKey && channelMap[currentKey]) setWatchState(currentQualityMode === "manual" ? ("Live now • " + selectedQualityLabel()) : "Live now • Auto quality • Smooth playback");
    applySoundPreference();
    updatePlayButton();
    showPlayerControls();
  });

  video.addEventListener("pause", function(){
    updatePlayButton();
    keepControlsVisible();
    if(currentKey && channelMap[currentKey] && userPaused && statusText){
      statusText.textContent = "Paused";
    }
  });

  video.addEventListener("ended", function(){ updatePlayButton(); keepControlsVisible(); });
  video.addEventListener("canplay", function(){ if(bufferTimer) clearTimeout(bufferTimer); if(bufferAutoRecoverTimer) clearTimeout(bufferAutoRecoverTimer); if(bufferSwitchTimer) clearTimeout(bufferSwitchTimer); bufferStartedAt = 0; markChannelStable(currentKey); hideLoader(); applySoundPreference(); updatePlayButton(); });
  video.addEventListener("loadedmetadata", function(){
    applyHdrHdEnhancement();
    if(shakaPlayer && currentQualityMode === "auto") { try{ buildShakaQualitySelector(false); }catch(e){} }
    if(video.videoHeight && currentQualityMode === "auto"){ setResolutionLabel(video.videoHeight >= 2160 ? "4K HDR" : (video.videoHeight >= 720 ? (video.videoHeight + "p HD") : (video.videoHeight + "p"))); pingStats("heartbeat"); }
    scheduleSmartHdBoost("metadata");
  });
  video.addEventListener("resize", function(){
    applyHdrHdEnhancement();
    if(shakaPlayer && currentQualityMode === "auto") { try{ buildShakaQualitySelector(false); }catch(e){} }
    if(video.videoHeight && currentQualityMode === "auto"){ setResolutionLabel(video.videoHeight >= 2160 ? "4K HDR" : (video.videoHeight >= 720 ? (video.videoHeight + "p HD") : (video.videoHeight + "p"))); }
  });
  ["play","playing","pause","ended","volumechange","loadeddata","canplay","waiting"].forEach(function(evt){
    video.addEventListener(evt, syncMediaButtons);
  });
  video.addEventListener("playing", function(){ syncMediaButtons(); });
  video.addEventListener("volumechange", syncMediaButtons);
  video.addEventListener("error", function(){ hideLoader(); syncMediaButtons(); });

  updateCountdown();
  updateEachMatchCountdown();
  setInterval(updateCountdown, 1000);
  setInterval(updateEachMatchCountdown, 1000);
  startStallGuard();
  applySoundPreference();
  updateFullscreenButton(false);
  syncMediaButtons();
  autoLandscapeMode();
  showPlayerControls();

  const firstKey = firstPlayableKey();
  if(firstKey){
    // Sync UI immediately before async stream load so reload never flashes wrong/first channel.
    currentKey = firstKey; try{ window.mlbdCurrentKey = firstKey; window.currentKey = firstKey; }catch(e){}
    syncBarChannelSelect(firstKey);
    setActiveChannel(firstKey);
    saveLastChannelKey(firstKey);
  }

  if(firstKey) playStream(firstKey);
  else{ hideLoader(); showError("No channel added yet"); }
})();
;
});
__mlbdInlineScripts.push(function(){
(function(){
  "use strict";
  var ua = navigator.userAgent || "";
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isSafariNative = /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua);
  function v(){return document.getElementById("liveVideo");}
  function mode(){
    var video=v();
    var nativeHls=!!(video && video.canPlayType && video.canPlayType("application/vnd.apple.mpegurl"));
    return (isIOS || (isSafariNative && nativeHls)) ? "iphone-muted" : "web-unmuted";
  }
  function apply(){
    var video=v(); if(!video) return;
    video.setAttribute("autoplay","");
    video.setAttribute("playsinline","");
    video.setAttribute("webkit-playsinline","");
    video.autoplay=true;
    video.playsInline=true;
    if(mode()==="iphone-muted" && !window.__mlbdSoundButtonUnlocked){
      video.muted=true;
      video.defaultMuted=true;
      video.volume=0;
      video.setAttribute("muted","muted");
    }else if(mode()==="web-unmuted" && !window.__mlbdUserMutedManually){
      video.muted=false;
      video.defaultMuted=false;
      video.volume=1;
      video.removeAttribute("muted");
    }
  }
  document.addEventListener("click",function(e){
    var btn=e.target&&e.target.closest?e.target.closest("#muteBtn"):null;
    if(!btn) return;
    window.__mlbdSoundButtonUnlocked=true;
    var video=v();
    setTimeout(function(){
      if(!video) return;
      window.__mlbdUserMutedManually=!!(video.muted || video.volume===0);
    },80);
  },true);
  document.addEventListener("DOMContentLoaded",apply,{once:true});
  window.addEventListener("pageshow",apply,{passive:true});
  ["loadedmetadata","canplay","playing"].forEach(function(ev){
    document.addEventListener(ev,function(e){ if(e.target&&e.target.id==="liveVideo") setTimeout(apply,40); },true);
  });
})();
});

/* LiveKhelaTV.com V2 public immediate features */

(function(){
  "use strict";
  var d=document;
  function qs(s,c){return (c||d).querySelector(s)}
  function qsa(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}
  function esc(v){try{return CSS.escape(String(v||""))}catch(e){return String(v||"").replace(/["\\]/g,"\\$&")}}
  function isInput(el){return !!(el&&((/^(input|textarea|select|button)$/i).test(el.tagName)||el.isContentEditable));}
  function get(k,fb){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(fb));}catch(e){return fb;}}
  function set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  function toast(msg,type){
    var wrap=qs(".mlbd-toast-stack"); if(!wrap){wrap=d.createElement("div");wrap.className="mlbd-toast-stack";d.body.appendChild(wrap);}
    var box=d.createElement("div"); box.className="mlbd-toast "+(type==="warn"?"is-warn":type==="ok"?"is-ok":"");
    box.innerHTML='<i class="fa '+(type==="warn"?"fa-exclamation-triangle":type==="ok"?"fa-check-circle":"fa-info-circle")+'"></i><span></span>';
    box.querySelector("span").textContent=msg; wrap.appendChild(box);
    setTimeout(function(){box.style.opacity="0";box.style.transform="translateY(8px)"},2400);
    setTimeout(function(){if(box.parentNode)box.parentNode.removeChild(box)},2950);
  }
  function nameByKey(key){var c=qs('.channel-card[data-key="'+esc(key)+'"]');return c?(qs(".channel-name",c)||c).textContent.trim():key;}
  function cards(){return qsa(".channel-card[data-key]").filter(function(c){return c.offsetParent!==null && c.style.display!=="none"});}
  function activeIndex(list){var i=list.findIndex(function(c){return c.classList.contains("active")});return i<0?0:i;}
  function selectKey(key){
    var card=qs('.channel-card[data-key="'+esc(key)+'"]');
    if(card){card.click();return true;}
    var sel=qs("#barChannelSelect"); if(sel){sel.value=key;try{sel.dispatchEvent(new Event("change",{bubbles:true}))}catch(e){} return true;}
    return false;
  }
  function selectIndex(i){var list=cards(); if(!list.length)return; i=(i+list.length)%list.length; list[i].click(); toast("Switching to "+nameByKey(list[i].getAttribute("data-key")),"");}

  function enhanceV2Badges(){
    qsa(".switch-title").forEach(function(el){if(!qs(".mlbd-v2-badge",el)){var b=d.createElement("span");b.className="mlbd-v2-badge";b.innerHTML='<i class="fa fa-bolt"></i> V2';el.appendChild(b);}});
  }
  function enhanceFavs(){
    var favs=get("livekhela_v2_favorites",[]);
    qsa(".channel-card[data-key]").forEach(function(card){
      var key=card.getAttribute("data-key")||""; if(!key)return;
      var btn=qs(".mlbd-fav-btn",card);
      if(btn && !btn.__favReady){
        btn.__favReady=true;
        btn.addEventListener("click",function(e){
          e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
          var list=get("livekhela_v2_favorites",[]);
          if(list.indexOf(key)>-1){list=list.filter(function(x){return x!==key});toast("Removed from favorites","");}
          else{list.unshift(key);list=list.slice(0,12);toast("Added to favorites","ok");}
          set("livekhela_v2_favorites",list); enhanceFavs(); return false;
        },true);
      }
      var on=favs.indexOf(key)>-1;
      card.classList.toggle("is-favorite",on);
      if(btn)btn.classList.toggle("is-fav",on);
      card.style.order=on?String(favs.indexOf(key)):"50";
    });
  }
  function pushRecent(key){
    if(!key)return;
    var list=get("livekhela_v2_recent",[]).filter(function(x){return x!==key});
    list.unshift(key); set("livekhela_v2_recent",list.slice(0,5)); renderRecent();
  }
  function renderRecent(){
    var row=qs("#mlbdRecentRow"); if(!row)return;
    var list=get("livekhela_v2_recent",[]).filter(function(key){return !!qs('.channel-card[data-key="'+esc(key)+'"]')});
    row.classList.toggle("is-show",list.length>0);
    row.innerHTML='<span class="mlbd-recent-title">Recent</span>'+list.map(function(key){return '<button type="button" class="mlbd-recent-btn" data-recent-key="'+String(key).replace(/"/g,"&quot;")+'"><i class="fa fa-history"></i>'+nameByKey(key)+'</button>';}).join("");
    qsa("[data-recent-key]",row).forEach(function(b){b.onclick=function(){selectKey(b.getAttribute("data-recent-key")||"")};});
  }
  function scheduleTabs(){
    var status="all", stage="all", now=Date.now()/1000;
    var day=new Date(), startDay=new Date(day.getFullYear(),day.getMonth(),day.getDate()).getTime()/1000, endDay=startDay+86400;
    function apply(){
      var count=0;
      qsa(".match-card[data-match-status]").forEach(function(card){
        var st=parseInt(card.getAttribute("data-start-ts")||"0",10), en=parseInt(card.getAttribute("data-end-ts")||"0",10);
        var s=card.getAttribute("data-match-status")||"", g=card.getAttribute("data-stage")||"group";
        var live=s==="live" || (st&&en&&now>=st&&now<=en);
        var today=st>=startDay&&st<endDay, upcoming=s==="upcoming" || st>now, finished=s==="finished";
        var okStatus=status==="all" || (status==="live"&&live) || (status==="today"&&today) || (status==="upcoming"&&upcoming) || (status==="finished"&&finished);
        var okStage=stage==="all" || g===stage;
        var show=okStatus&&okStage; card.classList.toggle("is-hidden-by-filter",!show); if(show)count++;
      });
    }
    qsa(".mlbd-schedule-tab").forEach(function(btn){btn.onclick=function(){qsa(".mlbd-schedule-tab").forEach(function(b){b.classList.remove("is-active")});btn.classList.add("is-active");status=btn.getAttribute("data-filter")||"all";apply();toast("Schedule filter applied","ok");};});
    qsa(".mlbd-stage-tab").forEach(function(btn){btn.onclick=function(){qsa(".mlbd-stage-tab").forEach(function(b){b.classList.remove("is-active")});btn.classList.add("is-active");stage=btn.getAttribute("data-stage")||"all";apply();toast("Stage filter applied","ok");};});
    apply();
  }
  function reminder(){
    var timers={};
    function now(){return Date.now();}
    function safeToast(msg,type){try{toast(msg,type||"ok")}catch(_){}}
    function btnTitle(btn){return (btn.getAttribute("data-remind-title")||"Match").replace(/\s+/g," ").trim();}
    function key(btn){return "livekhela_remind_"+(btn.getAttribute("data-remind-match")||"match");}
    function startMs(btn){
      var s=parseInt(btn.getAttribute("data-remind-start")||"0",10);
      if(!s){var box=btn.closest?btn.closest(".player-match-strip,.match-card"):null;s=parseInt((box&&box.getAttribute("data-start-ts"))||"0",10)}
      return s>0?s*1000:0;
    }
    function beforeMs(btn){var b=parseInt(btn.getAttribute("data-remind-before")||"600",10);return Math.max(60,b||600)*1000;}
    function isOn(btn){try{return localStorage.getItem(key(btn))==="1"}catch(_){return false}}
    function setOn(btn,on){try{if(on)localStorage.setItem(key(btn),"1");else{localStorage.removeItem(key(btn));localStorage.removeItem(key(btn)+"_fired");}}catch(_){} }
    function update(btn){
      var on=isOn(btn), s=qs("span",btn), i=qs("i",btn);
      btn.classList.toggle("is-saved",on);
      btn.setAttribute("aria-pressed",on?"true":"false");
      btn.setAttribute("title",on?"Cancel reminder":"Remind me 10 minutes before match");
      if(s)s.textContent=on?"Cancel reminder":"Remind me";
      if(i){i.className=on?"fa fa-bell-slash":"fa fa-bell";}
    }
    function canNotify(){return "Notification" in window;}
    function askPermission(){
      if(!canNotify())return Promise.resolve("unsupported");
      if(Notification.permission==="granted")return Promise.resolve("granted");
      if(Notification.permission==="denied")return Promise.resolve("denied");
      try{return Notification.requestPermission()}catch(_){return Promise.resolve("default")}
    }
    function fire(btn,reason){
      if(!isOn(btn))return;
      var k=key(btn);
      try{if(localStorage.getItem(k+"_fired")==="1")return;localStorage.setItem(k+"_fired","1");}catch(_){}
      var title=btnTitle(btn), body=reason||"Match starts in 10 minutes";
      if(canNotify()&&Notification.permission==="granted"){
        try{new Notification("LiveKhelaTV.com Reminder",{body:title+" — "+body,icon:"/favicon.ico",badge:"/favicon.ico",tag:k,renotify:true});}catch(_){safeToast(title+" — "+body,"ok")}
      }else safeToast(title+" — "+body,"ok");
    }
    function schedule(btn){
      var k=key(btn), sm=startMs(btn), bm=beforeMs(btn), fireAt=sm-bm;
      if(timers[k]){clearTimeout(timers[k]);delete timers[k];}
      if(!isOn(btn)||!sm)return;
      var wait=fireAt-now();
      if(wait<=0&&now()<sm+300000){fire(btn,"Match starts soon");return;}
      if(wait>0){timers[k]=setTimeout(function(){fire(btn,"Match starts in 10 minutes")},Math.min(wait,2147483000));}
    }
    qsa(".mlbd-remind-btn").forEach(function(btn){
      if(btn.__readyReminder)return; btn.__readyReminder=true;
      update(btn); schedule(btn);
      btn.onclick=function(e){
        e.preventDefault();
        var on=!isOn(btn);
        if(!on){setOn(btn,false);update(btn);schedule(btn);safeToast("Reminder cancelled","ok");return;}
        askPermission().then(function(p){
          setOn(btn,true);update(btn);schedule(btn);
          if(p==="granted")safeToast("Reminder set — 10 minutes before match","ok");
          else if(p==="denied")safeToast("Reminder saved, but browser notification is blocked","err");
          else safeToast("Reminder saved on this device","ok");
        });
      };
    });
    if(!window.__mlbdReminderWatch){
      window.__mlbdReminderWatch=setInterval(function(){qsa(".mlbd-remind-btn").forEach(function(btn){update(btn);if(isOn(btn)){var sm=startMs(btn), bm=beforeMs(btn), t=now();if(sm&&t>=sm-bm&&t<sm+300000)fire(btn,"Match starts in 10 minutes");else schedule(btn);}})},30000);
    }
  }
  function shortcuts(){
    var modal=qs("#mlbdShortcutModal"), close=qs(".mlbd-shortcut-close",modal);
    if(close&&!close.__ready){close.__ready=true;close.onclick=function(){modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");};}
    if(modal&&!modal.__ready){modal.__ready=true;modal.addEventListener("click",function(e){if(e.target===modal){modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");}});}
  }
  function autoBest(){
    if(sessionStorage.getItem("livekhela_v2_auto_best_done")==="1")return;
    var saved="";
    try{saved=localStorage.getItem("mlbd_livetv_channel")||localStorage.getItem("mlbd_livetv_current_channel")||localStorage.getItem("mlbd_livetv_last_channel")||sessionStorage.getItem("mlbd_livetv_channel")||sessionStorage.getItem("mlbd_livetv_last_channel")||""}catch(_){saved=""}
    if(saved)return;
    var fav=get("livekhela_v2_favorites",[])[0], card=fav&&qs('.channel-card[data-key="'+esc(fav)+'"]');
    if(!card)card=qsa('.channel-card[data-status="live"][data-hls="1"],.channel-card[data-status="live"]').filter(function(c){return c.offsetParent!==null})[0];
    if(card){sessionStorage.setItem("livekhela_v2_auto_best_done","1");setTimeout(function(){card.click();toast("Auto selected best server","ok");},1600);}
  }
  function init(){enhanceV2Badges();enhanceFavs();renderRecent();scheduleTabs();reminder();shortcuts();setTimeout(autoBest,500);}
  if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",init,{once:true});else init();
  setTimeout(init,1200);

  d.addEventListener("click",function(e){
    var card=e.target&&e.target.closest?e.target.closest(".channel-card[data-key],.bar-channel-item[data-key]"):null;
    if(card){var k=card.getAttribute("data-key")||""; if(k)setTimeout(function(){pushRecent(k)},120);}
  },true);

  d.addEventListener("keydown",function(e){
    var fav=e.target&&e.target.closest?e.target.closest(".mlbd-fav-btn"):null;
    if(!fav) return;
    if(e.key==="Enter"||e.key===" "){e.preventDefault();fav.click();}
  },true);

  var lastWarn=0, streamIssueTimer=null;
  function warn(msg){var t=Date.now();if(t-lastWarn<25000)return;lastWarn=t;toast(msg,"warn");}
  var video=qs("#liveVideo"), playBtn=qs("#playBtn"), muteBtn=qs("#muteBtn"), fsBtn=qs("#fullscreenBtn"), refreshBtn=qs("#refreshBtn");
  if(video){
    /* Silent buffer handling: do not show toast for normal waiting events.
       Only show one soft warning if the stream stays stuck/fails for a long time. */
    video.addEventListener("waiting",function(){
      if(streamIssueTimer) clearTimeout(streamIssueTimer);
      streamIssueTimer=setTimeout(function(){
        if(video && !video.paused && !video.ended && video.readyState < 2){
          var st=qs("#statusText"); if(st) st.textContent="Optimizing stream…";
        }
      },6500);
    },{passive:true});
    video.addEventListener("playing",function(){if(streamIssueTimer) clearTimeout(streamIssueTimer);},{passive:true});
    ["error","stalled"].forEach(function(ev){video.addEventListener(ev,function(){
      if(streamIssueTimer) clearTimeout(streamIssueTimer);
      streamIssueTimer=setTimeout(function(){warn("Stream is slow — optimizing playback")},9000);
    },{passive:true});});
  }
  function click(el){if(el)el.click();}
  d.addEventListener("keydown",function(e){
    if(isInput(e.target)||e.ctrlKey||e.metaKey||e.altKey)return;
    var k=(e.key||"").toLowerCase(), list=cards(), idx=activeIndex(list);
    if(k===" "||k==="k"){e.preventDefault(); if(playBtn)click(playBtn); else if(video){video.paused?video.play().catch(function(){}):video.pause();} }
    else if(k==="m"){e.preventDefault(); if(muteBtn)click(muteBtn); else if(video)video.muted=!video.muted;}
    else if(k==="f"){e.preventDefault(); if(fsBtn)click(fsBtn); else if(video&&video.requestFullscreen)video.requestFullscreen().catch(function(){});}
    else if(k==="r"){e.preventDefault();click(refreshBtn);toast("Refreshing stream","");}
    else if(k==="arrowright"){e.preventDefault();selectIndex(idx+1);}
    else if(k==="arrowleft"){e.preventDefault();selectIndex(idx-1);}
    else if(k==="arrowup"&&video){e.preventDefault();video.volume=Math.min(1,(video.volume||0)+.08);video.muted=false;toast("Volume "+Math.round(video.volume*100)+"%","");}
    else if(k==="arrowdown"&&video){e.preventDefault();video.volume=Math.max(0,(video.volume||0)-.08);toast("Volume "+Math.round(video.volume*100)+"%","");}
    else if(/^[1-9]$/.test(k)){var n=parseInt(k,10)-1;if(list[n]){e.preventDefault();list[n].click();}}
    else if(k==="?" || (e.shiftKey&&k==="/")){e.preventDefault();var m=qs("#mlbdShortcutModal"); if(m){m.classList.add("is-open");m.setAttribute("aria-hidden","false");}}
    else if(k==="escape"){var mo=qs("#mlbdShortcutModal"); if(mo&&mo.classList.contains("is-open")){e.preventDefault();mo.classList.remove("is-open");mo.setAttribute("aria-hidden","true");}}
  },true);
})();

var __mlbdChain=Promise.resolve();
__mlbdExternalScripts.forEach(function(src){
  __mlbdChain=__mlbdChain.then(function(){return __mlbdLoadScript(src);});
});
__mlbdChain.then(function(){
  __mlbdInlineScripts.forEach(__mlbdRun);
});
})();
