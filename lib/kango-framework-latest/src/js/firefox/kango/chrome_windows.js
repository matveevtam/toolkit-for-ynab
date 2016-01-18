function ChromeWindows(){EventTarget.call(this),this._unloadListeners=[],this.init()}var utils=require("kango/utils"),func=utils.func,array=utils.array,object=utils.object,EventTarget=utils.EventTarget;ChromeWindows.prototype=object.extend(EventTarget,{event:{WINDOW_LOAD:"WindowLoad",WINDOW_UNLOAD:"WindowUnload"},init:function(){this._watchWindows(),this._watchNotCompletelyLoadedWindows()},dispose:function(){this.removeAllEventListeners(),Services.ww.unregisterNotification(this._windowWatcher),this._runUnloaders(),this._unloadListeners=[]},_runUnloaders:function(){array.forEach(this._unloadListeners,function(e){try{e()}catch(t){kango.console.reportError(t,"unloader")}})},_removeUnloadListener:function(e){for(var t=this._unloadListeners,n=0;n<t.length;n++)if(t[n]==e)return void t.splice(n,1)},_listenLoadEvent:function(e,t,n){var i=function(){e.removeEventListener("load",i,!0),t.call(n||null,e)};e.addEventListener("load",i,!0)},_watchWindows:function(){this._windowWatcher=func.bind(function(e,t){"domwindowopened"==t?this._listenLoadEvent(e,function(e){"navigator:browser"==e.document.documentElement.getAttribute("windowtype")&&this.fireEvent(this.event.WINDOW_LOAD,{window:e})},this):"domwindowclosed"==t&&"navigator:browser"==e.document.documentElement.getAttribute("windowtype")&&this.fireEvent(this.event.WINDOW_UNLOAD,{window:e})},this),Services.ww.registerNotification(this._windowWatcher)},_watchNotCompletelyLoadedWindows:function(){for(var e=Services.wm.getEnumerator("navigator:browser");e.hasMoreElements();){var t=e.getNext();"complete"!=t.document.readyState&&this._listenLoadEvent(t,function(e){this.fireEvent(this.event.WINDOW_LOAD,{window:e})},this)}},getHiddenWindow:function(){return(Services.appShell||Cc["@mozilla.org/appshell/appShellService;1"].getService(Ci.nsIAppShellService)).hiddenDOMWindow},getLoadedChromeWindows:function(){for(var e=[],t=Services.wm.getEnumerator("navigator:browser");t.hasMoreElements();){var n=t.getNext();"complete"==n.document.readyState&&e.push(n)}return e},getChromeWindows:function(){for(var e=[],t=Services.wm.getEnumerator("navigator:browser");t.hasMoreElements();){var n=t.getNext();e.push(n)}return e},getMostRecentChromeWindow:function(){return Services.wm.getMostRecentWindow("navigator:browser")},getActiveWindow:function(){return Services.ww.activeWindow},registerContainerUnloader:function(e,t){var n=func.bind(function(i){i&&this._removeUnloadListener(n),t.removeEventListener("unload",n,!1),e()},this);this._unloadListeners.push(n),t.addEventListener("unload",n,!1)}}),module.exports=new ChromeWindows;