<?php
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid payload.']);
    exit;
}

$title       = isset($data['title'])       ? trim(strip_tags($data['title']))       : '';
$description = isset($data['description']) ? trim(strip_tags($data['description'])) : '';
$name        = isset($data['name'])        ? trim(strip_tags($data['name']))        : '';
$email       = isset($data['email'])       ? trim(strip_tags($data['email']))       : '';

if (empty($title) || empty($description) || empty($name) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$to      = 'n.mukto@gmail.com';
$subject = 'New Tool Idea: ' . $title;
$headers = implode("\r\n", [
    'From: SaaS10 Ideas <saas10@codexpert.io>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Content-Type: text/html; charset=UTF-8',
    'MIME-Version: 1.0',
    'X-Mailer: PHP/' . phpversion(),
]);

$body = '
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f5f5;padding:20px;">
  <div style="background:#0a0a0a;border-radius:12px;padding:32px;color:#f0ede8;">
    <h2 style="margin:0 0 8px;font-size:22px;color:#c8f060;">New Tool Idea Submitted</h2>
    <p style="color:#888580;margin:0 0 24px;font-size:14px;">SaaS10.xyz idea submission</p>

    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#888580;font-size:13px;width:120px;">Tool Title</td>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#f0ede8;font-size:14px;font-weight:bold;">' . htmlspecialchars($title) . '</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#888580;font-size:13px;vertical-align:top;">Description</td>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#f0ede8;font-size:14px;line-height:1.6;">' . nl2br(htmlspecialchars($description)) . '</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#888580;font-size:13px;">Submitted by</td>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#f0ede8;font-size:14px;">' . htmlspecialchars($name) . '</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888580;font-size:13px;">Email</td>
        <td style="padding:12px 0;color:#c8f060;font-size:14px;"><a href="mailto:' . htmlspecialchars($email) . '" style="color:#c8f060;">' . htmlspecialchars($email) . '</a></td>
      </tr>
    </table>
  </div>
</body>
</html>';

function getEnvVar($key, $default = '') {
    $val = getenv($key);
    if ($val === false) {
        $val = $_ENV[$key] ?? $default;
    }
    return $val;
}

function sendEmailViaSES($to, $subject, $body, $headers) {
    $awsAccessKey = getEnvVar('AWS_ACCESS_KEY_ID');
    $awsSecretKey = getEnvVar('AWS_SECRET_ACCESS_KEY');
    $awsRegion    = getEnvVar('AWS_SES_REGION', 'us-east-1');
    $fromEmail    = getEnvVar('AWS_SES_FROM_EMAIL', 'saas10@codexpert.io');

    if (empty($awsAccessKey) || empty($awsSecretKey)) {
        error_log('AWS SES credentials not configured');
        return false;
    }

    $service = 'ses';
    $host    = 'email.' . $awsRegion . '.amazonaws.com';
    $endpoint = 'https://' . $host . '/v2/email/outbound-emails';

    $replyTo = '';
    if (preg_match('/Reply-To:\s*.*<(.+)>/i', $headers, $m)) {
        $replyTo = $m[1];
    } elseif (preg_match('/Reply-To:\s*(.+)/i', $headers, $m)) {
        $replyTo = trim($m[1]);
    }

    $payload = json_encode([
        'FromEmailAddress' => $fromEmail,
        'Destination' => [
            'ToAddresses' => [$to]
        ],
        'Content' => [
            'Simple' => [
                'Subject' => [
                    'Data' => $subject,
                    'Charset' => 'UTF-8'
                ],
                'Body' => [
                    'Html' => [
                        'Data' => $body,
                        'Charset' => 'UTF-8'
                    ]
                ]
            ]
        ],
        'ReplyToAddresses' => $replyTo ? [$replyTo] : []
    ]);

    $now        = new DateTime('UTC');
    $amzDate    = $now->format('Ymd\THis\Z');
    $dateStamp  = $now->format('Ymd');
    $algorithm  = 'AWS4-HMAC-SHA256';
    $service    = 'ses';
    $credential = $awsAccessKey . '/' . $dateStamp . '/' . $awsRegion . '/' . $service . '/aws4_request';

    $canonicalUri       = '/v2/email/outbound-emails';
    $canonicalQuery     = '';
    $canonicalHeaders   = "content-type:application/json\nhost:" . $host . "\nx-amz-date:" . $amzDate . "\n";
    $signedHeaders      = 'content-type;host;x-amz-date';
    $payloadHash        = hash('sha256', $payload);
    $canonicalRequest   = "POST\n" . $canonicalUri . "\n" . $canonicalQuery . "\n" . $canonicalHeaders . "\n" . $signedHeaders . "\n" . $payloadHash;
    $stringToSign       = $algorithm . "\n" . $amzDate . "\n" . $dateStamp . '/' . $awsRegion . '/' . $service . '/aws4_request' . "\n" . hash('sha256', $canonicalRequest);

    $kDate    = hash_hmac('sha256', $dateStamp, 'AWS4' . $awsSecretKey, true);
    $kRegion  = hash_hmac('sha256', $awsRegion, $kDate, true);
    $kService = hash_hmac('sha256', $service, $kRegion, true);
    $kSigning = hash_hmac('sha256', 'aws4_request', $kService, true);
    $signature = bin2hex(hash_hmac('sha256', $stringToSign, $kSigning, true));

    $headersArr = [
        'Content-Type: application/json',
        'Host: ' . $host,
        'X-Amz-Date: ' . $amzDate,
        'Authorization: ' . $algorithm . ' Credential=' . $credential . ', SignedHeaders=' . $signedHeaders . ', Signature=' . $signature
    ];

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $endpoint,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => $headersArr,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_TIMEOUT        => 30
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        error_log('AWS SES error: ' . $response);
        return false;
    }

    return true;
}

$sesEnabled = getEnvVar('AWS_SES_ENABLED') === 'true';

if ($sesEnabled) {
    $sent = sendEmailViaSES($to, $subject, $body, $headers);
} else {
    $sent = mail($to, $subject, $body, $headers);
}

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Idea submitted successfully.']);
} else {
    error_log('SaaS10 submit-idea mail() failed for: ' . $email);
    echo json_encode(['success' => false, 'message' => 'Failed to send. Please try emailing us directly.']);
}
