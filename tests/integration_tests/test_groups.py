def test_get_all_groups(authenticated_client):
    response = authenticated_client.get("/groups/")

    assert response.status_code == 200

    data = response.json()          # разбираем JSON
    assert isinstance(data, list)   # ожидаем список групп
    assert len(data) > 0            # хотя бы одна группа есть

    first = data[0]
    assert "id" in first
    assert "name" in first
    assert "group_type" in first


def test_add_group(authenticated_client):
    response = authenticated_client.post("/groups/", json={
        "name": "dogs",
        "group_type": "tabun"})
    assert response.status_code == 200


def test_join_group(authenticated_client):
    response = authenticated_client.post("/groups/1/join")
    assert response.status_code == 200

def test_leave_group(authenticated_client):
    response = authenticated_client.post("/groups/1/leave")
    assert response.status_code == 200
