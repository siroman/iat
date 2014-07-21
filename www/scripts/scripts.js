"use strict";google.setOnLoadCallback(function(){angular.bootstrap(document.body,["ItaliaATavola"])}),google.load("feeds","1"),angular.module("ItaliaATavola",["ionic","ItaliaATavola.controllers","ItaliaATavola.controllers.news","ItaliaATavola.controllers.article"]).run(["$ionicPlatform",function(a){a.ready(function(){window.StatusBar&&StatusBar.styleDefault()})}]).config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("app",{url:"/app","abstract":!0,templateUrl:"templates/menu.html",controller:"AppCtrl"}).state("app.news",{url:"/news",views:{menuContent:{templateUrl:"templates/news.html",controller:"NewsCtrl"}}}).state("app.article",{url:"/news/:articleId",views:{menuContent:{templateUrl:"templates/article.html",controller:"ArticleCtrl"}}}).state("app.browse",{url:"/browse",views:{menuContent:{templateUrl:"templates/browse.html"}}}).state("app.playlists",{url:"/playlists",views:{menuContent:{templateUrl:"templates/playlists.html",controller:"PlaylistsCtrl"}}}).state("app.single",{url:"/playlists/:playlistId",views:{menuContent:{templateUrl:"templates/playlist.html",controller:"PlaylistCtrl"}}}),b.otherwise("/app/news")}]),angular.module("ItaliaATavola.directives.masonry",[]).directive("masonry",["$timeout",function(a){return{restrict:"AC",link:function(b,c){b.$watch(function(){return c[0].children.length},function(){a(function(){c.masonry("reloadItems"),c.masonry()})}),c.masonry({itemSelector:".masonry-brick",columnWidth:30,gutter:1,transitionDuration:".5s",hiddenStyle:{opacity:.001,transform:"scale(0.01)"},visibleStyle:{opacity:1,transform:"scale(1)"}}),b.masonry=c.data("masonry")}}}]),angular.module("ItaliaATavola.controllers",["ItaliaATavola.services"]).controller("AppCtrl",["$scope",function(){}]).controller("PlaylistsCtrl",["$scope",function(a){a.playlists=[{title:"Reggae",id:1},{title:"Chill",id:2},{title:"Dubstep",id:3},{title:"Indie",id:4},{title:"Rap",id:5},{title:"Cowbell",id:6}]}]).controller("PlaylistCtrl",["$scope","$stateParams",function(){}]),angular.module("ItaliaATavola.controllers.news",["ItaliaATavola.services","ItaliaATavola.directives.masonry"]).controller("NewsCtrl",["$state","$scope","$ionicModal","$timeout","$cordovaToast","Feeds",function(a,b,c,d,e,f){c.fromTemplateUrl("templates/categoryFilter.html",{scope:b,animation:"slide-in-down"}).then(function(a){b.modal=a}),b.showFilter=function(){b.modal.show()},b.hideFilter=function(a){b.search.categories=a||"",b.modal.hide()},b.$on("$destroy",function(){b.modal.remove()}),b.getimage=function(a){return'url("'+a.img+'")'},f.load().then(function(a){b.articles=a.articles,b.categories=a.categories,b.search=a.filter}),b.showArticle=function(b){a.go("app.article",{articleId:b.guid2})},b.doRefresh=function(){f.refresh().then(function(){b.$broadcast("scroll.refreshComplete"),e.showShortTop("Refresh completato")})}}]),angular.module("ItaliaATavola.controllers.article",["ngCordova"]).controller("ArticleCtrl",["$scope","$stateParams","$window","$cordovaSocialSharing","$cordovaToast","Feeds",function(a,b,c,d,e,f){d.canShareVia("Twitter").then(function(){a.canTwitter=!0}),d.canShareVia("Facebook").then(function(b){a.canFacebook=b}),d.canShareVia("WhatsApp").then(function(b){a.canWhatsApp=b}),a.showArticle=function(){window.open(a.article.link,"_blank","location=yes")},f.getArticle(b.articleId).then(function(b){a.article=b}),a.shareFB=function(){d.shareViaFacebook(a.article.title,a.article.img,a.article.link).then(function(){e.showShortCenter("Articolo condiviso su Facebook")},function(){e.showLongCenter("Si è verificato un'errore durante la condivisione")})},a.shareTwitter=function(){d.shareViaTwitter(a.article.title,a.article.img,a.article.link).then(function(){e.showShortCenter("Articolo condiviso su Twitter")},function(){e.showLongCenter("Si è verificato un'errore durante la condivisione")})},a.shareWhatsApp=function(){d.shareViaWhatsApp(a.article.title,a.article.img,a.article.link).then(function(){e.showShortCenter("Articolo condiviso su WhatsApp")},function(){e.showLongCenter("Si è verificato un'errore durante la condivisione")})}}]),angular.module("ItaliaATavola.services",["ngStorage"]).service("Guid",function(){this.newGuid=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=16*Math.random()|0,c="x"==a?b:3&b|8;return c.toString(16)})}}).factory("Feeds",["$q","$localStorage","Guid",function(a,b,c){function d(b){var d=a.defer(),e=new google.feeds.Feed("http://www.italiaatavola.net/rss-facebook.asp");return e.setNumEntries(100),e.setResultFormat(google.feeds.Feed.XML_FORMAT),e.load(function(a){if(!a.error){for(var e,f,g=a.xmlDocument.getElementsByTagName("item"),h=0;h<g.length;h++)e=g[h],f=e.getElementsByTagName("category")[0].innerHTML,b.articles.push({guid:e.getElementsByTagName("guid")[0].innerHTML,guid2:c.newGuid(),title:e.getElementsByTagName("title")[0].innerHTML,description:e.getElementsByTagName("description")[0].innerHTML,link:e.getElementsByTagName("link")[0].innerHTML,pubDate:Date.parse(e.getElementsByTagName("pubDate")[0].innerHTML),img:e.getElementsByTagName("enclosure")[0].attributes.url.value,categories:f}),-1===b.categories.indexOf(f)&&b.categories.push(f);d.resolve(b)}}),d.promise}var e=b.$default({articles:[],categories:[],filter:{categories:""}});return{load:function(){if(0===e.articles.length)return d(e);var b=a.defer();return b.resolve(e),b.promise},refresh:function(){var a={articles:[],categories:[]};return d(a).then(function(a){for(var b,c=function(a){return a.guid===this.guid},d=0;d<a.articles.length;d++)b=a.articles[d],e.articles.some(c,b)||e.articles.push(b),-1===e.categories.indexOf(b.categories)&&e.categories.push(b.categories);return e})},getArticle:function(a){return this.load().then(function(b){var c=function(b){return b.guid2===a},d=b.articles.filter(c);return d[0]})}}}]);