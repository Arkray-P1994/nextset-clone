<?php
// fetch_user_ids.php - CORS-safe logger that records client IP (MySQL PDO).

$allowedOrigins = [
    'http://localhost:5173',
    // 'https://your-production-site.com',
];

$dbHost = 'localhost';
$dbName = 'track_user';
$dbUser = 'root';
$dbPass = '';
$dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";

function send_json($data, $status = 200)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function add_cors_headers_for_origin(string $origin)
{
    // Must echo exact origin when credentials are used
    header("Access-Control-Allow-Origin: {$origin}");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Max-Age: 600");
    // help caches/proxies know responses vary by Origin
    header("Vary: Origin");
}

// ---- CORS + preflight handling (must happen before any potential redirect) ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origin && in_array($origin, $allowedOrigins, true)) {
    add_cors_headers_for_origin($origin);

    // If preflight OPTIONS -> return 204 with CORS headers and no body (no redirects).
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
} else {
    // If an Origin header exists but it's not allowed, reject non-OPTIONS requests.
    // For OPTIONS from disallowed origin: return 204 WITHOUT CORS headers would still fail preflight,
    // so better return 403 for non-OPTIONS to make the problem visible.
    if ($origin) {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            // respond 403 for preflight from disallowed origin (explicit)
            http_response_code(403);
            exit;
        } else {
            send_json(['error' => 'Origin not allowed'], 403);
        }
    }
}

// ---- rest of your script: safe to proceed (no preflight redirect now) ----
try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    send_json(['error' => 'Database connection failed'], 500);
}

// determine client ip...
$ipAddress = 'unknown';
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
    $candidate = trim($parts[0]);
    if (filter_var($candidate, FILTER_VALIDATE_IP)) {
        $ipAddress = $candidate;
    }
}
if ($ipAddress === 'unknown' && !empty($_SERVER['REMOTE_ADDR'])) {
    $candidate = $_SERVER['REMOTE_ADDR'];
    if (filter_var($candidate, FILTER_VALIDATE_IP)) {
        $ipAddress = $candidate;
    }
}
if ($ipAddress === '') {
    $ipAddress = 'unknown';
}

try {
    $sql = "INSERT INTO visit_logs (ip_address, created_at) VALUES (:ip_address, NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':ip_address' => $ipAddress]);

    $insertId = $pdo->lastInsertId();

    send_json([
        'success'    => true,
        'id'         => $insertId,
        'ip_address' => $ipAddress,
        'message'    => 'IP logged'
    ], 201);
} catch (PDOException $e) {
    send_json(['error' => 'Failed to insert log'], 500);
}
