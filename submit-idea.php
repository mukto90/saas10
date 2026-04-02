<?php
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
    'From: saas10 Ideas <ideas@saas10.xyz>',
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
    <p style="color:#888580;margin:0 0 24px;font-size:14px;">saas10.xyz idea submission</p>

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

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Idea submitted successfully.']);
} else {
    error_log('saas10 submit-idea mail() failed for: ' . $email);
    echo json_encode(['success' => false, 'message' => 'Failed to send. Please try emailing us directly.']);
}
