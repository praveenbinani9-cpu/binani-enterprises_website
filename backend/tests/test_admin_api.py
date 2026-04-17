"""
Backend API Tests for Binani Enterprises - Admin Auth & Management
Tests: Admin login, token validation, protected bookings CRUD, admin stats
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials sourced from environment; falls back to a test-safe default
# only when running locally. Never commit real credentials.
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@binanienterprises.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')


class TestAdminLogin:
    """POST /api/admin/login tests"""
    
    def test_admin_login_success(self):
        """POST /api/admin/login with correct credentials returns 200 + token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "token" in data, "Response should contain 'token'"
        assert "email" in data, "Response should contain 'email'"
        assert "role" in data, "Response should contain 'role'"
        
        # Verify values
        assert data["email"] == ADMIN_EMAIL.lower()
        assert data["role"] == "admin"
        assert isinstance(data["token"], str)
        assert len(data["token"]) > 0
        
        # Store token for other tests
        TestAdminLogin.admin_token = data["token"]
    
    def test_admin_login_wrong_password_returns_401(self):
        """POST /api/admin/login with wrong password returns 401"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": "wrongpassword123"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        
        data = response.json()
        assert "detail" in data
        assert "Invalid email or password" in data["detail"]
    
    def test_admin_login_wrong_email_returns_401(self):
        """POST /api/admin/login with wrong email returns 401"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": "wrong@example.com",
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        
        data = response.json()
        assert "detail" in data
        assert "Invalid email or password" in data["detail"]
    
    def test_admin_login_case_insensitive_email(self):
        """POST /api/admin/login email is case-insensitive"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": "ADMIN@BINANIENTERPRISES.COM",
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Expected 200 for case-insensitive email, got {response.status_code}"


class TestAdminMe:
    """GET /api/admin/me tests"""
    
    @pytest.fixture(autouse=True)
    def get_token(self):
        """Get admin token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            self.token = response.json()["token"]
        else:
            pytest.skip("Could not get admin token")
    
    def test_admin_me_with_valid_token(self):
        """GET /api/admin/me with valid Bearer token returns email and role"""
        response = requests.get(
            f"{BASE_URL}/api/admin/me",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "email" in data
        assert "role" in data
        assert data["email"] == ADMIN_EMAIL.lower()
        assert data["role"] == "admin"
    
    def test_admin_me_without_token_returns_401(self):
        """GET /api/admin/me without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    
    def test_admin_me_with_malformed_token_returns_401(self):
        """GET /api/admin/me with malformed token returns 401"""
        response = requests.get(
            f"{BASE_URL}/api/admin/me",
            headers={"Authorization": "Bearer invalid.token.here"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    
    def test_admin_me_with_no_bearer_prefix_returns_401(self):
        """GET /api/admin/me with token but no Bearer prefix returns 401"""
        response = requests.get(
            f"{BASE_URL}/api/admin/me",
            headers={"Authorization": self.token}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"


class TestAdminBookings:
    """GET /api/admin/bookings tests"""
    
    @pytest.fixture(autouse=True)
    def get_token(self):
        """Get admin token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            self.token = response.json()["token"]
        else:
            pytest.skip("Could not get admin token")
    
    def test_admin_list_bookings_with_valid_token(self):
        """GET /api/admin/bookings with valid token returns array of bookings"""
        response = requests.get(
            f"{BASE_URL}/api/admin/bookings",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        
        # Verify no _id in any booking
        for booking in data:
            assert "_id" not in booking, "MongoDB _id should not be exposed"
            assert "id" in booking
    
    def test_admin_list_bookings_without_token_returns_401(self):
        """GET /api/admin/bookings without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/bookings")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"


class TestAdminUpdateBookingStatus:
    """PATCH /api/admin/bookings/{id} tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get admin token and create a test booking"""
        # Get token
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            self.token = response.json()["token"]
        else:
            pytest.skip("Could not get admin token")
        
        # Create a test booking
        payload = {
            "full_name": "TEST_Admin Update",
            "phone": "+919999999999",
            "email": "test_admin_update@example.com",
            "reason": "consultation",
            "message": "Test booking for admin update"
        }
        create_response = requests.post(f"{BASE_URL}/api/bookings", json=payload)
        if create_response.status_code == 200:
            self.booking_id = create_response.json()["id"]
        else:
            pytest.skip("Could not create test booking")
    
    def test_update_status_to_contacted(self):
        """PATCH /api/admin/bookings/{id} with status 'contacted' succeeds"""
        response = requests.patch(
            f"{BASE_URL}/api/admin/bookings/{self.booking_id}",
            json={"status": "contacted"},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["status"] == "contacted"
        assert data["id"] == self.booking_id
        assert "_id" not in data
    
    def test_update_status_to_scheduled(self):
        """PATCH /api/admin/bookings/{id} with status 'scheduled' succeeds"""
        response = requests.patch(
            f"{BASE_URL}/api/admin/bookings/{self.booking_id}",
            json={"status": "scheduled"},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200
        assert response.json()["status"] == "scheduled"
    
    def test_update_status_to_converted(self):
        """PATCH /api/admin/bookings/{id} with status 'converted' succeeds"""
        response = requests.patch(
            f"{BASE_URL}/api/admin/bookings/{self.booking_id}",
            json={"status": "converted"},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200
        assert response.json()["status"] == "converted"
    
    def test_update_status_to_closed(self):
        """PATCH /api/admin/bookings/{id} with status 'closed' succeeds"""
        response = requests.patch(
            f"{BASE_URL}/api/admin/bookings/{self.booking_id}",
            json={"status": "closed"},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200
        assert response.json()["status"] == "closed"
    
    def test_update_status_invalid_returns_400(self):
        """PATCH /api/admin/bookings/{id} with invalid status returns 400"""
        response = requests.patch(
            f"{BASE_URL}/api/admin/bookings/{self.booking_id}",
            json={"status": "invalid_status"},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    
    def test_update_status_unknown_id_returns_404(self):
        """PATCH /api/admin/bookings/{unknown_id} returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.patch(
            f"{BASE_URL}/api/admin/bookings/{fake_id}",
            json={"status": "contacted"},
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    
    def test_update_status_without_token_returns_401(self):
        """PATCH /api/admin/bookings/{id} without token returns 401"""
        response = requests.patch(
            f"{BASE_URL}/api/admin/bookings/{self.booking_id}",
            json={"status": "contacted"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"


class TestAdminDeleteBooking:
    """DELETE /api/admin/bookings/{id} tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get admin token and create a test booking for deletion"""
        # Get token
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            self.token = response.json()["token"]
        else:
            pytest.skip("Could not get admin token")
        
        # Create a test booking for deletion
        payload = {
            "full_name": "TEST_Admin Delete",
            "phone": "+918888888888",
            "email": "test_admin_delete@example.com",
            "reason": "other",
            "message": "Test booking for admin delete"
        }
        create_response = requests.post(f"{BASE_URL}/api/bookings", json=payload)
        if create_response.status_code == 200:
            self.booking_id = create_response.json()["id"]
        else:
            pytest.skip("Could not create test booking")
    
    def test_delete_booking_success(self):
        """DELETE /api/admin/bookings/{id} with valid token returns {ok:true}"""
        response = requests.delete(
            f"{BASE_URL}/api/admin/bookings/{self.booking_id}",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("ok"), "Response should contain truthy ok"
        
        # Verify booking is actually deleted - GET should return 404
        get_response = requests.get(f"{BASE_URL}/api/bookings/{self.booking_id}")
        assert get_response.status_code == 404, "Deleted booking should return 404"
    
    def test_delete_booking_without_token_returns_401(self):
        """DELETE /api/admin/bookings/{id} without token returns 401"""
        response = requests.delete(f"{BASE_URL}/api/admin/bookings/{self.booking_id}")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    
    def test_delete_booking_unknown_id_returns_404(self):
        """DELETE /api/admin/bookings/{unknown_id} returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.delete(
            f"{BASE_URL}/api/admin/bookings/{fake_id}",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"


class TestAdminStats:
    """GET /api/admin/stats tests"""
    
    @pytest.fixture(autouse=True)
    def get_token(self):
        """Get admin token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            self.token = response.json()["token"]
        else:
            pytest.skip("Could not get admin token")
    
    def test_admin_stats_returns_total_and_by_status(self):
        """GET /api/admin/stats returns { total, by_status }"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "total" in data, "Response should contain 'total'"
        assert "by_status" in data, "Response should contain 'by_status'"
        
        assert isinstance(data["total"], int)
        assert isinstance(data["by_status"], dict)
    
    def test_admin_stats_without_token_returns_401(self):
        """GET /api/admin/stats without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"


class TestPublicEndpointsStillWork:
    """Verify public endpoints from iteration 1 still work"""
    
    def test_public_bookings_list_still_works(self):
        """GET /api/bookings (public) still returns list"""
        response = requests.get(f"{BASE_URL}/api/bookings")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_public_bookings_create_still_works(self):
        """POST /api/bookings (public) still creates booking"""
        payload = {
            "full_name": "TEST_Public Create",
            "phone": "+917777777777",
            "email": "test_public@example.com",
            "reason": "gateway-setup"
        }
        response = requests.post(f"{BASE_URL}/api/bookings", json=payload)
        assert response.status_code == 200
        assert "id" in response.json()
    
    def test_public_stats_still_works(self):
        """GET /api/stats (public) still returns stats"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total_bookings" in data
        assert "gateways_supported" in data
    
    def test_public_contact_still_works(self):
        """POST /api/contact (public) still creates contact"""
        payload = {
            "name": "TEST_Public Contact",
            "email": "test_contact@example.com",
            "message": "Test contact message"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200
        assert "id" in response.json()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
