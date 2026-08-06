from django.contrib.auth import get_user_model
from django.test import TestCase


User = get_user_model()


class UserModelTests(TestCase):
    def test_new_user_defaults_to_employee_role(self):
        user = User.objects.create_user(
            username="alex",
            email="alex@example.com",
            password="a-secure-test-password",
        )

        self.assertEqual(user.role, User.Role.EMPLOYEE)
        self.assertTrue(user.check_password("a-secure-test-password"))

    def test_user_can_be_created_with_hr_role(self):
        user = User.objects.create_user(
            username="priya",
            email="priya@example.com",
            password="another-secure-test-password",
            role=User.Role.HR,
        )

        self.assertEqual(user.role, User.Role.HR)
        self.assertEqual(str(user), "priya (HR)")
