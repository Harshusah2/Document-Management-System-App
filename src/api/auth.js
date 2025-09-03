const BASE_URL = 'http://10.0.2.2:3001/api/documentManagement';

export async function registerMobile(mobile_number) {
  const response = await fetch(`${BASE_URL}/registerMobile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile_number }),
  });
  return response.json();
}

export async function generateOTP(mobile_number) {
  const response = await fetch(`${BASE_URL}/generateOTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile_number }),
  });
  return response.json();
}

export async function validateOTP(mobile_number, otp) {
  const response = await fetch(`${BASE_URL}/validateOTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile_number, otp }),
  });
  return response.json();
}

export async function logout(mobile_number) {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile_number }),
  });
  return response.json();
}