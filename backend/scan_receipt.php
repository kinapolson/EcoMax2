<?php
header("Content-Type: application/json");
include "db_connect.php";

file_put_contents("upload_debug.txt", print_r($_FILES, true));

$user_id = $_POST["user_id"] ?? 0;

if(!isset($_FILES["receipt"])){
  echo json_encode(["status"=>"error","message"=>"No receipt uploaded"]);
  exit;
}

$targetDir = "uploads/receipts/";
if(!file_exists($targetDir)){
  mkdir($targetDir,0777,true);
}

$fileName = time().".jpg";
$targetFile = $targetDir.$fileName;

if (!move_uploaded_file($_FILES["receipt"]["tmp_name"], $targetFile)) {
  echo json_encode([
    "status" => "error",
    "message" => "Failed to move uploaded file"
  ]);
  exit;
}


// OCR
$tesseract = "tesseract";
$imagePath = realpath($targetFile);

$cmd = $tesseract . " " . escapeshellarg($imagePath) . " stdout -l eng --oem 3 --psm 6 2>&1";
$ocr = shell_exec($cmd);

if ($ocr === null || trim($ocr) === "") {
  echo json_encode([
    "status" => "error",
    "message" => "OCR failed",
    "ocr" => $ocr
  ]);
  exit;
}

file_put_contents("ocr_debug.txt",$ocr);


// PARSING
$lines = explode("\n",$ocr);

$business = "";
$total = 0;
$prices = [];
$detectedItems = [];
$totalPoints = 0;

foreach($lines as $line){
  $clean = strtolower(trim($line));
  if(strpos($clean,"wawa") !== false) {
    $business = "Wawa";
  }
}

foreach($lines as $line){ 
  $clean = strtolower(trim($line));

  if(strpos($clean,"total") !== false) {
    preg_match('/\d+\.\d{2}/',$clean,$match);
    if(isset($match[0])) {
      $total = floatval($match[0]); 
    }
  }

  preg_match_all('/\d+\.\d{2}/',$clean,$matches);
  foreach($matches[0] as $p) {
    $prices[] = floatval($p);
  }
}

if($total == 0 && count($prices) > 0){
  $total = max($prices);
}

$res = $conn->query("SELECT item_name, pts_req FROM business_items");

while($row = $res->fetch_assoc()) {
  $itemName = strtolower($row["item_name"]);
  $points = $row["pts_req"];
  $words = explode(" ",$itemName);

  foreach($lines as $line) {
    $clean = strtolower(trim($line));
    $matchCount = 0;

    foreach($words as $w) {
      if(strlen($w) > 3 && strpos($clean,$w) !== false) {
        $matchCount++;
      }
    }

    if($matchCount >= 2) {
      $price = 0;
      preg_match('/\d+\.\d{2}/',$clean,$match);

      if(isset($match[0])) {
        $price = floatval($match[0]);
      }

      $detectedItems[] = [
        "name"=>$row["item_name"],
        "price"=>$price,
        "points"=>$points
      ];

      $totalPoints += $points;
      break;
    }
  }
}

echo json_encode([
  "status"=>"pending",
  "fileName"=>$fileName,
  "business"=>$business,
  "items"=>$detectedItems,
  "total"=>$total,
  "points"=>$totalPoints,
  "ocr"=>$ocr
]);
?>