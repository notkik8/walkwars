def test_registration(client):
    response = client.post("/auth/register", json={
        "username": "string",
        "email": "user@example.com",
        "password": "string"})
    assert response.status_code == 200


def test_login(client):
    response = client.post("/auth/login", data={
        "username": "psina",
        "email": "kot@pes.com",
        "password": "123"})
    assert response.status_code == 200

