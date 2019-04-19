<?php

$id=$_POST["req"];

$servername = "localhost";
$username = "vagrantdb";
$password = "vagrantdb";
$dbname = "Nucleosome";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql = "SELECT * FROM CH WHERE IDCampione=\"".$id."\"";
$result = $conn->query($sql);
$msg=array();

if ($result->num_rows > 0) {

    while($row = $result->fetch_assoc()) {
        $ch->name=$row["Nome"];
        
        array_push($msg,$ch);
        $ch=null;
        
    }
} 

if(count($msg)>0){
    echo (json_encode($msg));
}
else{
    echo "0 results";
}
$conn->close();

?>