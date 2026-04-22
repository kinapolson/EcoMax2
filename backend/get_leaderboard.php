<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "db_connect.php";

$sql = "SELECT user_id, first_name, last_name, eco_pts, pfp FROM users ORDER BY eco_pts DESC";
$result = $conn->query($sql);

if (!$result) {
  echo json_encode([
    "status" => "error",
    "message" => $conn->error
  ]);
  exit();
}

$leaderboard = [];
$rank = 1;

while ($row = $result->fetch_assoc()) {
  $leaderboard[] = [
    "id" => $row["user_id"],
    "name" => $row["first_name"] . " " . $row["last_name"],
    "score" => $row["eco_pts"],
    "rank" => $rank,
    "pfp" => $row["pfp"] ? $row["pfp"] : "default.png"
  ];
  $rank++;
}

echo json_encode([
  "status" => "success",
  "leaderboard" => $leaderboard
]);

$conn->close();
?>