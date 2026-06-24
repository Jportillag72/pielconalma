const CONTACT_TO = process.env.CONTACT_TO || "info@pielconalma.com";
const CONTACT_FROM = process.env.CONTACT_FROM || "Piel Con Alma <noreply@pielconalma.com>";

function sanitize(value = "") {
  return String(value).replace(/[<>]/g, "").trim();
}

function escapeHtml(value = "") {
  return sanitize(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Método no permitido." });
  }

  if (!process.env.RESEND_API_KEY) {
    return response.status(500).json({
      message: "El servicio de envío aún no está configurado.",
    });
  }

  const body = request.body || {};
  const name = sanitize(body.name);
  const phone = sanitize(body.phone);
  const treatment = sanitize(body.treatment);
  const message = sanitize(body.message);

  if (!name || !phone || !treatment) {
    return response.status(400).json({
      message: "Faltan datos obligatorios para enviar la consulta.",
    });
  }

  const subject = `Consulta web · ${treatment}`;
  const text = [
    "Nueva consulta desde la web de Piel Con Alma",
    "",
    `Nombre: ${name}`,
    `Teléfono: ${phone}`,
    `Tratamiento de interés: ${treatment}`,
    message ? `Consulta: ${message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#211b18">
      <h1 style="font-size:24px;margin:0 0 16px">Nueva consulta desde la web</h1>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Tratamiento de interés:</strong> ${escapeHtml(treatment)}</p>
      ${message ? `<p><strong>Consulta:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>` : ""}
    </div>
  `;

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: CONTACT_TO,
        subject,
        text,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.json().catch(() => ({}));
      return response.status(502).json({
        message: errorBody.message || "El proveedor de email no ha aceptado el envío.",
      });
    }

    return response.status(200).json({ ok: true });
  } catch {
    return response.status(502).json({
      message: "No se ha podido conectar con el servicio de email.",
    });
  }
}
