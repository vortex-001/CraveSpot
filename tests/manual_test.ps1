# ============================================================
# CraveSpot Manual Test Script (PowerShell)
# Tests every API endpoint and frontend page
# ============================================================

$API = "http://127.0.0.1:5000"
$FRONTEND = "http://127.0.0.1:5500"
$pass = 0
$fail = 0
$results = @()

function Test-Endpoint {
    param($name, $method, $url, $body=$null, $expectStatus=200, $checkField=$null, $checkValue=$null)
    try {
        $params = @{ Uri=$url; Method=$method; TimeoutSec=10; ErrorAction="Stop" }
        if ($body) {
            $params["Body"] = ($body | ConvertTo-Json -Compress)
            $params["ContentType"] = "application/json"
        }
        $resp = Invoke-WebRequest @params
        $status = $resp.StatusCode
        $json = $resp.Content | ConvertFrom-Json -ErrorAction SilentlyContinue

        $ok = ($status -eq $expectStatus)
        $fieldOk = $true
        $fieldInfo = ""
        if ($checkField -and $json) {
            $val = $json.$checkField
            if ($checkValue) {
                $fieldOk = ($val -eq $checkValue)
                $fieldInfo = "[$checkField=$val]"
            } else {
                $fieldOk = ($null -ne $val)
                $fieldInfo = "[$checkField exists]"
            }
        }
        $finalOk = $ok -and $fieldOk
        $script:pass += [int]$finalOk
        $script:fail += [int](!$finalOk)
        $icon = if ($finalOk) {"PASS"} else {"FAIL"}
        $results += [PSCustomObject]@{Result=$icon; Test=$name; Status=$status; Info=$fieldInfo}
        Write-Host "  [$icon] $name  HTTP $status $fieldInfo" -ForegroundColor (if($finalOk){"Green"}else{"Red"})
    } catch {
        $errMsg = $_.Exception.Message -replace "`r|`n",""
        $script:fail++
        $results += [PSCustomObject]@{Result="FAIL"; Test=$name; Status="ERR"; Info=$errMsg}
        Write-Host "  [FAIL] $name  ERROR: $errMsg" -ForegroundColor Red
    }
}

function Test-Page {
    param($name, $url)
    try {
        $resp = Invoke-WebRequest -Uri $url -TimeoutSec=10 -ErrorAction Stop
        $ok = ($resp.StatusCode -eq 200) -and ($resp.Content -match "CraveSpot")
        $script:pass += [int]$ok; $script:fail += [int](!$ok)
        $icon = if ($ok) {"PASS"} else {"FAIL"}
        $results += [PSCustomObject]@{Result=$icon; Test=$name; Status=$resp.StatusCode; Info=""}
        Write-Host "  [$icon] $name  HTTP $($resp.StatusCode)" -ForegroundColor (if($ok){"Green"}else{"Red"})
    } catch {
        $errMsg = $_.Exception.Message -replace "`r|`n",""
        $script:fail++
        $results += [PSCustomObject]@{Result="FAIL"; Test=$name; Status="ERR"; Info=$errMsg}
        Write-Host "  [FAIL] $name  ERROR: $errMsg" -ForegroundColor Red
    }
}

# ============================================================
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  CraveSpot Manual Test Suite" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# --- SECTION 1: Core Backend ---
Write-Host ""
Write-Host "--- SECTION 1: Core API Endpoints ---" -ForegroundColor Yellow
Test-Endpoint "GET / (root status)" GET "$API/" -checkField "success" -checkValue $true
Test-Endpoint "GET /api/health (DB check)" GET "$API/api/health" -expectStatus 200
Test-Endpoint "GET / database=CraveSpot" GET "$API/" -checkField "database" -checkValue "CraveSpot"

# --- SECTION 2: Restaurants ---
Write-Host ""
Write-Host "--- SECTION 2: Restaurant Endpoints ---" -ForegroundColor Yellow
Test-Endpoint "GET /api/restaurants (all)" GET "$API/api/restaurants"
Test-Endpoint "GET /api/restaurants?search=pizza" GET "$API/api/restaurants?search=pizza"
Test-Endpoint "GET /api/restaurants?veg_only=1" GET "$API/api/restaurants?veg_only=1"
Test-Endpoint "GET /api/restaurants?min_rating=4.0" GET "$API/api/restaurants?min_rating=4.0"
Test-Endpoint "GET /api/restaurants?city=Chandigarh" GET "$API/api/restaurants?city=Chandigarh"
Test-Endpoint "GET /api/restaurants/1 (single)" GET "$API/api/restaurants/1"
Test-Endpoint "GET /api/restaurants/1/menu" GET "$API/api/restaurants/1/menu"
Test-Endpoint "GET /api/restaurants/999 (not found)" GET "$API/api/restaurants/999" -expectStatus 404

# --- SECTION 3: Menu Items / Dishes ---
Write-Host ""
Write-Host "--- SECTION 3: Menu Items / Dishes ---" -ForegroundColor Yellow
Test-Endpoint "GET /api/menu-items (all)" GET "$API/api/menu-items"
Test-Endpoint "GET /api/menu-items?search=biryani" GET "$API/api/menu-items?search=biryani"
Test-Endpoint "GET /api/menu-items?veg_only=1" GET "$API/api/menu-items?veg_only=1"
Test-Endpoint "GET /api/menu-items?max_price=200" GET "$API/api/menu-items?max_price=200"
Test-Endpoint "GET /api/menu-items?category=pizza" GET "$API/api/menu-items?category=pizza"
Test-Endpoint "GET /api/dishes (alias)" GET "$API/api/dishes"

# --- SECTION 4: Categories ---
Write-Host ""
Write-Host "--- SECTION 4: Categories ---" -ForegroundColor Yellow
Test-Endpoint "GET /api/categories" GET "$API/api/categories"

# --- SECTION 5: Reviews ---
Write-Host ""
Write-Host "--- SECTION 5: Reviews ---" -ForegroundColor Yellow
Test-Endpoint "GET /api/restaurants/1/reviews" GET "$API/api/restaurants/1/reviews"
Test-Endpoint "POST review (valid)" POST "$API/api/restaurants/1/reviews" @{user_name="TestUser";rating=5;comment="Excellent biryani!"} -expectStatus 201
Test-Endpoint "POST review (missing rating)" POST "$API/api/restaurants/1/reviews" @{user_name="TestUser"} -expectStatus 400

# --- SECTION 6: Craving Engine ---
Write-Host ""
Write-Host "--- SECTION 6: Craving Engine ---" -ForegroundColor Yellow
Test-Endpoint "GET /api/cravings/taxonomy" GET "$API/api/cravings/taxonomy"
Test-Endpoint "GET /api/cravings/surprise-me" GET "$API/api/cravings/surprise-me"
Test-Endpoint "POST /api/cravings/recommend (spicy)" POST "$API/api/cravings/recommend" @{query="spicy food";latitude=30.7333;longitude=76.7794} -checkField "success" -checkValue $true
Test-Endpoint "POST /api/cravings/recommend (cheesy veg)" POST "$API/api/cravings/recommend" @{query="cheesy veg pizza under 300";latitude=30.7333;longitude=76.7794} -checkField "success" -checkValue $true
Test-Endpoint "POST /api/cravings/recommend (sweet)" POST "$API/api/cravings/recommend" @{query="something sweet"} -checkField "success" -checkValue $true
Test-Endpoint "POST /api/cravings/recommend (empty query)" POST "$API/api/cravings/recommend" @{query=""} -expectStatus 400

# --- SECTION 7: Geolocation ---
Write-Host ""
Write-Host "--- SECTION 7: Geolocation & Live Places ---" -ForegroundColor Yellow
Test-Endpoint "GET /api/location/geocode?q=Chandigarh" GET "$API/api/location/geocode?q=Chandigarh" -checkField "success" -checkValue $true
Test-Endpoint "GET /api/location/geocode (missing q)" GET "$API/api/location/geocode" -expectStatus 400
Test-Endpoint "POST /api/nearby-restaurants" POST "$API/api/nearby-restaurants" @{latitude=30.7333;longitude=76.7794;radius_km=10}
Test-Endpoint "GET /api/restaurants/live-nearby" GET "$API/api/restaurants/live-nearby?latitude=30.7333&longitude=76.7794&radius=5"

# --- SECTION 8: Authentication ---
Write-Host ""
Write-Host "--- SECTION 8: Authentication ---" -ForegroundColor Yellow
$timestamp = [int64](Get-Date -UFormat %s)
$testEmail = "testuser_$timestamp@cravespot.com"

Test-Endpoint "POST /api/register (valid)" POST "$API/api/register" @{name="Test User";email=$testEmail;password="TestPass123";phone="9876543210"} -expectStatus 201
Test-Endpoint "POST /api/register (duplicate email)" POST "$API/api/register" @{name="Test User 2";email=$testEmail;password="AnotherPass1"} -expectStatus 409
Test-Endpoint "POST /api/register (missing fields)" POST "$API/api/register" @{name="NoEmail"} -expectStatus 400
Test-Endpoint "POST /api/login (valid)" POST "$API/api/login" @{email=$testEmail;password="TestPass123"} -checkField "success" -checkValue $true
Test-Endpoint "POST /api/login (wrong password)" POST "$API/api/login" @{email=$testEmail;password="WrongPass999"} -expectStatus 401
Test-Endpoint "POST /api/login (invalid email)" POST "$API/api/login" @{email="notanemail";password="pass"} -expectStatus 400
Test-Endpoint "POST /api/login (missing fields)" POST "$API/api/login" @{} -expectStatus 400

# --- SECTION 9: Auth Token & Protected Endpoints ---
Write-Host ""
Write-Host "--- SECTION 9: Protected Endpoints ---" -ForegroundColor Yellow
try {
    $loginResp = Invoke-RestMethod -Uri "$API/api/login" -Method POST -Body (@{email=$testEmail;password="TestPass123"} | ConvertTo-Json) -ContentType "application/json"
    $token = $loginResp.token
    if ($token) {
        Write-Host "  [INFO] Token obtained: $($token.Substring(0,20))..." -ForegroundColor Cyan
        $headers = @{Authorization="Bearer $token"}
        Test-Endpoint "GET /api/auth/me (valid token)" GET "$API/api/auth/me" -checkField "success" -checkValue $true
        # Note: headers param not in Test-Endpoint but we test via direct call
        $meResp = Invoke-RestMethod -Uri "$API/api/auth/me" -Method GET -Headers $headers
        $meOk = $meResp.success -eq $true
        Write-Host "  [$(if($meOk){"PASS"}else{"FAIL"})] GET /api/auth/me with Bearer token  user=$($meResp.user.email)" -ForegroundColor (if($meOk){"Green"}else{"Red"})
        if ($meOk) { $pass++ } else { $fail++ }

        $profResp = Invoke-RestMethod -Uri "$API/api/user/profile" -Method GET -Headers $headers
        $profOk = $profResp.success -eq $true
        Write-Host "  [$(if($profOk){"PASS"}else{"FAIL"})] GET /api/user/profile  name=$($profResp.user.name)" -ForegroundColor (if($profOk){"Green"}else{"Red"})
        if ($profOk) { $pass++ } else { $fail++ }

        $prefResp = Invoke-RestMethod -Uri "$API/api/user/preferences" -Method GET -Headers $headers
        $prefOk = $prefResp.success -eq $true
        Write-Host "  [$(if($prefOk){"PASS"}else{"FAIL"})] GET /api/user/preferences  success=$($prefResp.success)" -ForegroundColor (if($prefOk){"Green"}else{"Red"})
        if ($prefOk) { $pass++ } else { $fail++ }
    } else {
        Write-Host "  [WARN] No token in login response - skipping token tests" -ForegroundColor Yellow
        $fail += 3
    }
} catch {
    Write-Host "  [FAIL] Token auth test block failed: $($_.Exception.Message)" -ForegroundColor Red
    $fail += 3
}

Test-Endpoint "GET /api/auth/me (no token)" GET "$API/api/auth/me" -expectStatus 401
Test-Endpoint "GET /api/user/profile (no token)" GET "$API/api/user/profile" -expectStatus 401

# --- SECTION 10: Security Headers ---
Write-Host ""
Write-Host "--- SECTION 10: Security Headers ---" -ForegroundColor Yellow
try {
    $resp = Invoke-WebRequest -Uri "$API/" -Method GET
    $headers_resp = $resp.Headers
    $checks = @{
        "X-Content-Type-Options" = "nosniff"
        "X-Frame-Options"        = "SAMEORIGIN"
        "X-XSS-Protection"       = "1; mode=block"
    }
    foreach ($h in $checks.GetEnumerator()) {
        $val = $headers_resp[$h.Key]
        $ok = $val -eq $h.Value
        $script:pass += [int]$ok; $script:fail += [int](!$ok)
        Write-Host "  [$(if($ok){"PASS"}else{"FAIL"})] Header $($h.Key): $val" -ForegroundColor (if($ok){"Green"}else{"Red"})
    }
} catch {
    Write-Host "  [FAIL] Security header test: $($_.Exception.Message)" -ForegroundColor Red
    $fail += 3
}

# --- SECTION 11: Input Validation / Edge Cases ---
Write-Host ""
Write-Host "--- SECTION 11: Edge Cases & Validation ---" -ForegroundColor Yellow
Test-Endpoint "POST review (rating=0 invalid)" POST "$API/api/restaurants/1/reviews" @{user_name="X";rating=0;comment="bad"} -expectStatus 400
Test-Endpoint "POST review (rating=6 invalid)" POST "$API/api/restaurants/1/reviews" @{user_name="X";rating=6;comment="bad"} -expectStatus 400
Test-Endpoint "GET unknown endpoint (404)" GET "$API/api/nonexistent" -expectStatus 404
Test-Endpoint "GET /api/restaurants?sort=rating" GET "$API/api/restaurants?sort=rating"
Test-Endpoint "GET /api/restaurants?sort=price" GET "$API/api/restaurants?sort=price"
Test-Endpoint "POST craving with budget hint" POST "$API/api/cravings/recommend" @{query="biryani under 150";latitude=30.73;longitude=76.78} -checkField "success" -checkValue $true

# --- SECTION 12: Frontend Pages ---
Write-Host ""
Write-Host "--- SECTION 12: Frontend Pages ---" -ForegroundColor Yellow
$pages = @(
    @{name="Homepage";         url="$FRONTEND/index.html"},
    @{name="Restaurants";      url="$FRONTEND/pages/restaurants.html"},
    @{name="Dishes";           url="$FRONTEND/pages/dishes.html"},
    @{name="Categories";       url="$FRONTEND/pages/categories.html"},
    @{name="Dish Details";     url="$FRONTEND/pages/dish-details.html"},
    @{name="Restaurant Detail";url="$FRONTEND/pages/restaurant-details.html"},
    @{name="Favorites";        url="$FRONTEND/pages/favorites.html"},
    @{name="Login";            url="$FRONTEND/pages/login.html"},
    @{name="Register";         url="$FRONTEND/pages/register.html"},
    @{name="About";            url="$FRONTEND/pages/about.html"},
    @{name="Contact";          url="$FRONTEND/pages/contact.html"},
    @{name="Privacy Policy";   url="$FRONTEND/pages/privacy.html"},
    @{name="Terms of Service"; url="$FRONTEND/pages/terms.html"},
    @{name="Profile";          url="$FRONTEND/pages/profile.html"},
    @{name="404 Page";         url="$FRONTEND/pages/404.html"}
)
foreach ($p in $pages) {
    Test-Page $p.name $p.url
}

# --- SECTION 13: Static Assets ---
Write-Host ""
Write-Host "--- SECTION 13: Static Assets ---" -ForegroundColor Yellow
Test-Page "CSS style.css"       "$FRONTEND/css/style.css"
Test-Page "JS api.js"           "$FRONTEND/js/api.js"
Test-Page "JS app.js"           "$FRONTEND/js/app.js"
Test-Page "JS restaurants.js"   "$FRONTEND/js/restaurants.js"
Test-Page "JS dishes.js"        "$FRONTEND/js/dishes.js"
Test-Page "JS favorites.js"     "$FRONTEND/js/favorites.js"
Test-Page "JS login.js"         "$FRONTEND/js/login.js"
Test-Page "JS register.js"      "$FRONTEND/js/register.js"

# ============================================================
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  FINAL RESULTS" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  PASSED : $pass" -ForegroundColor Green
Write-Host "  FAILED : $fail" -ForegroundColor (if($fail -eq 0){"Green"}else{"Red"})
Write-Host "  TOTAL  : $($pass + $fail)" -ForegroundColor White
Write-Host ""
if ($fail -gt 0) {
    Write-Host "  FAILURES:" -ForegroundColor Red
    $results | Where-Object { $_.Result -eq "FAIL" } | ForEach-Object {
        Write-Host "    - $($_.Test)  [$($_.Status)] $($_.Info)" -ForegroundColor Red
    }
}
Write-Host "============================================================" -ForegroundColor Cyan
