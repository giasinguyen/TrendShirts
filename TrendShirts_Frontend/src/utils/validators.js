function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateRequired(value) {
  return value.trim() !== '';
}

export { validateEmail, validatePassword, validateRequired };