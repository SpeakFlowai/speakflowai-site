exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body);
    const fields = {};
    
    payload.data.fields.forEach(function(f) {
      fields[f.label] = f.value;
    });

    console.log("Tous les champs:", JSON.stringify(fields));
const email = fields["Email "] || fields["Email"] || fields["email"] || "";
    const prenom = fields["First name"] || fields["Prénom"] || "";

    console.log("Email reçu:", email);
    console.log("Prénom reçu:", prenom);

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        attributes: { FIRSTNAME: prenom },
        listIds: [3],
        updateEnabled: true
      })
    });

    const responseText = await response.text();
    console.log("Réponse Brevo:", response.status, responseText);

    return { statusCode: 200, body: "OK" };

  } catch(e) {
    console.log("Erreur:", e.toString());
    return { statusCode: 500, body: e.toString() };
  }
};
