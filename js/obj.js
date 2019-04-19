function Dataset(nome, data,num){
    this.name=nome;
    this.data=data;
    this.num=num;
}

function line(pos,hei){
    this.pos=pos;
    this.hei=hei;
}

function plotData(dataset,id){
    this.data=dataset;
    this.id=id;
}


function results(res,count,dist,distMax,distMin){
    this.res=res;
    this.num=count;
    this.dist=dist;
    this.distMin=distMin;
    this.distMax=distMax;
}
