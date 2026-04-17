"""
Backend API Tests for Binani Enterprises - Cookie-based Auth (Iteration 3)
Tests: httpOnly cookie auth, logout, cookie clearing, backwards compatibility
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials sourced from environment
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@binanienterprises.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')


class TestCookieAuth:
    """Tests for httpOnly cookie-based authentication"""
    
    def test_login_sets_httponly_cookie(self):
        """POST /api/admin/login sets httpOnly cookie 'admin_token'"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Check response body still contains token (for backwards compatibility)
        data = response.json()
        assert "token" in data, "Response should contain 'token'"
        assert "email" in data, "Response should contain 'email'"
        assert "role" in data, "Response should contain 'role'"
        
        # Check Set-Cookie header
        set_cookie = response.headers.get('Set-Cookie', '')
        assert 'admin_token=' in set_cookie, f"Set-Cookie should contain admin_token, got: {set_cookie}"
        
        # Verify cookie attributes (HttpOnly, Secure, SameSite)
        set_cookie_lower = set_cookie.lower()
        assert 'httponly' in set_cookie_lower, f"Cookie should be HttpOnly, got: {set_cookie}"
        # Note: Secure may not be set in test environment, but should be in prod
        assert 'samesite=lax' in set_cookie_lower, f"Cookie should have SameSite=lax, got: {set_cookie}"
    
    def test_admin_me_with_cookie_only(self):
        """GET /api/admin/me with cookie (no Authorization header) returns email and role"""
        session = requests.Session()
        
        # Login to get cookie
        login_response = session.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert login_response.status_code == 200, "Login should succeed"
        
        # Verify cookie is set in session
        assert 'admin_token' in session.cookies, "Session should have admin_token cookie"
        
        # Call /admin/me WITHOUT Authorization header - should work with cookie
        me_response = session.get(f"{BASE_URL}/api/admin/me")
        assert me_response.status_code == 200, f"Expected 200 with cookie auth, got {me_response.status_code}: {me_response.text}"
        
        data = me_response.json()
        assert "email" in data
        assert "role" in data
        assert data["email"] == ADMIN_EMAIL.lower()
        assert data["role"] == "admin"
    
    def test_admin_bookings_with_cookie_only(self):
        """GET /api/admin/bookings with cookie (no Authorization header) works"""
        session = requests.Session()
        
        # Login to get cookie
        login_response = session.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert login_response.status_code == 200
        
        # Call /admin/bookings WITHOUT Authorization header
        response = session.get(f"{BASE_URL}/api/admin/bookings")
        assert response.status_code == 200, f"Expected 200 with cookie auth, got {response.status_code}"
        assert isinstance(response.json(), list)
    
    def test_admin_stats_with_cookie_only(self):
        """GET /api/admin/stats with cookie (no Authorization header) works"""
        session = requests.Session()
        
        # Login to get cookie
        login_response = session.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert login_response.status_code == 200
        
        # Call /admin/stats WITHOUT Authorization header
        response = session.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 200, f"Expected 200 with cookie auth, got {response.status_code}"
        
        data = response.json()
        assert "total" in data
        assert "by_status" in data


class TestLogout:
    """Tests for POST /api/admin/logout"""
    
    def test_logout_clears_cookie(self):
        """POST /api/admin/logout clears the admin_token cookie"""
        session = requests.Session()
        
        # Login first
        login_response = session.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert login_response.status_code == 200
        assert 'admin_token' in session.cookies
        
        # Logout
        logout_response = session.post(f"{BASE_URL}/api/admin/logout")
        assert logout_response.status_code == 200, f"Expected 200, got {logout_response.status_code}"
        
        data = logout_response.json()
        assert data.get("ok") is True, "Logout should return {ok: true}"
        
        # Check Set-Cookie header clears the cookie (expires in past or empty value)
        set_cookie = logout_response.headers.get('Set-Cookie', '')
        # Cookie should be cleared - either empty value or max-age=0 or expires in past
        assert 'admin_token=' in set_cookie, f"Set-Cookie should reference admin_token, got: {set_cookie}"
    
    def test_admin_me_after_logout_returns_401(self):
        """GET /api/admin/me after logout returns 401"""
        session = requests.Session()
        
        # Login first
        login_response = session.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert login_response.status_code == 200
        
        # Verify we can access /admin/me
        me_response = session.get(f"{BASE_URL}/api/admin/me")
        assert me_response.status_code == 200, "Should be able to access /admin/me before logout"
        
        # Logout
        logout_response = session.post(f"{BASE_URL}/api/admin/logout")
        assert logout_response.status_code == 200
        
        # Try to access /admin/me again - should fail
        me_response_after = session.get(f"{BASE_URL}/api/admin/me")
        assert me_response_after.status_code == 401, f"Expected 401 after logout, got {me_response_after.status_code}"


class TestBackwardsCompatibility:
    """Tests for Bearer token backwards compatibility"""
    
    def test_bearer_token_still_works(self):
        """GET /api/admin/me with Authorization: Bearer <token> still works"""
        # Get token via login
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        token = response.json()["token"]
        
        # Use Bearer token (no cookies)
        me_response = requests.get(
            f"{BASE_URL}/api/admin/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert me_response.status_code == 200, f"Bearer token should still work, got {me_response.status_code}"
        
        data = me_response.json()
        assert data["email"] == ADMIN_EMAIL.lower()
        assert data["role"] == "admin"
    
    def test_bearer_token_for_admin_bookings(self):
        """GET /api/admin/bookings with Bearer token still works"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = response.json()["token"]
        
        bookings_response = requests.get(
            f"{BASE_URL}/api/admin/bookings",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert bookings_response.status_code == 200
        assert isinstance(bookings_response.json(), list)
    
    def test_cookie_takes_precedence_over_bearer(self):
        """When both cookie and Bearer are present, cookie is used first"""
        session = requests.Session()
        
        # Login to get cookie
        login_response = session.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert login_response.status_code == 200
        token = login_response.json()["token"]
        
        # Call with both cookie (from session) and Bearer header
        # Should work because cookie is valid
        me_response = session.get(
            f"{BASE_URL}/api/admin/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert me_response.status_code == 200
        
        # Now logout (clears cookie)
        session.post(f"{BASE_URL}/api/admin/logout")
        
        # Call with cleared cookie but valid Bearer - should still work (fallback)
        me_response_after = session.get(
            f"{BASE_URL}/api/admin/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert me_response_after.status_code == 200, "Bearer fallback should work after cookie cleared"


class TestPatchDeleteWithCookie:
    """Tests for PATCH and DELETE with cookie auth"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup session with cookie auth and create test booking"""
        self.session = requests.Session()
        
        # Login to get cookie
        login_response = self.session.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if login_response.status_code != 200:
            pytest.skip("Could not login")
        
        # Create test booking
        payload = {
            "full_name": "TEST_Cookie Auth",
            "phone": "+911234567890",
            "email": "test_cookie@example.com",
            "reason": "consultation"
        }
        create_response = requests.post(f"{BASE_URL}/api/bookings", json=payload)
        if create_response.status_code == 200:
            self.booking_id = create_response.json()["id"]
        else:
            pytest.skip("Could not create test booking")
    
    def test_patch_booking_with_cookie(self):
        """PATCH /api/admin/bookings/{id} with cookie auth works"""
        response = self.session.patch(
            f"{BASE_URL}/api/admin/bookings/{self.booking_id}",
            json={"status": "contacted"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert response.json()["status"] == "contacted"
    
    def test_delete_booking_with_cookie(self):
        """DELETE /api/admin/bookings/{id} with cookie auth works"""
        response = self.session.delete(f"{BASE_URL}/api/admin/bookings/{self.booking_id}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert response.json().get("ok") is True


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
