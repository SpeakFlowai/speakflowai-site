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

    const email = fields["Email"] || fields["email"] || fields["E-mail"] || "";
    const prenom = fields["First name"] || fields["Prénom"] || fields["prenom"] || "";

    if (!email) {
      return { statusCode: 400, body: "Email manquant" };
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        attributes: { PRENOM: prenom },
        listIds: [3],
        updateEnabled: true
      })
    });

    const responseText = await response.text();
    
    return {
      statusCode: 200,
      body: "OK: " + responseText
    };

  } catch(e) {
    return {
      statusCode: 500,
      body: "Erreur: " + e.toString()
    };
  }
};
