# forms-web3forms-v1.0.md — Web3Forms Lead Capture Setup

## Why Web3Forms

- **Free tier**: 250 submissions/month, emails every submission directly to your inbox
- **No backend**: pure HTML form — works on any static site
- **Data safety**: each lead is emailed to the founder immediately; the 30-day dashboard
  submission history limit does NOT cause data loss since leads live in your email inbox
- **hCaptcha**: supported natively, free

---

## Step 1: Get Your Free Access Key

1. Go to web3forms.com
2. Enter your email address -> click "Create Access Key"
3. Check email for the access key (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
4. Save the key in your local `.env` file as `WEB3FORMS_ACCESS_KEY=your_key_here`
   (The key goes IN the HTML — it's a public key by design, not a secret)

---

## Step 2: HTML Form Template

Paste this into `build/src/index.html` in the CTA section.
Replace `YOUR_ACCESS_KEY_HERE` with your actual key.

```html
<form
  id="audit-form"
  action="https://api.web3forms.com/submit"
  method="POST"
  novalidate
>
  <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE" />
  <input type="hidden" name="subject" value="New Free Audit Request — KylixAI" />
  <input type="hidden" name="botcheck" />

  <div class="form-group">
    <label for="name">Your name</label>
    <input type="text" id="name" name="name" placeholder="Jane Smith" required autocomplete="name" />
  </div>

  <div class="form-group">
    <label for="email">Business email</label>
    <input type="email" id="email" name="email" placeholder="jane@yourbusiness.com" required autocomplete="email" />
  </div>

  <div class="form-group">
    <label for="business">What does your business do?</label>
    <input type="text" id="business" name="business" placeholder="e.g. HVAC contractor, law firm, retail store" />
  </div>

  <div class="h-captcha" data-captcha="true"></div>

  <button type="submit" class="cta-button">Book my free audit</button>

  <div id="form-result" aria-live="polite" hidden></div>
</form>

<script src="https://web3forms.com/client/script.js" async defer></script>
```

---

## Step 3: JavaScript Success/Error Handling

```html
<script>
  const form = document.getElementById('audit-form');
  const result = document.getElementById('form-result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    result.hidden = false;
    result.textContent = 'Sending...';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: json,
      });
      const data = await response.json();
      if (data.success) {
        result.textContent = "You're in. Check your inbox — we'll be in touch shortly.";
        form.reset();
      } else {
        result.textContent = 'Something went wrong. Try emailing us directly at hello@kylixai.com';
      }
    } catch {
      result.textContent = 'Connection error. Please try again or email hello@kylixai.com';
    }
  });
</script>
```

---

## Step 4: Test the Form

1. Deploy to Cloudflare Pages (or open index.html locally)
2. Submit a test entry with your own name/email
3. Confirm the email arrives in the founder's inbox within 60 seconds
4. Check the Web3Forms dashboard to confirm the submission appears
5. If email doesn't arrive: check spam folder; verify access key is correct in HTML

---

## Fallback: Calendar / Email Link

If Web3Forms is unavailable or the form feels like too much friction:
- Calendar link: `<a href="${CALENDAR_BOOKING_URL}">Book directly</a>`
- Email fallback: `<a href="mailto:hello@kylixai.com?subject=Free Audit Request">Email instead</a>`

---

## Free Tier Limits

| Limit | Value |
|-------|-------|
| Submissions/month | 250 |
| Email delivery | Every submission, immediately, no limit |
| Dashboard history | 30 days (emails are permanent — no data loss) |

At 250+ leads/month, upgrade to Web3Forms Pro ($9/month).
