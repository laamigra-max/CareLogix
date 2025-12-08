// ============================================================================
// CARELOGIX DGII WORKER – VERSION 5.0
// AUTOR: Master Sensei (CARELOGIX CRG SRL)
// FECHA: 2025-12-05
// ============================================================================
//
// RUTAS DISPONIBLES:
//   POST /uploadFacturaImagen
//   POST /insertFactura
//   POST /debug
//
// FLUJO:
//
// 1️⃣ uploadFacturaImagen
//     - Guarda imagen en OneDrive
//     - Requiere: fileName, fileBase64, fechaComprobante
//     - Crea carpeta YYYYMM automáticamente
//
// 2️⃣ insertFactura
//     - Inserta fila en Excel (Table1)
//
// 3️⃣ debug
//     - Devuelve el JSON recibido
//
// ============================================================================



// ============================================================================
// 1. TOKEN OAUTH2 (CLIENT CREDENTIALS)
// ============================================================================
async function getAccessToken() {
  const form = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const resp = await fetch(
    `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    }
  );

  if (!resp.ok) {
    return { error: "Error obteniendo token", detail: await resp.text() };
  }

  const json = await resp.json();
  return json.access_token;
}



// ============================================================================
// 2. CREAR O VERIFICAR CARPETA MENSUAL (YYYYMM)
// ============================================================================
async function ensureMonthlyFolder(token, driveId, monthCode) {
  const folderPath = `CARELOGIX_Imagenes_Facturas/${monthCode}`;
  const checkUrl = `https://graph.microsoft.com/v1.0/drives/${driveId}/root:/${folderPath}`;

  const check = await fetch(checkUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (check.status === 200) return folderPath;

  // Crear carpeta mensual
  const createUrl = `https://graph.microsoft.com/v1.0/drives/${driveId}/root/children`;
  const body = {
    name: monthCode,
    folder: {},
    "@microsoft.graph.conflictBehavior": "replace",
  };

  const createResp = await fetch(createUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!createResp.ok) {
    console.log("Error creando carpeta mensual:", await createResp.text());
    return null;
  }

  return folderPath;
}



// ============================================================================
// 3. SUBIR IMAGEN DE FACTURA (PASO 1)
// ============================================================================
export async function uploadFacturaImagen(request) {
  let data;

  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { fileName, fileBase64, fechaComprobante } = data;

  if (!fileName || !fileBase64 || !fechaComprobante) {
    return Response.json(
      { error: "Faltan parámetros: fileName, fileBase64 o fechaComprobante" },
      { status: 400 }
    );
  }

  const token = await getAccessToken();
  if (!token || token.error) {
    return Response.json(
      { error: "No se pudo obtener token", detail: token },
      { status: 500 }
    );
  }

  const monthCode = fechaComprobante.substring(0, 6);
  const folderPath = await ensureMonthlyFolder(token, DRIVE_ID, monthCode);

  if (!folderPath) {
    return Response.json(
      { error: "No se pudo crear o verificar la carpeta mensual" },
      { status: 500 }
    );
  }

  // Convertir base64 → binario
  let binary;
  try {
    const clean = fileBase64.split(",").pop();
    binary = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
  } catch (err) {
    return Response.json(
      { error: "Base64 inválido", detail: String(err) },
      { status: 400 }
    );
  }

  const uploadUrl =
    `https://graph.microsoft.com/v1.0/drives/${DRIVE_ID}/root:/${folderPath}/${fileName}:/content`;

  const resp = await fetch(uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: binary,
  });

  const json = await resp.json();

  if (!resp.ok) {
    return Response.json(
      { error: "Error subiendo imagen", detail: json },
      { status: 500 }
    );
  }

  return Response.json(
    {
      status: "OK",
      fileName,
      folder: folderPath,
      webUrl: json.webUrl,
      graphResponse: json,
    },
    { status: 200 }
  );
}



// ============================================================================
// 4. INSERTAR LÍNEA EN EXCEL (PASO 2)
// ============================================================================
export async function insertFactura(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.values || !Array.isArray(body.values)) {
    return Response.json(
      { error: "Debe enviar 'values' como matriz de matriz" },
      { status: 400 }
    );
  }

  const token = await getAccessToken();
  if (!token || token.error) {
    return Response.json(
      { error: "No se pudo obtener token", detail: token },
      { status: 500 }
    );
  }

  const url =
    `https://graph.microsoft.com/v1.0/drives/${DRIVE_ID}/items/${EXCEL_ITEM_ID}` +
    `/workbook/tables/Table1/rows/add`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await resp.json();

  if (!resp.ok) {
    return Response.json(
      { error: "Error insertando factura", detail: json },
      { status: 500 }
    );
  }

  return Response.json(
    {
      status: "OK",
      inserted: json.values ?? body.values,
      graphResponse: json,
    },
    { status: 200 }
  );
}



// ============================================================================
// 5. DEBUG
// ============================================================================
export async function debug(request) {
  try {
    const body = await request.json();
    return Response.json({ recibido: body }, { status: 200 });
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }
}



// ============================================================================
// 6. ROUTER PRINCIPAL
// ============================================================================
export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname === "/uploadFacturaImagen" && request.method === "POST") {
      return uploadFacturaImagen(request);
    }

    if (pathname === "/insertFactura" && request.method === "POST") {
      return insertFactura(request);
    }

    if (pathname === "/debug" && request.method === "POST") {
      return debug(request);
    }

    return Response.json(
      {
        error: "Ruta no válida",
        rutas: [
          "POST /uploadFacturaImagen",
          "POST /insertFactura",
          "POST /debug"
        ],
      },
      { status: 404 }
    );
  },
};
