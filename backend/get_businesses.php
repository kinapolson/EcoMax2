<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "db_connect.php";

$sql = "SELECT * FROM businesses";
$result = $conn->query($sql);

$businesses = [];

while ($row = $result->fetch_assoc()) {

    $businesses[] = [
        "id" => $row["b_id"],
        "name" => $row["b_name"],
        "logo" => $row["b_logo"],
        "description" => $row["b_descrip"]
    ];
}

echo json_encode([
    "status" => "success",
    "businesses" => $businesses
]);
?>