<?php
// insert_user.php (updated CORS handling)
// DEV only: plain text passwords (do NOT use in production)

$devMode = true; // set false in production

// --------------------
// CORS - allow specific origins when credentials are used
// --------------------
$allowed_origins = [
    'http://localhost:5173',   // add your dev origin(s) here
    'http://localhost:3000',   // example other dev origin
    // 'https://your-production-domain.com'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true"); // required when sending cookies / credentials
} else {
    // If origin is not allowed, do NOT set Access-Control-Allow-Origin (browser will block)
}

// Allowed methods & headers
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Respond to preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // No body for preflight; 204 is fine
    http_response_code(204);
    exit;
}

// --- rest of your DB code follows ---
$dbHost = 'localhost';
$dbName = 'track_user';
$dbUser = 'root';
$dbPass = '';
$charset = 'utf8mb4';
$dsn = "mysql:host=$dbHost;dbname=$dbName;charset=$charset";
$pdoOptions = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, $pdoOptions);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed", "details" => $devMode ? $e->getMessage() : null]);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Read input (JSON or form)
$raw = file_get_contents("php://input");
$input = [];
if (!empty($raw)) {
    $decoded = json_decode($raw, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        $input = $decoded;
    }
}

if (empty($input) && !empty($_POST)) {
    $input = $_POST;
}

$username = isset($input['username']) ? trim($input['username']) : null;
$old_password = isset($input['old_password']) ? $input['old_password'] : null;
$new_password = isset($input['new_password']) ? $input['new_password'] : null;

if (!$username || !$old_password || !$new_password) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields. Expecting username, old_password, new_password."]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, old_password, new_password) VALUES (?, ?, ?)");
    $stmt->execute([$username, $old_password, $new_password]);

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "id" => $pdo->lastInsertId(),
        "message" => "User created successfully"
    ]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(["error" => "Username already exists"]);
    } else {
        http_response_code(500);
        $resp = ["error" => "Database error"];
        if ($devMode) $resp['details'] = $e->getMessage();
        echo json_encode($resp);
    }
}
