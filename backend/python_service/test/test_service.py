# SPDX-License-Identifier: MIT
# SPDX-FileCopyrightText: 2021 Felix Steinkohl <steinkohl@campus.tu-berlin.de>

import unittest
from backend.python_service.service import hello_world


class MainTest(unittest.TestCase):
    def test_hello_world(self):
        self.assertEqual(hello_world(), "hello world")


if __name__ == "__main__":
    unittest.main()
