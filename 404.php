<?php
$page_title = 'Page Not Found';
$page_desc  = 'The page you are looking for does not exist.';
include 'header.php';
?>

<style>
.error-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}
.error-content {
  max-width: 500px;
}
.error-code {
  font-size: 8rem;
  font-weight: 800;
  line-height: 1;
  color: var(--accent);
  letter-spacing: -0.04em;
}
.error-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 1rem 0 0.75rem;
}
.error-desc {
  color: var(--muted);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}
.error-btn {
  display: inline-block;
  padding: 0.875rem 1.75rem;
  background: var(--accent);
  color: var(--bg);
  text-decoration: none;
  font-weight: 600;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.error-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(200,240,96,0.2);
}
</style>

<div class="error-page">
  <div class="error-content">
    <div class="error-code">404</div>
    <h1 class="error-title">Page not found</h1>
    <p class="error-desc">The page you're looking for doesn't exist or has been moved. Try one of our tools instead.</p>
    <a href="/" class="error-btn">Browse All Tools</a>
  </div>
</div>

<?php include 'footer.php'; ?>
