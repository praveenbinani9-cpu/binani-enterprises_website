"""
Backend API Tests for Binani Enterprises
Tests: Health check, Bookings CRUD, Contact, Stats endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthCheck:
    """Health check endpoint tests"""
    
    def test_api_root_returns_ok(self):
        """GET /api/ returns status OK"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "ok"
        assert "message" in data


class TestBookingsCreate:
    """POST /api/bookings tests"""
    
    def test_create_booking_success(self):
        """POST /api/bookings creates a booking with all fields"""
        payload = {
            "full_name": "TEST_John Doe",
            "phone": "+919876543210",
            "email": "test_john@example.com",
            "reason": "gateway-setup",
            "message": "Test booking message",
            "preferred_date": "2026-02-15",
            "preferred_time": "10:00 AM"
        }
        response = requests.post(f"{BASE_URL}/api/bookings", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        # Verify response contains id and created_at
        assert "id" in data, "Response should contain 'id'"
        assert "created_at" in data, "Response should contain 'created_at'"
        
        # Verify all fields are returned correctly
        assert data["full_name"] == payload["full_name"]
        assert data["phone"] == payload["phone"]
        assert data["email"] == payload["email"]
        assert data["reason"] == payload["reason"]
        assert data["message"] == payload["message"]
        assert data["preferred_date"] == payload["preferred_date"]
        assert data["preferred_time"] == payload["preferred_time"]
        
        # Verify _id is NOT exposed
        assert "_id" not in data, "MongoDB _id should not be exposed in response"
        
        # Store booking_id for later tests
        self.__class__.created_booking_id = data["id"]
    
    def test_create_booking_minimal_fields(self):
        """POST /api/bookings with only required fields"""
        payload = {
            "full_name": "TEST_Jane Smith",
            "phone": "9876543210",
            "email": "test_jane@example.com",
            "reason": "consultation"
        }
        response = requests.post(f"{BASE_URL}/api/bookings", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert data["full_name"] == payload["full_name"]
        assert "_id" not in data
    
    def test_create_booking_invalid_email_returns_422(self):
        """POST /api/bookings with invalid email returns 422"""
        payload = {
            "full_name": "TEST_Invalid Email",
            "phone": "9876543210",
            "email": "not-a-valid-email",
            "reason": "consultation"
        }
        response = requests.post(f"{BASE_URL}/api/bookings", json=payload)
        assert response.status_code == 422, f"Expected 422 for invalid email, got {response.status_code}"
    
    def test_create_booking_missing_full_name_returns_422(self):
        """POST /api/bookings missing full_name returns 422"""
        payload = {
            "phone": "9876543210",
            "email": "test@example.com",
            "reason": "consultation"
        }
        response = requests.post(f"{BASE_URL}/api/bookings", json=payload)
        assert response.status_code == 422, f"Expected 422 for missing full_name, got {response.status_code}"
    
    def test_create_booking_missing_phone_returns_422(self):
        """POST /api/bookings missing phone returns 422"""
        payload = {
            "full_name": "TEST_No Phone",
            "email": "test@example.com",
            "reason": "consultation"
        }
        response = requests.post(f"{BASE_URL}/api/bookings", json=payload)
        assert response.status_code == 422, f"Expected 422 for missing phone, got {response.status_code}"
    
    def test_create_booking_missing_email_returns_422(self):
        """POST /api/bookings missing email returns 422"""
        payload = {
            "full_name": "TEST_No Email",
            "phone": "9876543210",
            "reason": "consultation"
        }
        response = requests.post(f"{BASE_URL}/api/bookings", json=payload)
        assert response.status_code == 422, f"Expected 422 for missing email, got {response.status_code}"
    
    def test_create_booking_missing_reason_returns_422(self):
        """POST /api/bookings missing reason returns 422"""
        payload = {
            "full_name": "TEST_No Reason",
            "phone": "9876543210",
            "email": "test@example.com"
        }
        response = requests.post(f"{BASE_URL}/api/bookings", json=payload)
        assert response.status_code == 422, f"Expected 422 for missing reason, got {response.status_code}"


class TestBookingsList:
    """GET /api/bookings tests"""
    
    def test_list_bookings_returns_list(self):
        """GET /api/bookings returns list of bookings"""
        response = requests.get(f"{BASE_URL}/api/bookings")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        
        # Verify no _id in any booking
        for booking in data:
            assert "_id" not in booking, "MongoDB _id should not be exposed"
            assert "id" in booking
            assert "created_at" in booking
    
    def test_list_bookings_sorted_by_created_at_desc(self):
        """GET /api/bookings returns bookings sorted by created_at desc"""
        # Create two bookings to ensure we have data
        payload1 = {
            "full_name": "TEST_First Booking",
            "phone": "1111111111",
            "email": "first@example.com",
            "reason": "integration"
        }
        requests.post(f"{BASE_URL}/api/bookings", json=payload1)
        
        payload2 = {
            "full_name": "TEST_Second Booking",
            "phone": "2222222222",
            "email": "second@example.com",
            "reason": "other"
        }
        requests.post(f"{BASE_URL}/api/bookings", json=payload2)
        
        response = requests.get(f"{BASE_URL}/api/bookings")
        assert response.status_code == 200
        
        data = response.json()
        if len(data) >= 2:
            # Verify descending order (newest first)
            for i in range(len(data) - 1):
                assert data[i]["created_at"] >= data[i + 1]["created_at"], \
                    "Bookings should be sorted by created_at descending"


class TestBookingsGetById:
    """GET /api/bookings/{id} tests"""
    
    def test_get_booking_by_id_success(self):
        """GET /api/bookings/{id} returns specific booking"""
        # First create a booking
        payload = {
            "full_name": "TEST_Get By ID",
            "phone": "3333333333",
            "email": "getbyid@example.com",
            "reason": "gateway-setup"
        }
        create_response = requests.post(f"{BASE_URL}/api/bookings", json=payload)
        assert create_response.status_code == 200
        booking_id = create_response.json()["id"]
        
        # Now get it by ID
        response = requests.get(f"{BASE_URL}/api/bookings/{booking_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == booking_id
        assert data["full_name"] == payload["full_name"]
        assert data["email"] == payload["email"]
        assert "_id" not in data
    
    def test_get_booking_unknown_id_returns_404(self):
        """GET /api/bookings/{id} with unknown id returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.get(f"{BASE_URL}/api/bookings/{fake_id}")
        assert response.status_code == 404, f"Expected 404 for unknown id, got {response.status_code}"


class TestStats:
    """GET /api/stats tests"""
    
    def test_stats_returns_expected_fields(self):
        """GET /api/stats returns total_bookings, gateways_supported, success_rate"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        
        data = response.json()
        assert "total_bookings" in data, "Response should contain 'total_bookings'"
        assert "gateways_supported" in data, "Response should contain 'gateways_supported'"
        assert "success_rate" in data, "Response should contain 'success_rate'"
        
        # Verify types
        assert isinstance(data["total_bookings"], int)
        assert isinstance(data["gateways_supported"], int)
        assert isinstance(data["success_rate"], (int, float))


class TestContact:
    """POST /api/contact tests"""
    
    def test_create_contact_success(self):
        """POST /api/contact creates a contact message"""
        payload = {
            "name": "TEST_Contact Person",
            "email": "contact@example.com",
            "message": "This is a test contact message"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert "created_at" in data
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["message"] == payload["message"]
        assert "_id" not in data
    
    def test_create_contact_invalid_email_returns_422(self):
        """POST /api/contact with invalid email returns 422"""
        payload = {
            "name": "TEST_Invalid Contact",
            "email": "invalid-email",
            "message": "Test message"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 422


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
