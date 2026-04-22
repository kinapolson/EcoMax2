<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "db_connect.php";

$user_id = 1; //need to connect to all users not just user 1 (i'll get that fixed later)

$sql = "SELECT eco_pts FROM users WHERE user_id=?";
$stmt = $conn->prepare($sql);

if(!$stmt){
    echo json_encode([
        "status"=>"error",
        "message"=>"SQL prepare failed"
    ]);
    exit;
}

$stmt->bind_param("i",$user_id);
$stmt->execute();

$result = $stmt->get_result();

if($result && $result->num_rows > 0){
    $row = $result->fetch_assoc();

    echo json_encode([
        "status"=>"success",
        "points"=>$row["eco_pts"]
    ]);
}else{
    echo json_encode([
        "status"=>"error",
        "message"=>"User not found"
    ]);
}
?>