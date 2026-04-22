<?php
header("Content-Type: application/json");
include "db_connect.php";

$user_id = $_POST["user_id"] ?? 0;

//if no img was uploaded, return error
if(!isset($_FILES["receipt"])){
  echo json_encode(["status"=>"error","message"=>"No receipt uploaded"]);
  exit;
}

//folder where receipt imgs will be stored
$targetDir = "uploads/receipts/";
  //if folder does not exist, create it
  if(!file_exists($targetDir)){
  mkdir($targetDir,0777,true);
}

//setting filename with current timestamp
$fileName = time().".jpg";

//path where img will be saved
$targetFile = $targetDir.$fileName;

//moving img from temp storage -> folder
move_uploaded_file($_FILES["receipt"]["tmp_name"],$targetFile);


//ocr
//path to ocr installed on server
$tesseract = '"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"';

//tells tesseract to read img and output txt
$cmd = $tesseract.' "'.realpath($targetFile).'" stdout -l eng --oem 3 --psm 6';

//run cmd and store txt
$ocr = shell_exec($cmd);

//save ocr txt to a file for debugging
file_put_contents("ocr_debug.txt",$ocr);


//parsing 
$lines = explode("\n",$ocr);

//storing info
$business = "";
$total = 0;
$prices = [];
$detectedItems = [];
$totalPoints = 0;


//business name detection
//looping for each line
foreach($lines as $line){
  //cleaning text
  $clean = strtolower(trim($line));
  
  //checking for mulitple variations
  if(strpos($clean,"wawa") !== false || strpos($clean,"awa") !== false || strpos($clean,"hava") !== false) {
    $business = "Wawa";
  }
}


//total price detection
foreach($lines as $line){ 
  $clean = strtolower(trim($line));
  
  //looking for total variations
  if(strpos($clean,"total") !== false || strpos($clean,"tota") !== false || strpos($clean,"tal") !== false) {
    //price format
    preg_match('/\d+\.\d{2}/',$clean,$match);
    
    //save total, if found
    if(isset($match[0])) {
      $total = floatval($match[0]); 
    }
  }

  //collect all prices on receipt
  preg_match_all('/\d+\.\d{2}/',$clean,$matches);
  
  foreach($matches[0] as $p) {
    $prices[] = floatval($p);
  }
}
//no total found, assume highest price is total
if($total == 0 && count($prices) > 0){
  $total = max($prices);
}


//matching item from database
//connecting to business item database
$res = $conn->query("SELECT item_name, pts_req FROM business_items");

//loop through each item in the database
while($row = $res->fetch_assoc()) {
  $itemName = strtolower($row["item_name"]);
  $points = $row["pts_req"];
  $words = explode(" ",$itemName);

  //cmp each reeipt line with item name
  foreach($lines as $line) {
    $clean = strtolower(trim($line));
    $matchCount = 0;

    //count how words match
    foreach($words as $w) {
      if(strlen($w) > 3 && strpos($clean,$w) !== false) {
        $matchCount++;
      }
    }

    //assume item was purchased if 2 or more words match
    if($matchCount >= 2) {
      $price = 0;
      preg_match('/\d+\.\d{2}/',$clean,$match);
      
      if(isset($match[0])) {
        $price = floatval($match[0]);
      }
      
      //add detected items to list
      $detectedItems[] = ["name"=>$row["item_name"], "price"=>$price, "points"=>$points];
      //add pts to total
      $totalPoints += $points;
      
      break;
    }
  }
}

//save receipt
$stmt = $conn->prepare("
  INSERT INTO receipts
  (user_id,business_name,receipt_img,total_price,pts_earned)
  VALUES (?,?,?,?,?)
");

$stmt->bind_param("issdi",$user_id,$business,$fileName,$total,$totalPoints);

$stmt->execute();

$receipt_id = $stmt->insert_id;


//save receipt items
foreach($detectedItems as $it) {
  $stmt = $conn->prepare("INSERT INTO receipt_items (receipt_id,item_name,item_price,pts_earned) VALUES (?,?,?,?)");
  $stmt->bind_param("isdi",
    $receipt_id,
    $it["name"],
    $it["price"],
    $it["points"]
  );
  $stmt->execute();
}


//update user pts
$stmt = $conn->prepare("
  UPDATE users
  SET eco_pts = eco_pts + ?
  WHERE user_id=?
");

$stmt->bind_param("ii",$totalPoints,$user_id);
$stmt->execute();


//response
echo json_encode([
  "status"=>"success",
  "business"=>$business,
  "items"=>$detectedItems,
  "total"=>$total,
  "points"=>$totalPoints,
  "ocr"=>$ocr
]);
?>