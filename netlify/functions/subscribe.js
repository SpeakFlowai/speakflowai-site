
exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body);
    const fields = {};
    payload.data.fields.forEach((f) => {
      fields[f.label] = f.value;
    });

    const email = fields["Email"] || fields["email"] || fields["E-mail"];
    const prenom = fields["Prénom"] || fields["prenom"] || fields["Prenom"] || "";

    if (!email) {
      return { statusCode: 400, body: "Email manquant" };
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        attributes: { PRENOM: prenom },
        listIds: [3],
        updateEnabled: true,
      }),
    });

    if (response.ok || response.status === 204) {
      return { statusCode: 200, body: "OK" };
    } else {
      const err = await response.text();
      return { statusCode: 500, body: err };
    }
  } catch (e) {
    return { statusCode:
