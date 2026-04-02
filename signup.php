<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$name  = isset($_POST['name'])  ? trim(strip_tags($_POST['name']))  : '';
$email = isset($_POST['email']) ? trim(strip_tags($_POST['email'])) : '';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Please enter your name.']);
    exit;
}

$endpoint = 'https://my.pluggable.io/?fluentcrm=1&route=contact&hash=92e66413-1e6f-433b-9ea0-634a80e6e821';

$payload = http_build_query([
    'full_name' => $name,
    'email'     => $email,
]);

$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/x-www-form-urlencoded',
        'Accept: application/json',
    ],
]);

$response  = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_err  = curl_error($ch);
curl_close($ch);

if ($curl_err) {
    error_log('saas10 signup curl error: ' . $curl_err);
    echo json_encode(['success' => false, 'message' => 'Could not connect to subscription service. Please try again.']);
    exit;
}

if ($http_code >= 200 && $http_code < 300) {
    echo json_encode(['success' => true, 'message' => 'Subscribed successfully.']);
} else {
    error_log('saas10 signup HTTP ' . $http_code . ': ' . $response);
    echo json_encode(['success' => false, 'message' => 'Subscription failed. Please try again later.']);
}
