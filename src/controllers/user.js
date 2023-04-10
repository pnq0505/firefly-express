import { validationResult } from 'express-validator';
import { v1 } from 'uuid';

import { UserData } from '../data/index.js';

export const createUser = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ success: false, data: null, error: errors.array() });
  }

  const { firstname, lastname, age, coordinate } = req.body;
  const id = v1();

  res.send({
    success: true,
    data: { id, firstname, lastname, age, coordinate },
    error: null,
  });
};

export const getUser = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ success: false, data: null, error: errors.array() });
  }

  const { id } = req.query;
  const user = UserData.find((user) => user.id === id);

  if (!user) {
    return res
      .status(404)
      .json({ success: false, data: null, error: 'user not found' });
  }

  res.send({ success: true, data: user, error: null });
};

export const searchUsers = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ success: false, data: null, error: errors.array() });
  }

  const { name } = req.query;
  const filteredUsers = UserData.filter(
    (user) =>
      user.firstname.toLowerCase().includes(name) ||
      user.lastname.toLowerCase().includes(name)
  );

  if (filteredUsers.length === 0) {
    return res
      .status(404)
      .json({ success: false, data: null, error: 'users not found' });
  }

  res.send({ success: true, data: filteredUsers, error: null });
};

export const updateUser = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ success: false, data: null, error: errors.array() });
  }

  const { id } = req.params;

  const user = UserData.find((user) => user.id === id);

  if (!user) {
    return res
      .status(404)
      .json({ success: false, data: null, error: 'user not found' });
  }

  const newUser = { ...user, ...req.body };
  res.send({ success: true, data: newUser, error: null });
};

export const removeUser = (req, res) => {
  const { id } = req.params;

  const user = UserData.find((user) => user.id === id);
  if (!user) {
    return res
      .status(404)
      .json({ success: false, data: null, error: 'user not found' });
  }

  const newUsers = UserData.filter((user) => user.id !== id);
  return res.status(204).send();
};

export const locateUsers = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ success: false, data: null, error: errors.array() });
  }

  const { n, userId } = req.query;

  const sortedUsers = UserData.sort((a, b) =>
    a.coordinate > b.coordinate ? 1 : b.coordinate > a.coordinate ? -1 : 0
  );

  if (sortedUsers.length <= n) {
    res.send({ success: true, data: sortedUsers, error: null });
  }

  const userIndex = sortedUsers.findIndex((user) => user.id === userId);
  if (userIndex < 0) {
    return res
      .status(404)
      .json({ success: false, data: null, error: 'user not found' });
  }

  res.send({
    success: true,
    data: findClosestElements(sortedUsers, userIndex, n),
    error: null,
  });
};

const findClosestElements = (arr, centerIndex, n) => {
  let right = centerIndex + 1;
  let left = centerIndex - 1;
  let count = 1;
  let result = [arr[centerIndex]];

  while (left >= 0 && right < arr.length && count < n) {
    if (centerIndex - left < right - centerIndex) {
      result.push(arr[left]);
      left -= 1;
    } else {
      result.push(arr[right]);
      right += 1;
    }
    count += 1;
  }

  while (left >= 0 && count < n) {
    result.push(arr[left]);
    left -= 1;
    count += 1;
  }

  while (right < arr.length && count < n) {
    result.push(arr[right]);
    right += 1;
    count += 1;
  }
  return result;
};
