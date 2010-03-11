var categorylist=readFile('data/category.txt');

var annotationlist=readFile('data/annotations.txt');
var obj=JSON.parse(annotationlist);
		
		
var annotation=obj.annotation;
var isAndroid = Titanium.Platform.name == 'android';
var cur_latitude;
var cur_longitude;
var isByName={};
var pins=[];
var androidlistener=0;
var obj1=JSON.parse(categorylist);
var category=obj1.category;
var datalist=[];
var isByNameList={};

// load annotations from Json
for (var i=0;i<annotation.length;i++)
{ 	
	
	var result=annotation[i];
	var leftButton_temp;
	for (j=0;j<category.length;j++)
	{
		if(result.category==category[j].title)
		{
			leftButton_temp=category[j].icon;
			
		}
		
	}
	
	pins.push({
			  latitude:result.latitude,
			  longitude:result.longitude,
			  title:result.title,
			  animate:true,
			  subtitle:result.subtitle,
			  pincolor:Titanium.Map.ANNOTATION_RED,
			  myid:result.id,
			  leftButton:result.image,
			  rightButton: !isAndroid ? Titanium.UI.iPhone.SystemButton.DISCLOSURE :result.rightButton
	});
	isByName[result.title]=i;
		
}


// get geolocations
if(!isAndroid)
{
	Titanium.Geolocation.getCurrentPosition(
	function(pos)
	{
		Ti.API.info(pos.coords.latitude);
	
		cur_latitude = pos.coords.latitude;
		cur_longitude = pos.coords.longitude;
		createviews();
   

	},
	function()
	{	


	},
	{enableHighAccuracy:true}
	);
}
else
{
	cur_latitude = 41.75141844644966;
	cur_longitude = -111.8063807487488;
	createviews();
}



function createviews()
{
	// create mapview	
	var mapview = Titanium.Map.createView({
		mapType: Titanium.Map.HYBRID_TYPE,
		region: {latitude:cur_latitude, longitude:cur_longitude, latitudeDelta:0.01, longitudeDelta:0.01},
		animate:true,
		regionFit:true,  
		userLocation:true,
		annotations:pins
	});


	mapview.addEventListener('click',function(evt)
	{
		Ti.API.info('you clicked on '+evt.title+' with click source = '+evt.clicksource);

		if (evt.clicksource == 'rightButton')
		{
		   var index=isByName[evt.title];
		   var w = Titanium.UI.createWindow({
		   url:annotation[index].homepage
		   });
		   w.open({animated:true});
		}

	});

	
	
	// create tableview
	
	 
	 var rownum=0;
	

	for(var j=0;j<category.length;j++)
	{
		var classnum=0;
		datalist.push({
					header:category[j].title});
		for(var i=0;i<annotation.length;i++)
		{
			var row = Ti.UI.createTableViewRow();
			row.selectedBackgroundColor = '#fff';
			row.height  =100;
			row.className = 'datarow';
			var result=annotation[i];
			var appDir=Titanium.Filesystem.getResourcesDirectory();
			var temp=Titanium.Filesystem.getFile(appDir,result.image);
			var imagefile;
		
			if(temp.exists()&&result.image!="images/")
			{
				imagefile=result.image;
			}
			else
			{
				imagefile=category[j].icon;
			}
			if(result.category==category[j].title)
			{
				
					var image = Ti.UI.createView({
						backgroundImage:"../"+imagefile,
						top:5,
						left:10,
						width:50,
						height:50
					});
					row.add(image);
					var title = Ti.UI.createLabel({
						color:'#576996',
						font:{fontSize:16,fontWeight:'bold', fontFamily:'Arial'},
						left:70,
						top:2,
						height:30,
						width:150,
						text:result.title
					});
					row.add(title);
					var subtitle = Ti.UI.createLabel({
						color:'#222',
						font:{fontSize:16,fontWeight:'normal', fontFamily:'Arial'},
						left:70,
						top:21,
						height:50,
						width:150,
						text:result.subtitle
					});
					row.add(subtitle);
					var mapbutton = Ti.UI.createView({
						backgroundImage:result.mapButton,
						right:50,
						top:10,
						width:36,
						height:30
					});
					
					mapbutton.addEventListener('click', function(e)
					{
						var rowNum = e.source.rowNum;
						index=isByNameList[rowNum];
						var pinRegion = {latitude:annotation[index].latitude,longitude:annotation[index].longitude,animate:true,latitudeDelta:0.005, longitudeDelta:0.005};
						
						
						
						
						Titanium.UI.currentWindow.setTitle('GeoMap');
						if(!isAndroid)
						{
							mode.title='List';
							Titanium.UI.currentWindow.setToolbar(null);
							Titanium.UI.currentWindow.setToolbar([mode,std,hyb,sat,zoomin,zoomout,sv]);
						}
						tableView.visible=false;
						mapview.visible=true;
						mapview.setLocation(pinRegion);
						mapview.selectAnnotation(annotation[index].title,true);
						
					});
					mapbutton.rowNum=rownum+1;
					row.add(mapbutton);
					
					var resourcebutton = Ti.UI.createView({
						backgroundImage:result.rightButton,
						right:5,
						top:10,
						width:36,
						height:30
					});
					resourcebutton.addEventListener('click', function(e)
					{
						var rowNum = e.source.rowNum;
					});
					resourcebuttonrowNum=rownum+1;
					row.add(resourcebutton);
					datalist.push(row);
				classnum++;
				rownum++;
				isByNameList[rownum]=i;
				
			}
		}
	}
	
	var tableView = Titanium.UI.createTableView({
		data:datalist
	});			
	Titanium.UI.currentWindow.add(mapview);
	Titanium.UI.currentWindow.add(tableView);
	
	tableView.visible=false;
	
	var regionSV = {latitude:cur_latitude,longitude:cur_longitude,animate:true,latitudeDelta:0.01, longitudeDelta:0.01};

	if (!isAndroid) 
	{
	
	var flexSpace = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	var mode = Titanium.UI.createButton({
		title:'List',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	mode.addEventListener('click',function()
	{	
		Titanium.API.info("windows");
		if(mode.title=='List')
		{
			tableView.visible=true;
			mapview.visible=false;
			mode.title='Map';
			Titanium.UI.currentWindow.setToolbar(null);
			Titanium.UI.currentWindow.setToolbar([mode]);
			Titanium.UI.currentWindow.setTitle('Pin List');
		}
		else
		{
			tableView.visible=false;
			mapview.visible=true;
			mode.title='List';
			Titanium.UI.currentWindow.setToolbar(null);
			Titanium.UI.currentWindow.setToolbar([mode,std,hyb,sat,zoomin,zoomout,sv]);
			Titanium.UI.currentWindow.setTitle('GeoMap');
		}
	});
	var sat = Titanium.UI.createButton({
		title:'Sat',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	sat.addEventListener('click',function()
	{
		mapview.setMapType(Titanium.Map.SATELLITE_TYPE);
	});
	var std = Titanium.UI.createButton({
		title:'Std',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	std.addEventListener('click',function()
	{
		mapview.setMapType(Titanium.Map.STANDARD_TYPE);
	});

	var hyb = Titanium.UI.createButton({
		title:'Hyb',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	hyb.addEventListener('click',function()
	{
		mapview.setMapType(Titanium.Map.HYBRID_TYPE);
	});

	var sv = Titanium.UI.createButton({
		title:'SV',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	sv.addEventListener('click',function()
	{
		mapview.setLocation(regionSV);
	});

	var zoomin = Titanium.UI.createButton({
		title:'+',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	zoomin.addEventListener('click',function()
	{
		mapview.zoom(1);
	});
	var zoomout = Titanium.UI.createButton({
		title:'-',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	zoomout.addEventListener('click',function()
	{
		mapview.zoom(-1);
	});

	Titanium.UI.currentWindow.setToolbar([mode,std,hyb,sat,zoomin,zoomout,sv]);
	} 
	else
	{
		var menu = Titanium.UI.createMenu();
		menu.addItem("List View", function() {
		
			Titanium.UI.currentWindow.showView(tableView,{animated:true});
	
			Titanium.UI.currentWindow.setTitle('Pin List');
		
		
		}, Titanium.UI.Android.SystemIcon.VIEW);
		menu.addItem("Map View", function() {
		
			Titanium.UI.currentWindow.showView(mapview,{animated:true});
	
			Titanium.UI.currentWindow.setTitle('GeoMap');
		
		
		}, 'map.png');

		menu.addItem("Current Loc", function() {
		mapview.setLocation(regionSV);
		}, Titanium.UI.Android.SystemIcon.ADD);
		
		menu.addItem("Zoom In", function() {
		mapview.zoom(1);
		}, Titanium.UI.Android.SystemIcon.ZOOM);
		menu.addItem("Zoom Out", function() {
		mapview.zoom(-1);
		}, Titanium.UI.Android.SystemIcon.ZOOM);
	

		menu.addItem("Standard", function() {
		mapview.setMapType(Titanium.Map.STANDARD_TYPE);
		});
		menu.addItem("Satellite", function() {
		mapview.setMapType(Titanium.Map.SATELLITE_TYPE);
		});
		menu.addItem("Hybrid", function() {
		mapview.setMapType(Titanium.Map.HYBRID_TYPE);
		});

		

		Titanium.UI.setMenu(menu);
	}
}
function readFile(filename){ 
	var f = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,filename);
	var contents = f.read();
	var category=contents.text;
	return category;
} 		
	