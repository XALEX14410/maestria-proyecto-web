$response = Invoke-RestMethod -Uri "http://127.0.0.1:8082/api/v1/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"demo@taskhive.com", "password":"demo123"}' -ErrorAction Stop
$token = $response.token
Write-Host "Got token: $token"

try {
    Invoke-RestMethod -Uri "http://127.0.0.1:8082/api/v1/tareas" -Method GET -Headers @{"Authorization"="Bearer $token"} -ErrorAction Stop
} catch {
    Write-Host "Error details:"
    $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $errResp = $streamReader.ReadToEnd()
    $streamReader.Close()
    Write-Host $errResp
}
