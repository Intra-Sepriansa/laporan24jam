# 🔌 Alfamart Shift 3 Report API

RESTful API untuk Sistem Laporan Shift 3 Alfamart. API ini memungkinkan integrasi dengan aplikasi mobile, sistem eksternal, atau automation tools.

## 📚 Documentation

- **Full API Documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Postman Collection**: [Alfamart_API.postman_collection.json](Alfamart_API.postman_collection.json)

## 🚀 Quick Start

### 1. Base URL
```
Development: http://localhost:8000/api
Production: https://api.alfamart.com/api
```

### 2. Authentication

API menggunakan **Laravel Sanctum** (Bearer Token Authentication).

#### Login untuk mendapatkan token:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "14085061",
    "password": "TB56#061"
  }'
```

#### Response:
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "1|abc123def456...",
    "user": { ... }
  }
}
```

#### Gunakan token pada request berikutnya:
```bash
curl -X GET http://localhost:8000/api/dashboard/statistics \
  -H "Authorization: Bearer 1|abc123def456..."
```

## 📋 Available Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login dengan NIK dan password | ❌ |
| POST | `/api/auth/logout` | Logout dan hapus token | ✅ |
| GET | `/api/employee/by-nik` | Get employee data by NIK | ❌ |
| GET | `/api/auth/user` | Get authenticated user | ✅ |

### Dashboard
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/statistics` | Get dashboard statistics | ✅ |
| GET | `/api/dashboard/sales-trend` | Get sales trend (7 days) | ✅ |
| GET | `/api/dashboard/recent-reports` | Get recent reports (5 latest) | ✅ |

### Reports
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reports` | Get all reports (paginated) | ✅ |
| GET | `/api/reports/{id}` | Get report by ID | ✅ |
| POST | `/api/reports` | Create new report | ✅ |
| PUT | `/api/reports/{id}` | Update report | ✅ |
| DELETE | `/api/reports/{id}` | Delete report | ✅ |

## 🧪 Testing

### Using Postman

1. **Import Collection**
   - Open Postman
   - Click "Import"
   - Select `Alfamart_API.postman_collection.json`

2. **Setup Environment**
   - Create new environment
   - Add variable: `base_url` = `http://localhost:8000/api`
   - Add variable: `token` = (will be auto-filled after login)

3. **Test Flow**
   - Run "Login" request
   - Token will be automatically saved
   - Run other requests with saved token

### Using cURL

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nik":"14085061","password":"TB56#061"}' \
  | jq -r '.data.token')

# 2. Get Dashboard Statistics
curl -X GET http://localhost:8000/api/dashboard/statistics \
  -H "Authorization: Bearer $TOKEN"

# 3. Get All Reports
curl -X GET "http://localhost:8000/api/reports?page=1&per_page=10" \
  -H "Authorization: Bearer $TOKEN"

# 4. Create Report
curl -X POST http://localhost:8000/api/reports \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "month_year": "FEBRUARY 2026",
    "shift": 3,
    "report_date": "2026-02-06",
    "details": [
      {
        "day_number": 1,
        "transaction_date": "2026-02-01",
        "spd": 6360500,
        "std": 107,
        "pulsa": 0
      }
    ]
  }'
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## 🔒 Security

### Rate Limiting
- **60 requests per minute** per user
- Exceeded limit returns `429 Too Many Requests`

### Authorization
- Users can only access data from their own store
- Unauthorized access returns `403 Forbidden`

### Token Management
- Tokens don't expire automatically
- Use logout endpoint to revoke token
- Store tokens securely (never in client-side code)

## 📝 Example Use Cases

### 1. Mobile App Integration
```javascript
// React Native / Flutter
const login = async (nik, password) => {
  const response = await fetch('http://api.alfamart.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nik, password })
  });
  const data = await response.json();
  // Save token to secure storage
  await SecureStore.setItemAsync('token', data.data.token);
};
```

### 2. Automated Reporting
```python
# Python script for automated reporting
import requests

# Login
response = requests.post('http://api.alfamart.com/api/auth/login', json={
    'nik': '14085061',
    'password': 'TB56#061'
})
token = response.json()['data']['token']

# Create report
headers = {'Authorization': f'Bearer {token}'}
report_data = {
    'month_year': 'FEBRUARY 2026',
    'shift': 3,
    'report_date': '2026-02-06',
    'details': [...]
}
requests.post('http://api.alfamart.com/api/reports', 
              json=report_data, headers=headers)
```

### 3. Dashboard Widget
```javascript
// JavaScript for external dashboard
const getDashboardStats = async (token) => {
  const response = await fetch('http://api.alfamart.com/api/dashboard/statistics', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

## 🛠️ Development

### Enable API Routes
API routes are automatically loaded from `routes/api.php`.

### Add New Endpoint
1. Create controller in `app/Http/Controllers/Api/`
2. Add route in `routes/api.php`
3. Add Swagger annotations (optional)
4. Update documentation

### Testing API Locally
```bash
# Start Laravel server
php artisan serve

# Test endpoint
curl http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nik":"14085061","password":"TB56#061"}'
```

## 📞 Support

- **Documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Issues**: Create issue on GitHub
- **Email**: support@alfamart.com

## 📄 License

Proprietary - © 2026 Alfamart

---

**API Version**: 1.0.0  
**Last Updated**: February 6, 2026  
**Status**: ✅ Production Ready
