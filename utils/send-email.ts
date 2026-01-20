import { FormData } from '@/components/contact';

export function sendEmail(data: FormData) {
  const apiEndpoint = '/api/email';

  fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.message) {
        alert(response.message);
      } else if (response.error) {
        alert('Error: ' + response.error);
      }
    })
    .catch((err) => {
      console.error('Error sending email:', err);
      alert('Failed to send email. Please try again.');
    });
}
