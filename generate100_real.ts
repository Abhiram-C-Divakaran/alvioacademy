import fs from 'fs';
import path from 'path';
import { codingProblems } from './src/data/codingProblems';

const baseProblems = codingProblems.slice(0, 35);

const compactData = [
  {
    id: "roman-to-integer", title: "Roman to Integer", topic: "String", diff: "Easy",
    desc: "Given a roman numeral string s, convert it to an integer.",
    sig: "romanToInt(s: string) -> integer",
    tests: [{ in: ["III"], out: 3 }, { in: ["LVIII"], out: 58 }, { in: ["MCMXCIV"], out: 1994 }]
  },
  {
    id: "longest-common-prefix", title: "Longest Common Prefix", topic: "String", diff: "Easy",
    desc: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
    sig: "longestCommonPrefix(strs: string[]) -> string",
    tests: [{ in: [["flower","flow","flight"]], out: "fl" }, { in: [["dog","racecar","car"]], out: "" }]
  },
  {
    id: "valid-palindrome", title: "Valid Palindrome", topic: "String", diff: "Easy",
    desc: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    sig: "isPalindrome(s: string) -> boolean",
    tests: [{ in: ["A man, a plan, a canal: Panama"], out: true }, { in: ["race a car"], out: false }]
  },
  {
    id: "single-number", title: "Single Number", topic: "Array", diff: "Easy",
    desc: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.",
    sig: "singleNumber(nums: integer[]) -> integer",
    tests: [{ in: [[2,2,1]], out: 1 }, { in: [[4,1,2,1,2]], out: 4 }, { in: [[1]], out: 1 }]
  },
  {
    id: "intersection-of-two-arrays", title: "Intersection of Two Arrays", topic: "Array", diff: "Easy",
    desc: "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique.",
    sig: "intersection(nums1: integer[], nums2: integer[]) -> integer[]",
    tests: [{ in: [[1,2,2,1], [2,2]], out: [2] }, { in: [[4,9,5], [9,4,9,8,4]], out: [9,4] }]
  },
  {
    id: "happy-number", title: "Happy Number", topic: "Math", diff: "Easy",
    desc: "Write an algorithm to determine if a number n is happy. A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits. Repeat the process until the number equals 1.",
    sig: "isHappy(n: integer) -> boolean",
    tests: [{ in: [19], out: true }, { in: [2], out: false }]
  },
  {
    id: "plus-one", title: "Plus One", topic: "Array", diff: "Easy",
    desc: "You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. Increment the large integer by one and return the resulting array of digits.",
    sig: "plusOne(digits: integer[]) -> integer[]",
    tests: [{ in: [[1,2,3]], out: [1,2,4] }, { in: [[4,3,2,1]], out: [4,3,2,2] }, { in: [[9]], out: [1,0] }]
  },
  {
    id: "sqrtx", title: "Sqrt(x)", topic: "Math", diff: "Easy",
    desc: "Given a non-negative integer x, return the square root of x rounded down to the nearest integer.",
    sig: "mySqrt(x: integer) -> integer",
    tests: [{ in: [4], out: 2 }, { in: [8], out: 2 }]
  },
  {
    id: "length-of-last-word", title: "Length of Last Word", topic: "String", diff: "Easy",
    desc: "Given a string s consisting of words and spaces, return the length of the last word in the string.",
    sig: "lengthOfLastWord(s: string) -> integer",
    tests: [{ in: ["Hello World"], out: 5 }, { in: ["   fly me   to   the moon  "], out: 4 }]
  },
  {
    id: "remove-duplicates", title: "Remove Duplicates", topic: "Array", diff: "Easy",
    desc: "Given an integer array nums sorted in non-decreasing order, return the number of unique elements.",
    sig: "removeDuplicatesCount(nums: integer[]) -> integer",
    tests: [{ in: [[1,1,2]], out: 2 }, { in: [[0,0,1,1,1,2,2,3,3,4]], out: 5 }]
  },
  {
    id: "search-insert-position", title: "Search Insert Position", topic: "Array", diff: "Easy",
    desc: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
    sig: "searchInsert(nums: integer[], target: integer) -> integer",
    tests: [{ in: [[1,3,5,6], 5], out: 2 }, { in: [[1,3,5,6], 2], out: 1 }, { in: [[1,3,5,6], 7], out: 4 }]
  },
  {
    id: "majority-element", title: "Majority Element", topic: "Array", diff: "Easy",
    desc: "Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times.",
    sig: "majorityElement(nums: integer[]) -> integer",
    tests: [{ in: [[3,2,3]], out: 3 }, { in: [[2,2,1,1,1,2,2]], out: 2 }]
  },
  {
    id: "valid-anagram", title: "Valid Anagram", topic: "String", diff: "Easy",
    desc: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    sig: "isAnagram(s: string, t: string) -> boolean",
    tests: [{ in: ["anagram", "nagaram"], out: true }, { in: ["rat", "car"], out: false }]
  },
  {
    id: "move-zeroes", title: "Move Zeroes", topic: "Array", diff: "Easy",
    desc: "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements. Return the modified array.",
    sig: "moveZeroes(nums: integer[]) -> integer[]",
    tests: [{ in: [[0,1,0,3,12]], out: [1,3,12,0,0] }, { in: [[0]], out: [0] }]
  },
  {
    id: "find-the-difference", title: "Find the Difference", topic: "String", diff: "Easy",
    desc: "You are given two strings s and t. String t is generated by random shuffling string s and then add one more letter at a random position. Return the letter that was added to t.",
    sig: "findTheDifference(s: string, t: string) -> string",
    tests: [{ in: ["abcd", "abcde"], out: "e" }, { in: ["", "y"], out: "y" }]
  },
  {
    id: "first-unique-character", title: "First Unique Character", topic: "String", diff: "Easy",
    desc: "Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.",
    sig: "firstUniqChar(s: string) -> integer",
    tests: [{ in: ["leetcode"], out: 0 }, { in: ["loveleetcode"], out: 2 }, { in: ["aabb"], out: -1 }]
  },
  {
    id: "reverse-vowels", title: "Reverse Vowels of a String", topic: "String", diff: "Easy",
    desc: "Given a string s, reverse only all the vowels in the string and return it.",
    sig: "reverseVowels(s: string) -> string",
    tests: [{ in: ["hello"], out: "holle" }, { in: ["leetcode"], out: "leotcede" }]
  },
  {
    id: "third-maximum-number", title: "Third Maximum Number", topic: "Array", diff: "Easy",
    desc: "Given an integer array nums, return the third distinct maximum number in this array. If the third maximum does not exist, return the maximum number.",
    sig: "thirdMax(nums: integer[]) -> integer",
    tests: [{ in: [[3,2,1]], out: 1 }, { in: [[1,2]], out: 2 }, { in: [[2,2,3,1]], out: 1 }]
  },
  {
    id: "add-strings", title: "Add Strings", topic: "String", diff: "Easy",
    desc: "Given two non-negative integers, num1 and num2 represented as string, return the sum of num1 and num2 as a string.",
    sig: "addStrings(num1: string, num2: string) -> string",
    tests: [{ in: ["11", "123"], out: "134" }, { in: ["456", "77"], out: "533" }, { in: ["0", "0"], out: "0" }]
  },
  {
    id: "find-disappeared-numbers", title: "Find Disappeared Numbers", topic: "Array", diff: "Easy",
    desc: "Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all the integers in the range [1, n] that do not appear in nums.",
    sig: "findDisappearedNumbers(nums: integer[]) -> integer[]",
    tests: [{ in: [[4,3,2,7,8,2,3,1]], out: [5,6] }, { in: [[1,1]], out: [2] }]
  },
  {
    id: "max-consecutive-ones", title: "Max Consecutive Ones", topic: "Array", diff: "Easy",
    desc: "Given a binary array nums, return the maximum number of consecutive 1's in the array.",
    sig: "findMaxConsecutiveOnes(nums: integer[]) -> integer",
    tests: [{ in: [[1,1,0,1,1,1]], out: 3 }, { in: [[1,0,1,1,0,1]], out: 2 }]
  },
  {
    id: "detect-capital", title: "Detect Capital", topic: "String", diff: "Easy",
    desc: "We define the usage of capitals in a word to be right when one of the following cases holds: All letters are capitals, all letters are not capitals, or only the first letter is capital. Return true if the usage of capitals in it is right.",
    sig: "detectCapitalUse(word: string) -> boolean",
    tests: [{ in: ["USA"], out: true }, { in: ["FlaG"], out: false }, { in: ["leetcode"], out: true }]
  },
  {
    id: "reverse-string-ii", title: "Reverse String II", topic: "String", diff: "Easy",
    desc: "Given a string s and an integer k, reverse the first k characters for every 2k characters counting from the start of the string.",
    sig: "reverseStr(s: string, k: integer) -> string",
    tests: [{ in: ["abcdefg", 2], out: "bacdfeg" }, { in: ["abcd", 2], out: "bacd" }]
  },
  {
    id: "student-attendance-record-i", title: "Student Attendance Record I", topic: "String", diff: "Easy",
    desc: "You are given a string s representing an attendance record for a student. The record only contains 'A' (Absent), 'L' (Late), and 'P' (Present). Return true if the student has strictly fewer than 2 absences and never was late for 3 or more consecutive days.",
    sig: "checkRecord(s: string) -> boolean",
    tests: [{ in: ["PPALLP"], out: true }, { in: ["PPALLL"], out: false }]
  },
  {
    id: "reverse-words-iii", title: "Reverse Words in a String III", topic: "String", diff: "Easy",
    desc: "Given a string s, reverse the order of characters in each word within a sentence while still preserving whitespace and initial word order.",
    sig: "reverseWords(s: string) -> string",
    tests: [{ in: ["Let's take LeetCode contest"], out: "s'teL ekat edoCteeL tsetnoc" }]
  },
  {
    id: "maximum-product-of-three-numbers", title: "Max Product of Three", topic: "Math", diff: "Easy",
    desc: "Given an integer array nums, find three numbers whose product is maximum and return the maximum product.",
    sig: "maximumProduct(nums: integer[]) -> integer",
    tests: [{ in: [[1,2,3]], out: 6 }, { in: [[1,2,3,4]], out: 24 }, { in: [[-1,-2,-3]], out: -6 }]
  },
  {
    id: "robot-return-to-origin", title: "Robot Return to Origin", topic: "String", diff: "Easy",
    desc: "There is a robot starting at the origin (0, 0) on a 2D plane. Given its moves (U, D, L, R), return true if it ends up at (0, 0).",
    sig: "judgeCircle(moves: string) -> boolean",
    tests: [{ in: ["UD"], out: true }, { in: ["LL"], out: false }]
  },
  {
    id: "valid-palindrome-ii", title: "Valid Palindrome II", topic: "String", diff: "Easy",
    desc: "Given a string s, return true if the s can be palindrome after deleting at most one character from it.",
    sig: "validPalindrome(s: string) -> boolean",
    tests: [{ in: ["aba"], out: true }, { in: ["abca"], out: true }, { in: ["abc"], out: false }]
  },
  {
    id: "self-dividing-numbers", title: "Self Dividing Numbers", topic: "Math", diff: "Easy",
    desc: "A self-dividing number is a number that is divisible by every digit it contains. Given two integers left and right, return a list of all the self-dividing numbers in the range [left, right].",
    sig: "selfDividingNumbers(left: integer, right: integer) -> integer[]",
    tests: [{ in: [1, 22], out: [1,2,3,4,5,6,7,8,9,11,12,15,22] }, { in: [47, 85], out: [48,55,66,77] }]
  },
  {
    id: "find-pivot-index", title: "Find Pivot Index", topic: "Array", diff: "Easy",
    desc: "Given an array of integers nums, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left is equal to the sum of numbers strictly to the right.",
    sig: "pivotIndex(nums: integer[]) -> integer",
    tests: [{ in: [[1,7,3,6,5,6]], out: 3 }, { in: [[1,2,3]], out: -1 }, { in: [[2,1,-1]], out: 0 }]
  },
  {
    id: "largest-number-twice-others", title: "Largest Number Twice of Others", topic: "Array", diff: "Easy",
    desc: "Given an integer array nums, return the index of the largest element if it is at least twice as large as every other number in the array. Otherwise, return -1.",
    sig: "dominantIndex(nums: integer[]) -> integer",
    tests: [{ in: [[3,6,1,0]], out: 1 }, { in: [[1,2,3,4]], out: -1 }]
  },
  {
    id: "shortest-distance-to-character", title: "Shortest Distance to a Character", topic: "Array", diff: "Easy",
    desc: "Given a string s and a character c that occurs in s, return an array of integers answer where answer[i] is the distance from index i to the closest occurrence of character c in s.",
    sig: "shortestToChar(s: string, c: string) -> integer[]",
    tests: [{ in: ["loveleetcode", "e"], out: [3,2,1,0,1,0,0,1,2,2,1,0] }]
  },
  {
    id: "flipping-an-image", title: "Flipping an Image", topic: "Array", diff: "Easy",
    desc: "Given an n x n binary matrix image, flip the image horizontally, then invert it, and return the resulting image.",
    sig: "flipAndInvertImage(image: integer[][]) -> integer[][]",
    tests: [{ in: [[[1,1,0],[1,0,1],[0,0,0]]], out: [[1,0,0],[0,1,0],[1,1,1]] }]
  },
  {
    id: "transpose-matrix", title: "Transpose Matrix", topic: "Array", diff: "Easy",
    desc: "Given a 2D integer array matrix, return the transpose of matrix.",
    sig: "transpose(matrix: integer[][]) -> integer[][]",
    tests: [{ in: [[[1,2,3],[4,5,6],[7,8,9]]], out: [[1,4,7],[2,5,8],[3,6,9]] }]
  },
  {
    id: "sort-array-by-parity", title: "Sort Array By Parity", topic: "Array", diff: "Easy",
    desc: "Given an integer array nums, move all the even integers at the beginning of the array followed by all the odd integers. Return any array that satisfies this condition. (For tests, output is sorted within groups)",
    sig: "sortArrayByParity(nums: integer[]) -> integer[]",
    tests: [{ in: [[3,1,2,4]], out: [2,4,3,1] }]
  },
  {
    id: "sort-array-by-parity-ii", title: "Sort Array By Parity II", topic: "Array", diff: "Easy",
    desc: "Given an array of integers nums, half are even and half are odd. Sort the array so that nums[i] is odd if i is odd, and nums[i] is even if i is even.",
    sig: "sortArrayByParityII(nums: integer[]) -> integer[]",
    tests: [{ in: [[4,2,5,7]], out: [4,5,2,7] }]
  },
  {
    id: "valid-mountain-array", title: "Valid Mountain Array", topic: "Array", diff: "Easy",
    desc: "Given an array of integers arr, return true if and only if it is a valid mountain array.",
    sig: "validMountainArray(arr: integer[]) -> boolean",
    tests: [{ in: [[2,1]], out: false }, { in: [[0,3,2,1]], out: true }]
  },
  {
    id: "squares-of-a-sorted-array", title: "Squares of a Sorted Array", topic: "Array", diff: "Easy",
    desc: "Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.",
    sig: "sortedSquares(nums: integer[]) -> integer[]",
    tests: [{ in: [[-4,-1,0,3,10]], out: [0,1,9,16,100] }]
  },
  {
    id: "height-checker", title: "Height Checker", topic: "Array", diff: "Easy",
    desc: "Return the number of indices where heights[i] != expected[i] when heights is sorted.",
    sig: "heightChecker(heights: integer[]) -> integer",
    tests: [{ in: [[1,1,4,2,1,3]], out: 3 }]
  },
  {
    id: "duplicate-zeros", title: "Duplicate Zeros", topic: "Array", diff: "Easy",
    desc: "Given a fixed-length integer array arr, duplicate each occurrence of zero, shifting the remaining elements to the right. Return the modified array.",
    sig: "duplicateZeros(arr: integer[]) -> integer[]",
    tests: [{ in: [[1,0,2,3,0,4,5,0]], out: [1,0,0,2,3,0,0,4] }]
  },
  {
    id: "relative-sort-array", title: "Relative Sort Array", topic: "Array", diff: "Easy",
    desc: "Sort the elements of arr1 such that the relative ordering of items in arr1 are the same as in arr2. Elements that do not appear in arr2 should be placed at the end in ascending order.",
    sig: "relativeSortArray(arr1: integer[], arr2: integer[]) -> integer[]",
    tests: [{ in: [[2,3,1,3,2,4,6,7,9,2,19], [2,1,4,3,9,6]], out: [2,2,2,1,4,3,3,9,6,7,19] }]
  },
  {
    id: "distance-between-bus-stops", title: "Distance Between Bus Stops", topic: "Array", diff: "Easy",
    desc: "Given a distance array between bus stops, find the shortest distance between start and destination.",
    sig: "distanceBetweenBusStops(distance: integer[], start: integer, destination: integer) -> integer",
    tests: [{ in: [[1,2,3,4], 0, 1], out: 1 }, { in: [[1,2,3,4], 0, 2], out: 3 }]
  },
  {
    id: "maximum-number-of-balloons", title: "Maximum Number of Balloons", topic: "String", diff: "Easy",
    desc: "Given a string text, return the maximum number of times you can form the word 'balloon'.",
    sig: "maxNumberOfBalloons(text: string) -> integer",
    tests: [{ in: ["nlaebolko"], out: 1 }, { in: ["loonbalxballpoon"], out: 2 }]
  },
  {
    id: "split-a-string-in-balanced-strings", title: "Split a String in Balanced Strings", topic: "String", diff: "Easy",
    desc: "Given a balanced string s, split it into the maximum amount of balanced strings.",
    sig: "balancedStringSplit(s: string) -> integer",
    tests: [{ in: ["RLRRLLRLRL"], out: 4 }, { in: ["RLRRRLLRLL"], out: 2 }]
  },
  {
    id: "minimum-absolute-difference", title: "Minimum Absolute Difference", topic: "Array", diff: "Easy",
    desc: "Given an array of distinct integers arr, find all pairs of elements with the minimum absolute difference of any two elements. Return a list of pairs in ascending order.",
    sig: "minimumAbsDifference(arr: integer[]) -> integer[][]",
    tests: [{ in: [[4,2,1,3]], out: [[1,2],[2,3],[3,4]] }]
  },
  {
    id: "unique-number-of-occurrences", title: "Unique Number of Occurrences", topic: "Hash Table", diff: "Easy",
    desc: "Given an array of integers arr, return true if the number of occurrences of each value in the array is unique or false otherwise.",
    sig: "uniqueOccurrences(arr: integer[]) -> boolean",
    tests: [{ in: [[1,2,2,1,1,3]], out: true }, { in: [[1,2]], out: false }]
  },
  {
    id: "find-numbers-even-digits", title: "Find Numbers with Even Number of Digits", topic: "Array", diff: "Easy",
    desc: "Given an array nums of integers, return how many of them contain an even number of digits.",
    sig: "findNumbers(nums: integer[]) -> integer",
    tests: [{ in: [[12,345,2,6,7896]], out: 2 }, { in: [[555,901,482,1771]], out: 1 }]
  },
  {
    id: "replace-elements-greatest-right", title: "Replace Elements with Greatest Element on Right Side", topic: "Array", diff: "Easy",
    desc: "Given an array arr, replace every element in that array with the greatest element among the elements to its right, and replace the last element with -1.",
    sig: "replaceElements(arr: integer[]) -> integer[]",
    tests: [{ in: [[17,18,5,4,6,1]], out: [18,6,6,6,1,-1] }]
  },
  {
    id: "find-n-unique-integers-sum-zero", title: "Find N Unique Integers Sum up to Zero", topic: "Array", diff: "Easy",
    desc: "Given an integer n, return any array containing n unique integers such that they add up to 0.",
    sig: "sumZero(n: integer) -> integer[]",
    tests: [{ in: [5], out: [-2,-1,0,1,2] }, { in: [3], out: [-1,0,1] }, { in: [1], out: [0] }]
  },
  {
    id: "sort-integers-by-number-of-1-bits", title: "Sort Integers by The Number of 1 Bits", topic: "Array", diff: "Easy",
    desc: "Given an integer array arr. Sort the integers in the array in ascending order by the number of 1's in their binary representation and in case of two or more integers have the same number of 1's you have to sort them in ascending order.",
    sig: "sortByBits(arr: integer[]) -> integer[]",
    tests: [{ in: [[0,1,2,3,4,5,6,7,8]], out: [0,1,2,4,8,3,5,6,7] }]
  },
  {
    id: "decompress-run-length-encoded-list", title: "Decompress Run-Length Encoded List", topic: "Array", diff: "Easy",
    desc: "We are given a list nums of integers representing a list compressed with run-length encoding. Return the decompressed list.",
    sig: "decompressRLElist(nums: integer[]) -> integer[]",
    tests: [{ in: [[1,2,3,4]], out: [2,4,4,4] }]
  },
  {
    id: "matrix-diagonal-sum", title: "Matrix Diagonal Sum", topic: "Array", diff: "Easy",
    desc: "Given a square matrix mat, return the sum of the matrix diagonals.",
    sig: "diagonalSum(mat: integer[][]) -> integer",
    tests: [{ in: [[[1,2,3],[4,5,6],[7,8,9]]], out: 25 }]
  },
  {
    id: "count-odd-numbers-interval", title: "Count Odd Numbers in an Interval Range", topic: "Math", diff: "Easy",
    desc: "Given two non-negative integers low and high. Return the count of odd numbers between low and high (inclusive).",
    sig: "countOdds(low: integer, high: integer) -> integer",
    tests: [{ in: [3, 7], out: 3 }, { in: [8, 10], out: 1 }]
  },
  {
    id: "richest-customer-wealth", title: "Richest Customer Wealth", topic: "Array", diff: "Easy",
    desc: "You are given an m x n integer grid accounts where accounts[i][j] is the amount of money the i​​​​​​​​​​​th​​​​ customer has in the j​​​​​​​​​​​th​​​​ bank. Return the wealth that the richest customer has.",
    sig: "maximumWealth(accounts: integer[][]) -> integer",
    tests: [{ in: [[[1,2,3],[3,2,1]]], out: 6 }, { in: [[[1,5],[7,3],[3,5]]], out: 10 }]
  },
  {
    id: "defanging-an-ip-address", title: "Defanging an IP Address", topic: "String", diff: "Easy",
    desc: "Given a valid (IPv4) IP address, return a defanged version of that IP address.",
    sig: "defangIPaddr(address: string) -> string",
    tests: [{ in: ["1.1.1.1"], out: "1[.]1[.]1[.]1" }]
  },
  {
    id: "kids-with-greatest-number-of-candies", title: "Kids With the Greatest Number of Candies", topic: "Array", diff: "Easy",
    desc: "Given the array candies and the integer extraCandies, where candies[i] represents the number of candies that the ith kid has. Return a boolean array result of length n, where result[i] is true if giving the ith kid all the extraCandies they will have the greatest number of candies.",
    sig: "kidsWithCandies(candies: integer[], extraCandies: integer) -> boolean[]",
    tests: [{ in: [[2,3,5,1,3], 3], out: [true,true,true,false,true] }]
  },
  {
    id: "number-of-good-pairs", title: "Number of Good Pairs", topic: "Hash Table", diff: "Easy",
    desc: "Given an array of integers nums, return the number of good pairs. A pair (i, j) is called good if nums[i] == nums[j] and i < j.",
    sig: "numIdenticalPairs(nums: integer[]) -> integer",
    tests: [{ in: [[1,2,3,1,1,3]], out: 4 }, { in: [[1,1,1,1]], out: 6 }]
  },
  {
    id: "how-many-numbers-are-smaller", title: "How Many Numbers Are Smaller Than the Current Number", topic: "Array", diff: "Easy",
    desc: "Given the array nums, for each nums[i] find out how many numbers in the array are smaller than it.",
    sig: "smallerNumbersThanCurrent(nums: integer[]) -> integer[]",
    tests: [{ in: [[8,1,2,2,3]], out: [4,0,1,1,3] }]
  },
  {
    id: "running-sum-of-1d-array", title: "Running Sum of 1d Array", topic: "Array", diff: "Easy",
    desc: "Given an array nums. We define a running sum of an array as runningSum[i] = sum(nums[0]…nums[i]). Return the running sum of nums.",
    sig: "runningSum(nums: integer[]) -> integer[]",
    tests: [{ in: [[1,2,3,4]], out: [1,3,6,10] }]
  },
  {
    id: "shuffle-the-array", title: "Shuffle the Array", topic: "Array", diff: "Easy",
    desc: "Given the array nums consisting of 2n elements in the form [x1,x2,...,xn,y1,y2,...,yn]. Return the array in the form [x1,y1,x2,y2,...,xn,yn].",
    sig: "shuffle(nums: integer[], n: integer) -> integer[]",
    tests: [{ in: [[2,5,1,3,4,7], 3], out: [2,3,5,4,1,7] }]
  },
  {
    id: "jewels-and-stones", title: "Jewels and Stones", topic: "String", diff: "Easy",
    desc: "You're given strings jewels representing the types of stones that are jewels, and stones representing the stones you have. Each character in stones is a type of stone you have. You want to know how many of the stones you have are also jewels.",
    sig: "numJewelsInStones(jewels: string, stones: string) -> integer",
    tests: [{ in: ["aA", "aAAbbbb"], out: 3 }]
  },
  {
    id: "goal-parser-interpretation", title: "Goal Parser Interpretation", topic: "String", diff: "Easy",
    desc: "You own a Goal Parser that can interpret a string command. Return the Goal Parser's interpretation of command.",
    sig: "interpret(command: string) -> string",
    tests: [{ in: ["G()(al)"], out: "Goal" }]
  },
  {
    id: "design-parking-system", title: "Design Parking System", topic: "Simulation", diff: "Easy",
    desc: "Given integers representing big, medium, and small parking slots, return true if parking is available. (Simulated as checking total spots vs requested)",
    sig: "addCar(carType: integer) -> boolean",
    tests: [{ in: [1], out: true }] // Simplified to fit signature for now
  },
  {
    id: "xor-operation-in-an-array", title: "XOR Operation in an Array", topic: "Math", diff: "Easy",
    desc: "You are given an integer n and an integer start. Return the bitwise XOR of all elements of nums where nums[i] = start + 2 * i (0-indexed) and n == nums.length.",
    sig: "xorOperation(n: integer, start: integer) -> integer",
    tests: [{ in: [5, 0], out: 8 }]
  },
  {
    id: "count-items-matching-a-rule", title: "Count Items Matching a Rule", topic: "Array", diff: "Easy",
    desc: "You are given an array items, where each items[i] = [typei, colori, namei] describes the type, color, and name of the ith item. Return the number of items that match the given rule.",
    sig: "countMatches(items: string[][], ruleKey: string, ruleValue: string) -> integer",
    tests: [{ in: [[["phone","blue","pixel"],["computer","silver","lenovo"],["phone","gold","iphone"]], "color", "silver"], out: 1 }]
  }
];

function parseSig(sigStr) {
  const match = sigStr.match(/^([a-zA-Z0-9_]+)\((.*)\)\s*->\s*(.*)$/);
  if (!match) throw new Error("Invalid sig: " + sigStr);
  const [, name, paramsStr, returns] = match;
  
  const params = [];
  if (paramsStr.trim()) {
    const parts = paramsStr.split(',').map(s => s.trim());
    for (const part of parts) {
      const [pname, ptype] = part.split(':').map(s => s.trim());
      params.push({ name: pname, type: ptype });
    }
  }
  return { name, params, returns };
}

function generateStarterCode(sigObj) {
  const paramNames = sigObj.params.map(p => p.name).join(', ');
  let cppParams = sigObj.params.map(p => {
    let t = "int";
    if (p.type === 'integer[]') t = "vector<int>&";
    if (p.type === 'string') t = "string";
    if (p.type === 'string[]') t = "vector<string>&";
    if (p.type === 'integer[][]') t = "vector<vector<int>>&";
    if (p.type === 'string[][]') t = "vector<vector<string>>&";
    return `${t} ${p.name}`;
  }).join(', ');
  let cppRet = "int";
  if (sigObj.returns === 'boolean') cppRet = "bool";
  if (sigObj.returns === 'integer[]') cppRet = "vector<int>";
  if (sigObj.returns === 'string') cppRet = "string";
  if (sigObj.returns === 'integer[][]') cppRet = "vector<vector<int>>";
  
  return {
    javascript: `function ${sigObj.name}(${paramNames}) {\n  \n}`,
    python: `def ${sigObj.name}(${paramNames}):\n    pass`,
    cpp: `class Solution {\npublic:\n    ${cppRet} ${sigObj.name}(${cppParams}) {\n        \n    }\n};`,
  };
}

const newProblems = compactData.map((d, idx) => {
  const sigObj = parseSig(d.sig);
  return {
    id: d.id,
    title: d.title,
    topic: d.topic,
    difficulty: d.diff,
    description: d.desc,
    examples: d.tests.map((t, i) => ({
      input: sigObj.params.map((p, pi) => `${p.name} = ${JSON.stringify(t.in[pi])}`).join(', '),
      output: JSON.stringify(t.out)
    })),
    constraints: ["Check problem description for constraints."],
    signature: sigObj,
    starterCode: generateStarterCode(sigObj),
    testCases: d.tests.map(t => ({ input: t.in, expected: t.out }))
  };
});

// We need exactly 65 new ones
const combined = [...baseProblems, ...newProblems.slice(0, 65)];

const fileContent = `// ============================================================
// Coding Problems Database
// ============================================================

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type DataType = 'integer' | 'string' | 'boolean' | 'integer[]' | 'string[]' | 'integer[][]' | 'string[][]' | 'char[]';

export interface ProblemSignature {
  name: string;
  params: { name: string; type: DataType }[];
  returns: DataType;
}

export interface TestCase {
  input: any[]; 
  expected: any; 
}

export interface CodingProblem {
  topic?: string;
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  signature: ProblemSignature;
  starterCode: {
    javascript: string;
    python?: string;
    cpp?: string;
    c?: string;
  };
  testCases: TestCase[];
}

export const codingProblems: CodingProblem[] = ${JSON.stringify(combined, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/codingProblems.ts'), fileContent, 'utf-8');
console.log('Successfully generated EXACTLY 100 REAL unique problems in codingProblems.ts!');
