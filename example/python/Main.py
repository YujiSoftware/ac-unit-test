import sys
import os
from io import StringIO
import unittest

def resolve():
    N = int(input())
    ans = ""
    for _ in range(N):
        ans += "10"
    print(ans + "1")

class TestClass(unittest.TestCase):
    def test_sample1(self):
        input = """4"""
        expected = """101010101"""
        self.judge(input, expected)

    def test_sample2(self):
        input = """1"""
        expected = """101"""
        self.judge(input, expected)

    def test_sample3(self):
        input = """10"""
        expected = """101010101010101010101"""
        self.judge(input, expected)

    def judge(self, input, expected):
        stdout, stdin = sys.stdout, sys.stdin
        sys.stdout, sys.stdin = StringIO(), StringIO(input)
        resolve()
        sys.stdout.seek(0)
        actual = sys.stdout.read()[:-1]
        sys.stdout, sys.stdin = stdout, stdin
        self.assertEqual(expected, actual)

if __name__ == "__main__":
    if "ATCODER" in os.environ:
        resolve()
    else:
        unittest.main(verbosity=2)
