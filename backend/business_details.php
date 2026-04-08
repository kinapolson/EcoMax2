<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "db_connect.php";

if ($conn->connect_error) {
    echo json_encode([
        "status"=>"error",
        "message"=>"Database connection failed"
    ]);
    exit();
}

$id = $_GET["id"];

$stmt = $conn->prepare("SELECT b_id, b_name, b_logo, b_descrip FROM businesses WHERE b_id=?");

$stmt->bind_param("i",$id);
$stmt->execute();

$result = $stmt->get_result();
$row = $result->fetch_assoc();

echo json_encode([
    "status"=>"success",
    "business"=>[
        "id"=>$row["b_id"],
        "name"=>$row["b_name"],
        "logo"=>$row["b_logo"],
        "description"=>$row["b_descrip"]
    ]
]);

$conn->close();
?>