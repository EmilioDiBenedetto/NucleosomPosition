function createPage(){
    document.getElementById("file").addEventListener('change', readSingleFile, false);
    $.post("Server/selectSpecie.php",{
    },function(data,error){
        if(data!="0 results"){
        res=JSON.parse(data);
        text="<option value=\""+null+"\"></option>";

        for(x in res){
            text+="<option value=\""+res[x].id+"\">"+res[x].name+"</option>";
        }
       
        document.getElementById("specie").innerHTML+=text;
    }
    });
}


function tipo(specie){
    console.log(specie);
    if(specie!="null"){
        $.post("Server/selectTipo.php",{
            req: specie
        },function(data,error){
            
            console.log(data);
            if(data!="0 results"){
                res=JSON.parse(data);
                text="<option value=\""+null+"\"></option>";

                for(x in res){
                    text+="<option value=\""+res[x].id+"\">"+res[x].name+"</option>";
                }
                document.getElementById("tipo").innerHTML+=text;
            }
        
        });
    }
}

function campione(tipo){
    if(tipo!="null"){
        $.post("Server/selectCampione.php",{
            req: tipo
        },function(data,error){
            if(data!="0 results"){
                res=JSON.parse(data);
                text="<option value=\""+null+"\"></option>";
                for(x in res){
                    text+="<option value=\""+res[x].id+"\">"+res[x].name+"</option>";
                }
                document.getElementById("campione").innerHTML+=text;
            }
        });
    }
}

function ch(campione){
    if(tipo!="null"){
        $.post("Server/selectCh.php",{
            req: campione
        },function(data,error){
            if(data!="0 results"){
                res=JSON.parse(data);
                text="";
                for(x in res){
                    text+="<option value=\""+res[x].name+"\">"+res[x].name+"</option>";
                }
                document.getElementById("ch").innerHTML+=text;
            }
        });
    }
}

