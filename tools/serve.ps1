$root = "F:\games\newsistar-site"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:8931/")
$listener.Start()
Write-Output "serving $root at http://127.0.0.1:8931/"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  # POST /models/city-model.glb：保存请求体到文件（工具页端到端测试用）
  if ($ctx.Request.HttpMethod -eq 'POST') {
    $ms = New-Object System.IO.MemoryStream
    $ctx.Request.InputStream.CopyTo($ms)
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($rel -like "/models/*") {
      $dst = Join-Path $root ($rel -replace "/", "\")
      $dir = Split-Path $dst -Parent
      if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
      [System.IO.File]::WriteAllBytes($dst, $ms.ToArray())
      Write-Output ("POST saved: $dst ($($ms.Length) bytes)")
      $b = [System.Text.Encoding]::UTF8.GetBytes("saved $($ms.Length)")
      $ctx.Response.ContentType = "text/plain"
      $ctx.Response.OutputStream.Write($b, 0, $b.Length)
    } else {
      $ctx.Response.StatusCode = 403
    }
    $ctx.Response.Close()
    continue
  }
  $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
  if ($rel -eq "/") { $rel = "/tools/litematic2glb.html" }
  $file = Join-Path $root ($rel -replace "/", "\")
  if (Test-Path $file -PathType Leaf) {
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $ext = [System.IO.Path]::GetExtension($file).ToLower()
    $mime = @{ ".html" = "text/html; charset=utf-8"; ".js" = "text/javascript"; ".css" = "text/css"; ".png" = "image/png"; ".ico" = "image/x-icon"; ".glb" = "model/gltf-binary"; ".json" = "application/json"; ".woff2" = "font/woff2" }[$ext]
    if (-not $mime) { $mime = "application/octet-stream" }
    $ctx.Response.ContentType = $mime
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $ctx.Response.StatusCode = 404
    $b = [System.Text.Encoding]::UTF8.GetBytes("not found")
    $ctx.Response.OutputStream.Write($b, 0, $b.Length)
  }
  $ctx.Response.Close()
}
