<?php

$id=$_POST["campione"];
$ch=$_POST["ch"];

$servername = "localhost";
$username = "vagrantdb";
$password = "vagrantdb";
$dbname = "Nucleosome";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql = "SELECT * FROM Campione WHERE IDCampione=\"".$id."\"";
$result = $conn->query($sql);
$row= $result->fetch_assoc();
$campione= $row["Nome"];


$file = fopen($campione."_".$ch.".bed", "r") or die("Unable to open file!");
$res="{\"name\":\"".$campione."_".$ch."\", \"data\":[";
echo $res;
$i=0;
while(!feof($file)){
    $s=fgets($file);
    $pos = strtok($s, "\t");
    $hei = strtok("\t");
    if($s!=""){
    if($i==0){
        //devi sostituire la virgola
        
        echo "{\"pos\":\"".$pos."\",\"hei\":".str_replace(",",".",$hei)."}";
        //$res+="{\"pos\":".$pos.",\"hei\":\"".$hei."\"}";
    }
    else{
        echo ",{\"pos\":\"".$pos."\",\"hei\":".str_replace(",",".",$hei)."}";
        //$res+=",{\"pos\":".$pos.",\"hei\":\"".$hei."\"}";
    }
}
    $i++;
}
echo "]}";
//$res+="]}";

//echo $res;

?>