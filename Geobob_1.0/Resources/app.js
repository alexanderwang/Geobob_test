// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var win_index = Titanium.UI.createWindow({  
	url:'main_windows/Index.js',
    title:'Welcome',
    backgroundColor:'#fff',
    barColor:'#000'
});
var tab1 = Titanium.UI.createTab({  
    icon:'map.png',
    title:'About',
    window:win_index
});





//
// create controls tab and root window
//
var win_geomap = Titanium.UI.createWindow({ 
	url:'main_windows/Geomap.js',
    title:'GeoMap',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'map.png',
    title:'GeoMap',
    window:win_geomap
});





//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  


// open tab group
tabGroup.open();
