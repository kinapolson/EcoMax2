<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "db_connect.php";

$stmt = $conn->prepare("SELECT reward_id, reward_name, reward_price, pts_required FROM rewards");
$stmt->execute();

$result = $stmt->get_result();

$rewards = [];

while($row = $result->fetch_assoc()){
    $rewards[] = [
        "reward_id" => $row["reward_id"],
        "reward_name" => $row["reward_name"],
        "reward_price" => $row["reward_price"],
        "pts_required" => $row["pts_required"]
    ];
}

echo json_encode([
    "status"=>"success",
    "rewards"=>$rewards
]);

$conn->close();
?>