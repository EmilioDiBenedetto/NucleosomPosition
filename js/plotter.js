var plots=new Array();
var nowPlots=new Array();
var TempData;
var id=0;
var anchoredPlots=new Array();

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        document.getElementById("filelabel").innerHTML=document.getElementById("file").value.substring(12);
        saveData(contents,document.getElementById("file").value);
        
    };
    reader.readAsText(file);
}

function saveData(text,name){
    var temp1=text.split("\n");
    
    var res=new Array();
    var i=0;
    for(x in temp1){
        var temp2=temp1[x].split("\t");
        if(temp2[1]!=undefined){
            var med=(parseInt(temp2[1])+parseInt(temp2[2]))/2;
            res.push(parseInt(med));
            i=temp2[2];
        }
    }
    
    TempData=new Dataset(name,res,i);
}

function createFromFile(){
    plots.push(new plotData(TempData,id));
    id++;
    var start=0,end=parseInt(TempData.num);
    
    if(document.getElementById("start").value!=""){
        start=parseInt(document.getElementById("start").value);
    }
    if(document.getElementById("end").value!=""){
        end=parseInt(document.getElementById("end").value);
    }
    var size=(end-start)/(1245/5);
    if(document.getElementById("size").value!=""){
        size=parseInt(document.getElementById("size").value);
    }
    
    createNew(TempData,start,end,id-1,size);
}

function plot(dataset,start,end,size,id){

    var data = createPlotData(dataset,start,end,size);
   
    var res = data.res;
    nowPlots.push(new plotData(res,id));
    var c = document.createElement("CANVAS");
    var wid =((end-start)/size+1)*15+100;
    var hei=300
    c.width  = wid-20; 
    c.height = hei;
    var maxi= maximum(res);
    var ctx = c.getContext("2d");
    i=0
    var dim=parseInt(size);
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,wid,500);
    //var text="";
    for(x in res){
        
        if(i>0){
        //text+=res[x-1]+"\t";
        ctx.fillStyle = "red";
        ctx.fillRect(65+15*(i-1)-3, (hei-10)-(res[x-1]*(hei-40)/maxi)-3,6,6);
        ctx.moveTo(65+15*(i-1), (hei-10)-(res[x-1]*(hei-40)/maxi));
        ctx.lineTo(65+15*i, (hei-10)-(res[x]*(hei-40)/maxi));
        //console.log(res[x-1].pos);
        if((i-1)%4==0){
        ctx.font="9px Time New Roman";
        ctx.textAlign="center";
        var temp=parseInt(dim)*i+parseInt(start);
        ctx.strokeText(temp,65+15*(i-1),(hei-3));
        ctx.fillRect(65+15*(i-1),(hei-15),1,10);
        ctx.fillStyle = "grey";
        ctx.fillRect(65+15*(i-1),10,1,(hei-25));
        }
        ctx.stroke();
        }
        
        i++;
    }
    if((i-1)%4==0){
        ctx.font="9px Time New Roman";
        ctx.textAlign="center";
        var temp=parseInt(dim)*i+parseInt(start);
        ctx.strokeText(temp,65+15*(i-1),(hei-2));
        ctx.fillRect(65+15*(i-1),(hei-15),1,10);
        ctx.fillStyle = "grey";
        ctx.fillRect(65+15*(i-1),10,1,(hei-25));
    }
    ctx.fillStyle = "red";
    ctx.fillRect(65+15*(i-1)-3, (hei-10)-(res[x]*(hei-40)/maxi)-3,6,6);
    ctx.fillStyle = "black";
    ctx.fillRect(40,(hei-10),wid-70,1);
    ctx.fillRect(40,10,1,(hei-20));
    var t=0;
    //console.log(text);
    //console.log(maxi);
    while(t<=7){
        ctx.fillStyle = "grey";
        ctx.fillRect(40,((hei-40)/7)*t-6,wid-70,1);
        ctx.fillStyle = "red";
        ctx.fillRect(35,((hei-40)/7)*t-6,10,1);
        ctx.font="9px Time New Roman";
        ctx.textAlign="right";
        var text=((((hei-40)/7)*t)*maxi/(hei-40) );
        ctx.strokeText(parseFloat(text.toFixed(1)),33,hei-((hei-40)/7)*t-6);
        t++;
    }

    var plotArea=document.createElement("DIV");
    plotArea.setAttribute("class","plotArea");
    plotArea.setAttribute("id","plotArea"+id);
    plotArea.setAttribute("onscroll", "anchorScroll(this,"+id+")");
    plotArea.appendChild(c);
    var stat=document.createElement("DIV");
    stat.setAttribute("class","statArea");
    stat.innerHTML="<p>Windows Size:<br> "+parseInt(size)+"<p>";
    stat.innerHTML+="<p>Number of Nuclosome:<br> "+data.num+"<p>";
    stat.innerHTML+="<p>Average Distance:<br>"+data.dist+" bp<p>";
    stat.innerHTML+="<p>Maximum Distance:<br>"+data.distMax+" bp<p>";
    stat.innerHTML+="<p>Minimum Distance:<br>"+data.distMin+" bp<p>";
    var div=document.createElement("DIV");
    div.appendChild(plotArea);
    div.appendChild(stat);
    return div;
}


function createPlotData(dataset,start,end,size){

    //console.log(start +" "+ end+" "+size);
    var res= new Array(parseInt((end-start)/size)+1);
    var count=0;
    var cumDist=0;
    var distMax;
    var distMin;
    var prePos;
    for (i = 0; i < res.length; i++) {
        res[i]=0;
        
    }
    //console.log(size+"\t");
    for(x in dataset.data){
        cur = dataset.data[x];
        if(parseInt(dataset.data[x])>=start&&parseInt(dataset.data[x])<=end){
            
            
            var index=parseInt((cur-start)/size);
            res[index]++;
        
        if(prePos!=undefined && prePos<cur){
            cumDist+=cur-prePos;
            
            if(distMax==undefined || distMax<(cur-prePos)){
                distMax=cur-prePos;
            }
            if(distMin==undefined || distMin>(cur-prePos)){
                distMin=cur-prePos;
            }
            //console.log( cur + " "+ prePos+" "+distMax+ " " + distMin+"\n");
        }
        count++;
        }
        prePos=cur;
    }
    var dist=(cumDist/(count-1));
    /*
    var varix=0;
    var variy=0;
    
    var avgx=0;
    for(i=0; i< res.length-1; i++){
        avgx+=(i+1)*size;
    }
    avgx=avgx/(res.length-1);


    for(i=0; i< res.length-1; i++){
        varix+=Math.pow(((i+1)*size-avgx),2);
    }
    var devx=Math.sqrt(varix/(res.length-1));
    var avgy=0;
    for(i=0; i<res.length-1; i++){
        avgy+=res[i].hei;
    }
    agvy=avgy/(res.length-1)
    for(i=0; i< res.length-1; i++){
        variy+=Math.pow((res[i].hei-avgy),2);
    }
    var devy=Math.sqrt(variy/(res.length-1));
    var cov=0;
    for(i=0; i< res.length-1; i++){
        cov+=(res[i].hei-avgy)*((i+1)*size-avgx);
    }
    cov=cov/(res.length-2);

    var pearson= cov/(devx*devy);

    */
    return new results(res,count,dist.toFixed(2),distMax,distMin);
}

function createFromServer(){

    $.post("Server/Plots.php",{
        campione: document.getElementById("campione").value,
        ch: document.getElementById("ch").value
    },function(data,error){
        var res=JSON.parse(data);
        var dati= new Array();
        i=0;
        for(x in res.data){
            
            var t=res.data[x].hei;
            
            dati.push((parseInt(res.data[x].pos)));
            i=res.data[x].pos;
        }

        var temp=new Dataset(res.name,dati,i);
        plots.push(new plotData(temp,id));
        id++;
        var start=0,end=temp.num;
        if(document.getElementById("startServer").value!=""){
            start=parseInt(document.getElementById("startServer").value);
        }
        if(document.getElementById("endServer").value!=""){
            end=parseInt(document.getElementById("endServer").value);
        }
        var size=(end-start)/(1245/5);
        //console.log(start +" "+ end);
        if(document.getElementById("sizeServer").value!=""){
            size=parseInt(document.getElementById("sizeServer").value);
        }
        createNew(temp,start,end,id-1,size);
    });
}


function createNew(dataset,start,end,id,size){
    var div=document.createElement("DIV");
    div.setAttribute("class","plot");
    div.setAttribute("id",id);
    var text=document.createElement("P");
    text.innerHTML="N. "+id +" - " +dataset.name;
    text.setAttribute("id","name");
    var anchor=document.createElement("BUTTON");
    anchor.setAttribute("value", "false");
    anchor.innerHTML="Anchor";
    anchor.setAttribute("onclick","anchor(this,"+id+")");
    var labelS=document.createElement("LABEL");
    var labelE=document.createElement("LABEL");
    var labelW=document.createElement("LABEL");
    labelS.innerHTML="Start:";
    labelE.innerHTML="End:";
    labelW.innerHTML="Size:";
    var startT=document.createElement("INPUT");
    startT.setAttribute("type","text");
    var endT=document.createElement("INPUT");
    endT.setAttribute("type","text");
    var sizeT=document.createElement("INPUT");
    sizeT.setAttribute("type","text");
    var button=document.createElement("BUTTON");
    button.innerHTML="Resize";
    button.setAttribute("onclick","resize("+id+","+start+","+end+","+size+")");
    var pearson=document.createElement("BUTTON");
    pearson.setAttribute("onclick","pearson_c()");
    pearson.innerHTML="Calculate Pearson coefficient";
    var buttonD=document.createElement("BUTTON");
    buttonD.innerHTML="Delete";
    buttonD.setAttribute("onclick","deleteDiv(this,"+id+")");
    var div2=document.createElement("DIV");
    div2.setAttribute("class","plotSetting");
    div2.appendChild(text);
    div2.appendChild(labelS);
    div2.appendChild(startT);
    div2.appendChild(labelE);
    div2.appendChild(endT);
    div2.appendChild(labelW);
    div2.appendChild(sizeT);
    div2.appendChild(buttonD);
    div2.appendChild(button);
    div2.appendChild(anchor);
    div2.appendChild(pearson);
    div.appendChild(div2);
    div.appendChild(plot(dataset,start,end,size,id));
    document.getElementsByTagName("body")[0].appendChild(div);
}

function resize(id,start,end,size){
    var div= document.getElementById(id);
    
    if(div.getElementsByTagName("input")[0].value!=""){
        start=parseInt(div.getElementsByTagName("input")[0].value);
        var size=(end-start)/(1245/5);
    }
    if(div.getElementsByTagName("input")[1].value!=""){
        end=parseInt(div.getElementsByTagName("input")[1].value);
        var size=(end-start)/(1245/5);
    }

    if(div.getElementsByTagName("input")[2].value!=""){
        size=parseInt(div.getElementsByTagName("input")[2].value);
    }

    var temp=new Array;
    for(x in nowPlots){

        if(id!=nowPlots[x].id){
            temp.push(nowPlots[x]);
        }
    }

    nowPlots=temp;

    
    var dataset;
    for(x in plots){
        if(plots[x].id==id){
            dataset=plots[x].data;
        }
    }
    //var canvas=plotArea.getElementsByTagName("canvas")[0];
    try{
    div.removeChild(div.getElementsByTagName("div")[1]);
    }
    finally{
    div.appendChild(plot(dataset,start,end,size,id));
    }
    nowPlots.sort(function(x,y){console.log(x.id + " " + y.id);return x.id-y.id});
}


function deleteDiv(div,id){
    var div=document.getElementById(id);
    document.getElementsByTagName("body")[0].removeChild(div);
    var temp=new Array;
    for(x in plots){
        if(plots[x].id!=id){
            temp.push(plots[x]);
            
        }
    }
    plots=temp;
    var temp=new Array;
    for(x in anchoredPlots){

        if(id!=anchoredPlots[x]){
            temp.push(anchoredPlots[x]);
        }
    }
    anchoredPlots=temp;

    var temp=new Array;
    for(x in nowPlots){

        if(id!=nowPlots[x].id){
            temp.push(nowPlots[x]);
        }
    }

    nowPlots=temp;

}


function maximum(data){
    var max=0;
    for(x in data){
        if(data[x]>max){
            max=data[x];
        }
    }
    return max;
}

function anchor(anchor,id){
    if(anchor.value=="true"){
        var temp=new Array;
        for(x in anchoredPlots){

            if(id!=anchoredPlots[x]){
                temp.push(anchoredPlots[x]);
            }
        }
        anchoredPlots=temp;
        anchor.innerHTML="Anchor"
        anchor.value="false";
    }
    else{
        anchoredPlots.push(id);
        anchor.value="true";
        anchor.innerHTML="Anchored"
        console.log(anchoredPlots);
    }
} 

function anchorScroll(div,id){
    var flag=false;
    for(x in anchoredPlots){
        if(id==anchoredPlots[x]){
            flag=true;
            break;
        }

    }
    if(flag){
        for(x in anchoredPlots){
            if(id!=anchoredPlots[x]){
                document.getElementById("plotArea"+ anchoredPlots[x]).scrollLeft=div.scrollLeft;
                
            }
           
        }
    }
    
}

function pearson_c(){

var myWindow = window.open("", "Pearson coefficient", "width=600, height=500");
var text="<table style=\"border: 1px solid black; border-collapse: collapse; text-align: center;\">";
text+="<tr style=\"border: 1px solid black; border-collapse: collapse; text-align: center; padding: 5px;\"><th></th>";
for (x in nowPlots){
    text+="<th>"+nowPlots[x].id+"</th>";
}
text+="</tr>";    
for(x in nowPlots){
    text+="<tr style=\"border: 1px solid black; border-collapse: collapse; text-align: center;\"><th>"+nowPlots[x].id+"</th>";
    for (y in nowPlots){
        text+="<th style=\"border: 1px solid black; border-collapse: collapse; text-align: center; padding: 5px;\">";
        if(nowPlots[x].data.length==nowPlots[y].data.length){
            text+=spearson.correlation.pearson(nowPlots[x].data,nowPlots[y].data).toFixed(7);
            
        }
        text+="</th>";
    }
    text+="</tr>";
}
text+="</table>";
myWindow.document.write(text);


}