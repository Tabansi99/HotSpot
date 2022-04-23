from fastapi.testclient import TestClient

from api import app

client = TestClient(app)

def test_recommendations():
    response = client.put(
        '/api/recs/',
        json={
            'targets': ['CSCE 431'],
            'tags': ['Web Development', 'Artificial Intelligence', 'Database'],
            'pos': [],
            'neg': [],
            'done': ['CSCE 121', 'CSCE 221', 'CSCE 222', 'CSCE 313']
        }
    )
    print(response.json()['all'])

def test_notification():
    response = client.post(
        '/api/signup/',
        json={
            'course': 'CSCE 121',
            'email': 'jasondraether@gmail.com'
        }
    )
