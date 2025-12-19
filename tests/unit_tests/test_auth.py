from datetime import datetime
from backend.app.core.security import create_access_token
from backend.app.core.config import settings
from jose import JWTError, jwt



def test_create_access_token():
    data = {"user_id": 1}
    jwt_token = create_access_token(data)

    assert jwt_token
    assert isinstance(jwt_token, str)


def test_create_access_token_payload_valid():
    data = {"sub": "user_1"}
    token = create_access_token(data)

    payload = jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM],
    )

    assert payload["sub"] == "user_1"
    assert "exp" in payload
    assert datetime.fromtimestamp(payload["exp"]) > datetime.utcnow()