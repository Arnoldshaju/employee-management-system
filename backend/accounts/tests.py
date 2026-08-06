from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class UserModelTests(APITestCase):
    def test_new_user_defaults_to_employee_role(self):
        user = User.objects.create_user(
            username='alex',
            email='alex@example.com',
            password='a-secure-test-password',
        )

        self.assertEqual(user.role, User.Role.EMPLOYEE)
        self.assertTrue(user.check_password('a-secure-test-password'))

    def test_user_can_be_created_with_hr_role(self):
        user = User.objects.create_user(
            username='priya',
            email='priya@example.com',
            password='another-secure-test-password',
            role=User.Role.HR,
        )

        self.assertEqual(user.role, User.Role.HR)
        self.assertEqual(str(user), 'priya (HR)')


class AuthenticationApiTests(APITestCase):
    password = 'a-strong-test-password'

    def setUp(self):
        self.user = User.objects.create_user(
            username='existing-user',
            email='existing@example.com',
            password=self.password,
            role=User.Role.HR,
        )

    def login(self):
        return self.client.post(
            '/api/auth/login/',
            {'email': self.user.email, 'password': self.password},
            format='json',
        )

    def test_register_creates_employee_and_returns_tokens(self):
        response = self.client.post(
            '/api/auth/register/',
            {
                'username': 'new-user',
                'email': 'NEW@example.com',
                'password': self.password,
                'first_name': 'New',
                'last_name': 'Employee',
                'role': User.Role.ADMIN,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['role'], User.Role.EMPLOYEE)
        self.assertEqual(User.objects.get(username='new-user').email, 'new@example.com')

    def test_login_accepts_email_and_returns_user_role(self):
        response = self.login()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['user']['role'], User.Role.HR)

    def test_login_rejects_invalid_password(self):
        response = self.client.post(
            '/api/auth/login/',
            {'email': self.user.email, 'password': 'incorrect-password'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_requires_authentication(self):
        response = self.client.get('/api/auth/me/')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_authenticated_user(self):
        login_response = self.login()
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}"
        )

        response = self.client.get('/api/auth/me/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)

    def test_refresh_returns_new_access_token(self):
        login_response = self.login()

        response = self.client.post(
            '/api/auth/refresh/',
            {'refresh': login_response.data['refresh']},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_logout_blacklists_refresh_token(self):
        login_response = self.login()
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}"
        )

        logout_response = self.client.post(
            '/api/auth/logout/',
            {'refresh': login_response.data['refresh']},
            format='json',
        )
        refresh_response = self.client.post(
            '/api/auth/refresh/',
            {'refresh': login_response.data['refresh']},
            format='json',
        )

        self.assertEqual(logout_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)
