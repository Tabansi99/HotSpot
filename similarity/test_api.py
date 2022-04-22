from fastapi.testclient import TestClient

from api import app

client = TestClient(app)

def test_recommendations():
    response = client.put(
        '/api/recs/',
        json={
            'targets': ['CSCE 431'],
            'tags': ['Artificial Intelligence'],
            'pos': ['CSCE 445'],
            'neg': ['CSCE 443'],
            'done': ['CSCE 121', 'CSCE 222', 'CSCE 313']
        }
    )
    print(response.json()['all'])
