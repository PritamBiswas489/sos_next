export default async function handler(req, res) {
  const { captcha } = req.body;

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
    }
  );

  const data = await response.json();

  if (!data.success) {
    return res.status(400).json({ message: "Captcha failed" });
  }

  return res.status(200).json({ message: "Captcha verified" });
}