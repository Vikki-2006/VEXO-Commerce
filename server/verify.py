import urllib.request, json, threading, time, warnings, random
warnings.filterwarnings('ignore')

import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.main import app
import uvicorn

server = uvicorn.Server(uvicorn.Config(app, host='127.0.0.1', port=5008, log_level='error'))
thread = threading.Thread(target=server.run)
thread.start()
time.sleep(1.5)

base = 'http://127.0.0.1:5008'
token = ''
passed = []

def get(path):
    headers = {}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(f'{base}{path}', headers=headers)
    return json.loads(urllib.request.urlopen(req).read())

def post(path, body):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(f'{base}{path}', method='POST', headers=headers, data=json.dumps(body).encode())
    return json.loads(urllib.request.urlopen(req).read())

# 1. Health
health = get('/api/v1/health')
assert health['status'] == 'healthy'
passed.append('[OK] /api/v1/health')

# 2. Telemetry
tel = get('/api/v1/telemetry')
assert tel['dbStatus'] == 'Connected'
passed.append(f'[OK] /api/v1/telemetry  DB={tel["dbStatus"]}')

# 3. Categories
cats = get('/api/v1/categories')
assert len(cats) == 5
passed.append(f'[OK] /api/v1/categories  count={len(cats)}')

# 4. Products list
prods = get('/api/v1/products')
count = len(prods['products'])
assert count == 5
passed.append(f'[OK] /api/v1/products  count={count}')

# 5. Product by slug
prod = get('/api/v1/products/vexo-soundstage-one')
assert 'Soundstage' in prod['title']
passed.append(f'[OK] /api/v1/products/slug  title={prod["title"][:30]}')

# 6. Register
test_email = f'testuser{random.randint(1000,9999)}@vexo.test'
reg = post('/api/v1/auth/register', {'name': 'Test User', 'email': test_email, 'password': 'test1234'})
assert reg.get('token')
passed.append(f'[OK] /api/v1/auth/register  email={test_email}')

# 7. Login admin
login = post('/api/v1/auth/login', {'email': 'admin@vexo.systems', 'password': 'admin123'})
token = login['token']
assert login['user']['role'] == 'ADMIN'
passed.append(f'[OK] /api/v1/auth/login  role={login["user"]["role"]}')

# 8. Profile
profile = get('/api/v1/auth/profile')
assert profile['email'] == 'admin@vexo.systems'
passed.append(f'[OK] /api/v1/auth/profile  user={profile["name"]}')

# 9. Coupon validate
coupon = post('/api/v1/coupons/validate', {'code': 'VEXO20', 'cartTotal': 50000})
assert coupon['valid'] == True
assert coupon['discountAmount'] == 10000.0
passed.append(f'[OK] /api/v1/coupons/validate  discount={coupon["discountAmount"]}')

# 10. Admin metrics
metrics = get('/api/v1/admin/metrics')
assert 'metrics' in metrics
passed.append(f'[OK] /api/v1/admin/metrics  revenue={metrics["metrics"]["totalRevenue"]}')

# 11. Swagger docs
docs = urllib.request.urlopen(f'{base}/docs')
assert docs.status == 200
passed.append('[OK] /docs  Swagger UI available')

server.should_exit = True

print()
for line in passed:
    print(line)
print()
print('=' * 50)
print(f'  ALL {len(passed)} ENDPOINT CHECKS PASSED')
print('=' * 50)
